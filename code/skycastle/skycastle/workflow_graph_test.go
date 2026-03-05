package skycastle

import (
	"fmt"
	"testing"
)

func must[T any](t *testing.T, v T, err error) T {
	t.Helper()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	return v
}

func TestBuild_ProducersAreOnlyFromOutputs_NotFromInputs(t *testing.T) {
	b := NewWorkflowGraphBuilder()

	// A (source) -> act -> B (goal)
	act := b.AddAction("echo hi")

	a := b.AddFileArtifact(WithArtifactDescription("A/source"))
	bb := b.AddFileArtifact(WithArtifactDescription("B/out"))

	if err := b.AddInput(act, Port("in"), a); err != nil {
		t.Fatalf("AddInput: %v", err)
	}
	if err := b.AddOutput(act, Port("out"), bb); err != nil {
		t.Fatalf("AddOutput: %v", err)
	}

	wf, err := b.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{bb}, nil)
	if err != nil {
		t.Fatalf("Build: %v", err)
	}

	spec, ok := wf.(*WorkflowSpec)
	if !ok {
		t.Fatalf("expected *WorkflowSpec, got %T", wf)
	}

	aID := b.ArtifactHandles[a]
	bID := b.ArtifactHandles[bb]

	// Source artifact A should NOT have a producer entry.
	if _, ok := spec.producers[aID]; ok {
		t.Fatalf("BUG: input artifact A unexpectedly has a producer; this will create digest cycles")
	}

	// Output artifact B should have a producer entry pointing at act/out.
	p, ok := spec.producers[bID]
	if !ok {
		t.Fatalf("expected output artifact B to have a producer")
	}
	actID := b.ActionHandles[act]
	if p.ActionId != actID || p.Port != Port("out") {
		t.Fatalf("unexpected producer for B: got (%v,%v), want (%v,%v)", p.ActionId, p.Port, actID, Port("out"))
	}
}

func TestBuild_ConsumersAreOnlyFromInputs_NotFromOutputs(t *testing.T) {
	b := NewWorkflowGraphBuilder()

	act := b.AddAction("do thing")

	a := b.AddFileArtifact(WithArtifactDescription("A/source"))
	bb := b.AddFileArtifact(WithArtifactDescription("B/out"))

	if err := b.AddInput(act, Port("in"), a); err != nil {
		t.Fatalf("AddInput: %v", err)
	}
	if err := b.AddOutput(act, Port("out"), bb); err != nil {
		t.Fatalf("AddOutput: %v", err)
	}

	wf, err := b.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{bb}, nil)
	if err != nil {
		t.Fatalf("Build: %v", err)
	}
	spec := wf.(*WorkflowSpec)

	aID := b.ArtifactHandles[a]
	bID := b.ArtifactHandles[bb]
	actID := b.ActionHandles[act]

	// A is consumed by act/in
	consA := spec.consumers[aID]
	if len(consA) != 1 {
		t.Fatalf("expected exactly 1 consumer for A, got %d", len(consA))
	}
	if consA[0].ActionId != actID || consA[0].Port != Port("in") {
		t.Fatalf("unexpected consumer for A: got (%v,%v), want (%v,%v)", consA[0].ActionId, consA[0].Port, actID, Port("in"))
	}

	// B is produced, not consumed. It should have zero consumers.
	// (If you want “consumers” to mean “incident actions” that include both
	// producer+consumer, rename it; but for normal workflow semantics this should be empty.)
	if len(spec.consumers[bID]) != 0 {
		t.Fatalf("BUG: output artifact B unexpectedly has consumers (%d); outputs should not be recorded as consumers", len(spec.consumers[bID]))
	}
}

func TestDigest_DeterministicWithPortMapOrder(t *testing.T) {
	// Two separate builders produce semantically identical graphs but
	// we wire inputs in opposite order. Digest should match because edgeDigest sorts ports.
	build := func(reverse bool) Digest {
		b := NewWorkflowGraphBuilder()
		act := b.AddAction("compile", WithPolicyOptions(WithMaxRetries(3)))

		in1 := b.AddFileArtifact(WithArtifactDescription("in1"))
		in2 := b.AddFileArtifact(WithArtifactDescription("in2"))
		out := b.AddFileArtifact(WithArtifactDescription("out"))

		if reverse {
			_ = b.AddInput(act, Port("b"), in2)
			_ = b.AddInput(act, Port("a"), in1)
		} else {
			_ = b.AddInput(act, Port("a"), in1)
			_ = b.AddInput(act, Port("b"), in2)
		}
		_ = b.AddOutput(act, Port("out"), out)

		wf, err := b.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{out}, nil)
		if err != nil {
			t.Fatalf("Build: %v", err)
		}
		return wf.Digest()
	}

	d1 := build(false)
	d2 := build(true)
	if d1 != d2 {
		t.Fatalf("digest mismatch for equivalent graphs: %x vs %x", d1, d2)
	}
}

func TestDigest_ChangesWhenCommandChanges(t *testing.T) {
	b := NewWorkflowGraphBuilder()
	act1 := b.AddAction("echo hi")
	in := b.AddFileArtifact()
	out := b.AddFileArtifact()

	_ = b.AddInput(act1, Port("in"), in)
	_ = b.AddOutput(act1, Port("out"), out)

	res, err := b.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{out}, nil)
	wf1 := must(t, res, err)
	d1 := wf1.Digest()

	// Same structure, different command => different digest
	b2 := NewWorkflowGraphBuilder()
	act2 := b2.AddAction("echo bye")
	in2 := b2.AddFileArtifact()
	out2 := b2.AddFileArtifact()

	_ = b2.AddInput(act2, Port("in"), in2)
	_ = b2.AddOutput(act2, Port("out"), out2)

	res, err = b2.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{out2}, nil)
	wf2 := must(t, res, err)
	d2 := wf2.Digest()

	if d1 == d2 {
		t.Fatalf("expected digest to change when command changes")
	}
}

func TestDigest_IgnoresDescriptions(t *testing.T) {
	// Per your stated intent: "descriptions do not [matter]".
	// Your digest code currently ignores node/edge descriptions.
	build := func(desc string) Digest {
		b := NewWorkflowGraphBuilder()
		act := b.AddAction("run", WithActionDescription(desc))
		in := b.AddFileArtifact(WithArtifactDescription(desc))
		out := b.AddFileArtifact(WithArtifactDescription(desc))

		_ = b.AddInput(act, Port("in"), in)
		_ = b.AddOutput(act, Port("out"), out)

		res, err := b.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{out}, nil)
		wf := must(t, res, err)
		return wf.Digest()
	}

	d1 := build("first")
	d2 := build("second")
	if d1 != d2 {
		t.Fatalf("expected digest to ignore descriptions, but got %x vs %x", d1, d2)
	}
}

func TestDigest_ChangesWhenPolicyChanges(t *testing.T) {
	build := func(maxRetries int) Digest {
		b := NewWorkflowGraphBuilder()
		act := b.AddAction("run", WithPolicyOptions(WithMaxRetries(maxRetries)))
		in := b.AddFileArtifact()
		out := b.AddFileArtifact()

		_ = b.AddInput(act, Port("in"), in)
		_ = b.AddOutput(act, Port("out"), out)

		res, err := b.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{out}, nil)
		wf := must(t, res, err)
		return wf.Digest()
	}

	d1 := build(1)
	d2 := build(2)
	if d1 == d2 {
		t.Fatalf("expected digest to change when policy changes")
	}
}

func TestDigest_IgnoresUnreachableGraphParts(t *testing.T) {
	b := NewWorkflowGraphBuilder()

	// Main: A -> act -> B (goal)
	act := b.AddAction("main")
	a := b.AddFileArtifact()
	bb := b.AddFileArtifact()
	_ = b.AddInput(act, Port("in"), a)
	_ = b.AddOutput(act, Port("out"), bb)

	// Unreachable junk
	jAct := b.AddAction("junk")
	jIn := b.AddFileArtifact()
	jOut := b.AddFileArtifact()
	_ = b.AddInput(jAct, Port("in"), jIn)
	_ = b.AddOutput(jAct, Port("out"), jOut)

	res, err := b.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{bb}, nil)

	wf := must(t, res, err)
	d1 := wf.Digest()

	// Now remove the junk by rebuilding without it and compare digests.
	b2 := NewWorkflowGraphBuilder()
	act2 := b2.AddAction("main")
	a2 := b2.AddFileArtifact()
	b2out := b2.AddFileArtifact()
	_ = b2.AddInput(act2, Port("in"), a2)
	_ = b2.AddOutput(act2, Port("out"), b2out)

	res, err = b2.Build(Target{Path: Path[Relative, File]{path: "p"}, Name: "t"}, []ArtifactHandle{b2out}, nil)
	wf2 := must(t, res, err)
	d2 := wf2.Digest()

	if d1 != d2 {
		t.Fatalf("expected digest to ignore unreachable subgraph, but got %x vs %x", d1, d2)
	}
}

func TestUnion_HandleValidityAfterUnion(t *testing.T) {
	// Test that all handles remain valid and usable after Union operation
	leftBuilder := NewWorkflowGraphBuilder()
	rightBuilder := NewWorkflowGraphBuilder()

	// Build left graph: A -> act1 -> B
	leftAct := leftBuilder.AddAction("left action", WithActionDescription("left"))
	leftIn := leftBuilder.AddFileArtifact(WithArtifactDescription("left input"))
	leftOut := leftBuilder.AddFileArtifact(WithArtifactDescription("left output"))

	if err := leftBuilder.AddInput(leftAct, Port("in"), leftIn); err != nil {
		t.Fatalf("AddInput left: %v", err)
	}
	if err := leftBuilder.AddOutput(leftAct, Port("out"), leftOut); err != nil {
		t.Fatalf("AddOutput left: %v", err)
	}

	// Build right graph: C -> act2 -> D
	rightAct := rightBuilder.AddAction("right action", WithActionDescription("right"))
	rightIn := rightBuilder.AddFileArtifact(WithArtifactDescription("right input"))
	rightOut := rightBuilder.AddFileArtifact(WithArtifactDescription("right output"))

	if err := rightBuilder.AddInput(rightAct, Port("in"), rightIn); err != nil {
		t.Fatalf("AddInput right: %v", err)
	}
	if err := rightBuilder.AddOutput(rightAct, Port("out"), rightOut); err != nil {
		t.Fatalf("AddOutput right: %v", err)
	}

	// Store original handle mappings before Union
	originalLeftArtifacts := make(map[ArtifactHandle]NodeId)
	originalLeftActions := make(map[ActionHandle]EdgeId)
	for k, v := range leftBuilder.ArtifactHandles {
		originalLeftArtifacts[k] = v
	}
	for k, v := range leftBuilder.ActionHandles {
		originalLeftActions[k] = v
	}

	originalRightArtifacts := make(map[ArtifactHandle]NodeId)
	originalRightActions := make(map[ActionHandle]EdgeId)
	for k, v := range rightBuilder.ArtifactHandles {
		originalRightArtifacts[k] = v
	}
	for k, v := range rightBuilder.ActionHandles {
		originalRightActions[k] = v
	}

	// Perform Union
	leftBuilder.Union(rightBuilder)

	// Verify all original left handles are still valid and unchanged
	for handle, expectedId := range originalLeftArtifacts {
		if actualId, ok := leftBuilder.ArtifactHandles[handle]; !ok {
			t.Errorf("Left artifact handle %v lost after Union", handle)
		} else if actualId != expectedId {
			t.Errorf("Left artifact handle %v mapping changed: got %v, want %v", handle, actualId, expectedId)
		}
	}

	for handle, expectedId := range originalLeftActions {
		if actualId, ok := leftBuilder.ActionHandles[handle]; !ok {
			t.Errorf("Left action handle %v lost after Union", handle)
		} else if actualId != expectedId {
			t.Errorf("Left action handle %v mapping changed: got %v, want %v", handle, actualId, expectedId)
		}
	}

	// Verify all right handles are now present in left builder
	for handle, expectedId := range originalRightArtifacts {
		if actualId, ok := leftBuilder.ArtifactHandles[handle]; !ok {
			t.Errorf("Right artifact handle %v not found in Union result", handle)
		} else if actualId != expectedId {
			t.Errorf("Right artifact handle %v mapping changed: got %v, want %v", handle, actualId, expectedId)
		}
	}

	for handle, expectedId := range originalRightActions {
		if actualId, ok := leftBuilder.ActionHandles[handle]; !ok {
			t.Errorf("Right action handle %v not found in Union result", handle)
		} else if actualId != expectedId {
			t.Errorf("Right action handle %v mapping changed: got %v, want %v", handle, actualId, expectedId)
		}
	}

	// Verify we can still build a valid workflow using the handles
	allArtifacts := []ArtifactHandle{leftOut, rightOut}
	wf, err := leftBuilder.Build(Target{Path: Path[Relative, File]{path: "test"}, Name: "union"}, allArtifacts, nil)
	if err != nil {
		t.Fatalf("Build after Union failed: %v", err)
	}
	if wf == nil {
		t.Fatal("Build returned nil workflow")
	}
}

func TestUnion_EmptyBuilder(t *testing.T) {
	// Test Union with empty builder
	builder := NewWorkflowGraphBuilder()
	emptyBuilder := NewWorkflowGraphBuilder()

	// Add some content to the first builder
	act := builder.AddAction("test action")
	artifact := builder.AddFileArtifact(WithArtifactDescription("test"))
	if err := builder.AddInput(act, Port("in"), artifact); err != nil {
		t.Fatalf("AddInput: %v", err)
	}

	originalCount := len(builder.ArtifactHandles)

	// Union with empty builder should not change anything
	builder.Union(emptyBuilder)

	if len(builder.ArtifactHandles) != originalCount {
		t.Errorf("Union with empty builder changed artifact count: got %d, want %d", len(builder.ArtifactHandles), originalCount)
	}

	// Reverse: empty + filled
	emptyBuilder2 := NewWorkflowGraphBuilder()
	filledBuilder := NewWorkflowGraphBuilder()
	filledAct := filledBuilder.AddAction("filled action")
	filledArtifact := filledBuilder.AddFileArtifact()
	if err := filledBuilder.AddInput(filledAct, Port("in"), filledArtifact); err != nil {
		t.Fatalf("AddInput filled: %v", err)
	}

	emptyBuilder2.Union(filledBuilder)

	if len(emptyBuilder2.ArtifactHandles) != len(filledBuilder.ArtifactHandles) {
		t.Errorf("Union empty + filled failed: got %d artifacts, want %d",
			len(emptyBuilder2.ArtifactHandles), len(filledBuilder.ArtifactHandles))
	}
}

func TestUnion_SelfUnion(t *testing.T) {
	// Test Union with self - should be idempotent (no changes since source==destination)
	builder := NewWorkflowGraphBuilder()

	// Add some content - avoid cycles by using separate input and output artifacts
	act := builder.AddAction("test action")
	inArtifact := builder.AddFileArtifact(WithArtifactDescription("input"))
	outArtifact := builder.AddFileArtifact(WithArtifactDescription("output"))
	if err := builder.AddInput(act, Port("in"), inArtifact); err != nil {
		t.Fatalf("AddInput: %v", err)
	}
	if err := builder.AddOutput(act, Port("out"), outArtifact); err != nil {
		t.Fatalf("AddOutput: %v", err)
	}

	originalArtifactCount := len(builder.ArtifactHandles)
	originalActionCount := len(builder.ActionHandles)
	originalNodeCount := len(builder.Cospan.Apex.Nodes)
	originalEdgeCount := len(builder.Cospan.Apex.Edges)

	// Union with self
	builder.Union(builder)

	// Self-union should be idempotent - no changes since we're copying to the same maps
	if len(builder.ArtifactHandles) != originalArtifactCount {
		t.Errorf("Self-union artifact count changed: got %d, want %d", len(builder.ArtifactHandles), originalArtifactCount)
	}
	if len(builder.ActionHandles) != originalActionCount {
		t.Errorf("Self-union action count changed: got %d, want %d", len(builder.ActionHandles), originalActionCount)
	}
	if len(builder.Cospan.Apex.Nodes) != originalNodeCount {
		t.Errorf("Self-union node count changed: got %d, want %d", len(builder.Cospan.Apex.Nodes), originalNodeCount)
	}
	if len(builder.Cospan.Apex.Edges) != originalEdgeCount {
		t.Errorf("Self-union edge count changed: got %d, want %d", len(builder.Cospan.Apex.Edges), originalEdgeCount)
	}

	// Verify the builder is still functional after self-union
	wf, err := builder.Build(Target{Path: Path[Relative, File]{path: "test"}, Name: "self-union"}, []ArtifactHandle{outArtifact}, nil)
	if err != nil {
		t.Fatalf("Build after self-union failed: %v", err)
	}
	if wf == nil {
		t.Fatal("Build returned nil workflow after self-union")
	}
}

func TestUnion_BoundaryHandlesCopied(t *testing.T) {
	// Test that boundary handles are properly copied
	leftBuilder := NewWorkflowGraphBuilder()
	rightBuilder := NewWorkflowGraphBuilder()

	// Add boundary handles to both builders
	leftArtifact := leftBuilder.AddFileArtifact(WithArtifactDescription("left boundary"))
	rightArtifact := rightBuilder.AddFileArtifact(WithArtifactDescription("right boundary"))

	leftBoundary := NewBoundaryHandle()
	rightBoundary := NewBoundaryHandle()

	if _, err := leftBuilder.ExposeLeft(leftBoundary, leftArtifact); err != nil {
		t.Fatalf("ExposeLeft: %v", err)
	}
	if _, err := rightBuilder.ExposeLeft(rightBoundary, rightArtifact); err != nil {
		t.Fatalf("ExposeLeft right: %v", err)
	}

	// Store original boundary counts
	originalLeftBoundaries := len(leftBuilder.Cospan.Left)
	originalRightBoundaries := len(rightBuilder.Cospan.Left)

	// Union
	leftBuilder.Union(rightBuilder)

	// Should have boundaries from both builders
	expectedTotal := originalLeftBoundaries + originalRightBoundaries
	if len(leftBuilder.Cospan.Left) != expectedTotal {
		t.Errorf("Union left boundaries: got %d, want %d", len(leftBuilder.Cospan.Left), expectedTotal)
	}

	// Verify specific boundary handles are present
	if _, ok := leftBuilder.Cospan.Left[leftBoundary]; !ok {
		t.Error("Original left boundary handle lost after Union")
	}
	if _, ok := leftBuilder.Cospan.Left[rightBoundary]; !ok {
		t.Error("Right boundary handle not found after Union")
	}
}

func TestUnion_GraphStructureIntegrity(t *testing.T) {
	// Test that the graph structure remains valid after Union
	leftBuilder := NewWorkflowGraphBuilder()
	rightBuilder := NewWorkflowGraphBuilder()

	// Create complex graph in left builder
	leftAct1 := leftBuilder.AddAction("left1")
	leftAct2 := leftBuilder.AddAction("left2")
	leftArt1 := leftBuilder.AddFileArtifact(WithArtifactDescription("left1"))
	leftArt2 := leftBuilder.AddFileArtifact(WithArtifactDescription("left2"))
	leftArt3 := leftBuilder.AddFileArtifact(WithArtifactDescription("left3"))

	// Chain: leftArt1 -> leftAct1 -> leftArt2 -> leftAct2 -> leftArt3
	must(t, leftBuilder.AddInput(leftAct1, Port("in"), leftArt1), nil)
	must(t, leftBuilder.AddOutput(leftAct1, Port("out"), leftArt2), nil)
	must(t, leftBuilder.AddInput(leftAct2, Port("in"), leftArt2), nil)
	must(t, leftBuilder.AddOutput(leftAct2, Port("out"), leftArt3), nil)

	// Create complex graph in right builder
	rightAct1 := rightBuilder.AddAction("right1")
	rightAct2 := rightBuilder.AddAction("right2")
	rightArt1 := rightBuilder.AddFileArtifact(WithArtifactDescription("right1"))
	rightArt2 := rightBuilder.AddFileArtifact(WithArtifactDescription("right2"))
	rightArt3 := rightBuilder.AddFileArtifact(WithArtifactDescription("right3"))

	// Chain: rightArt1 -> rightAct1 -> rightArt2 -> rightAct2 -> rightArt3
	must(t, rightBuilder.AddInput(rightAct1, Port("in"), rightArt1), nil)
	must(t, rightBuilder.AddOutput(rightAct1, Port("out"), rightArt2), nil)
	must(t, rightBuilder.AddInput(rightAct2, Port("in"), rightArt2), nil)
	must(t, rightBuilder.AddOutput(rightAct2, Port("out"), rightArt3), nil)

	// Build workflows from both builders before Union to verify they work
	leftWf, err := leftBuilder.Build(Target{Path: Path[Relative, File]{path: "left"}, Name: "test"}, []ArtifactHandle{leftArt3}, nil)
	if err != nil {
		t.Fatalf("Left builder Build before Union: %v", err)
	}
	rightWf, err := rightBuilder.Build(Target{Path: Path[Relative, File]{path: "right"}, Name: "test"}, []ArtifactHandle{rightArt3}, nil)
	if err != nil {
		t.Fatalf("Right builder Build before Union: %v", err)
	}

	// Verify both workflows have expected structure
	leftSpec := leftWf.(*WorkflowSpec)
	rightSpec := rightWf.(*WorkflowSpec)
	if len(leftSpec.producers) == 0 || len(rightSpec.producers) == 0 {
		t.Fatal("Expected non-empty producers before Union")
	}

	// Perform Union
	leftBuilder.Union(rightBuilder)

	// Verify we have all entities
	expectedArtifacts := 6 // 3 from each side
	expectedActions := 4   // 2 from each side
	if len(leftBuilder.ArtifactHandles) != expectedArtifacts {
		t.Errorf("Post-union artifact count: got %d, want %d", len(leftBuilder.ArtifactHandles), expectedArtifacts)
	}
	if len(leftBuilder.ActionHandles) != expectedActions {
		t.Errorf("Post-union action count: got %d, want %d", len(leftBuilder.ActionHandles), expectedActions)
	}

	// Verify we can build a workflow that includes both goals
	combinedGoals := []ArtifactHandle{leftArt3, rightArt3}
	combinedWf, err := leftBuilder.Build(Target{Path: Path[Relative, File]{path: "combined"}, Name: "test"}, combinedGoals, nil)
	if err != nil {
		t.Fatalf("Combined Build after Union: %v", err)
	}

	// Verify the combined workflow is valid and contains expected elements
	combinedSpec := combinedWf.(*WorkflowSpec)

	// Count actions and artifacts using iterators
	actionCount := 0
	for range combinedSpec.Actions() {
		actionCount++
	}
	if actionCount == 0 {
		t.Error("Combined workflow has no actions")
	}

	artifactCount := 0
	for range combinedSpec.Artifacts() {
		artifactCount++
	}
	if artifactCount == 0 {
		t.Error("Combined workflow has no artifacts")
	}

	// Both goal artifacts should be reachable in the combined workflow
	// We'll verify by counting goals and ensuring they match our expectations
	goalCount := 0
	for range combinedWf.Goals() {
		goalCount++
	}

	if goalCount != 2 {
		t.Errorf("Expected 2 goals in combined workflow, got %d", goalCount)
	}
}

func TestUnion_HandleUniqueness(t *testing.T) {
	// Test that handles remain unique and don't conflict
	leftBuilder := NewWorkflowGraphBuilder()
	rightBuilder := NewWorkflowGraphBuilder()

	// Generate many handles to increase chance of conflicts
	var leftArtifacts []ArtifactHandle
	var rightArtifacts []ArtifactHandle
	var leftActions []ActionHandle
	var rightActions []ActionHandle

	for i := 0; i < 10; i++ {
		leftArt := leftBuilder.AddFileArtifact(WithArtifactDescription(fmt.Sprintf("left-%d", i)))
		rightArt := rightBuilder.AddFileArtifact(WithArtifactDescription(fmt.Sprintf("right-%d", i)))
		leftArtifacts = append(leftArtifacts, leftArt)
		rightArtifacts = append(rightArtifacts, rightArt)

		leftAct := leftBuilder.AddAction(fmt.Sprintf("left-action-%d", i))
		rightAct := rightBuilder.AddAction(fmt.Sprintf("right-action-%d", i))
		leftActions = append(leftActions, leftAct)
		rightActions = append(rightActions, rightAct)
	}

	// Union
	leftBuilder.Union(rightBuilder)

	// Verify all handles are still unique and present
	allArtifacts := append(leftArtifacts, rightArtifacts...)
	allActions := append(leftActions, rightActions...)

	seenArtifacts := make(map[ArtifactHandle]bool)
	seenActions := make(map[ActionHandle]bool)

	for _, handle := range allArtifacts {
		if seenArtifacts[handle] {
			t.Errorf("Duplicate artifact handle found: %v", handle)
		}
		seenArtifacts[handle] = true

		if _, ok := leftBuilder.ArtifactHandles[handle]; !ok {
			t.Errorf("Artifact handle %v not found after Union", handle)
		}
	}

	for _, handle := range allActions {
		if seenActions[handle] {
			t.Errorf("Duplicate action handle found: %v", handle)
		}
		seenActions[handle] = true

		if _, ok := leftBuilder.ActionHandles[handle]; !ok {
			t.Errorf("Action handle %v not found after Union", handle)
		}
	}
}

func TestUnion_WithConnectAndBoundaries(t *testing.T) {
	// Test Union in combination with Connect operation and boundary handles
	leftBuilder := NewWorkflowGraphBuilder()
	middleBuilder := NewWorkflowGraphBuilder()
	rightBuilder := NewWorkflowGraphBuilder()

	// Create left pipeline: input -> leftAct -> intermediate
	leftAct := leftBuilder.AddAction("left action")
	leftInput := leftBuilder.AddFileArtifact(WithArtifactDescription("left input"))
	leftOutput := leftBuilder.AddFileArtifact(WithArtifactDescription("left output"))

	must(t, leftBuilder.AddInput(leftAct, Port("in"), leftInput), nil)
	must(t, leftBuilder.AddOutput(leftAct, Port("out"), leftOutput), nil)

	// Expose left output as right boundary
	leftBoundary, err := leftBuilder.ExposeRight(leftOutput)
	if err != nil {
		t.Fatalf("ExposeRight: %v", err)
	}

	// Create middle pipeline: intermediate -> middleAct -> result
	middleAct := middleBuilder.AddAction("middle action")
	middleInput := middleBuilder.AddFileArtifact(WithArtifactDescription("middle input"))
	middleOutput := middleBuilder.AddFileArtifact(WithArtifactDescription("middle output"))

	must(t, middleBuilder.AddInput(middleAct, Port("in"), middleInput), nil)
	must(t, middleBuilder.AddOutput(middleAct, Port("out"), middleOutput), nil)

	// Expose boundaries
	if _, err := middleBuilder.ExposeLeft(leftBoundary, middleInput); err != nil {
		t.Fatalf("ExposeLeft middle: %v", err)
	}
	middleRightBoundary, err := middleBuilder.ExposeRight(middleOutput)
	if err != nil {
		t.Fatalf("ExposeRight middle: %v", err)
	}

	// Create right pipeline: input -> rightAct -> final
	rightAct := rightBuilder.AddAction("right action")
	rightInput := rightBuilder.AddFileArtifact(WithArtifactDescription("right input"))
	rightOutput := rightBuilder.AddFileArtifact(WithArtifactDescription("right output"))

	must(t, rightBuilder.AddInput(rightAct, Port("in"), rightInput), nil)
	must(t, rightBuilder.AddOutput(rightAct, Port("out"), rightOutput), nil)

	// Expose right input as left boundary
	if _, err := rightBuilder.ExposeLeft(middleRightBoundary, rightInput); err != nil {
		t.Fatalf("ExposeLeft right: %v", err)
	}

	// Store all original handles before any operations
	allArtifacts := []ArtifactHandle{leftInput, leftOutput, middleInput, middleOutput, rightInput, rightOutput}
	allActions := []ActionHandle{leftAct, middleAct, rightAct}

	// Connect left -> middle (using same boundary handle)
	leftBuilder.Connect(middleBuilder)

	// Union the connected result with right builder
	leftBuilder.Union(rightBuilder)

	// Verify all handles are still valid and mappable
	for _, handle := range allArtifacts {
		if _, ok := leftBuilder.ArtifactHandles[handle]; !ok {
			t.Errorf("Artifact handle %v lost after Connect+Union operations", handle)
		}
	}

	for _, handle := range allActions {
		if _, ok := leftBuilder.ActionHandles[handle]; !ok {
			t.Errorf("Action handle %v lost after Connect+Union operations", handle)
		}
	}

	// Verify we can build a workflow with multiple goals
	goals := []ArtifactHandle{middleOutput, rightOutput}
	wf, err := leftBuilder.Build(Target{Path: Path[Relative, File]{path: "complex"}, Name: "test"}, goals, nil)
	if err != nil {
		t.Fatalf("Build after Connect+Union failed: %v", err)
	}

	// Count goals in the result
	goalCount := 0
	for range wf.Goals() {
		goalCount++
	}
	if goalCount != 2 {
		t.Errorf("Expected 2 goals after Connect+Union, got %d", goalCount)
	}
}

func TestUnion_HandleCollisionResistance(t *testing.T) {
	// Test that Union handles potential ID collisions gracefully
	// This is more of a stress test to verify uniqueness is maintained
	builders := make([]*WorkflowGraphBuilder, 5)
	allArtifactHandles := make([][]ArtifactHandle, 5)
	allActionHandles := make([][]ActionHandle, 5)

	// Create multiple builders with overlapping structures
	for i := range builders {
		builders[i] = NewWorkflowGraphBuilder()

		// Create a small pipeline in each
		act1 := builders[i].AddAction(fmt.Sprintf("action1-%d", i))
		act2 := builders[i].AddAction(fmt.Sprintf("action2-%d", i))

		art1 := builders[i].AddFileArtifact(WithArtifactDescription(fmt.Sprintf("art1-%d", i)))
		art2 := builders[i].AddFileArtifact(WithArtifactDescription(fmt.Sprintf("art2-%d", i)))
		art3 := builders[i].AddFileArtifact(WithArtifactDescription(fmt.Sprintf("art3-%d", i)))

		must(t, builders[i].AddInput(act1, Port("in"), art1), nil)
		must(t, builders[i].AddOutput(act1, Port("out"), art2), nil)
		must(t, builders[i].AddInput(act2, Port("in"), art2), nil)
		must(t, builders[i].AddOutput(act2, Port("out"), art3), nil)

		allArtifactHandles[i] = []ArtifactHandle{art1, art2, art3}
		allActionHandles[i] = []ActionHandle{act1, act2}
	}

	// Union all builders into the first one
	for i := 1; i < len(builders); i++ {
		builders[0].Union(builders[i])
	}

	// Verify all handles from all builders are present and unique
	seenArtifacts := make(map[ArtifactHandle]bool)
	seenActions := make(map[ActionHandle]bool)

	for i := range builders {
		for _, handle := range allArtifactHandles[i] {
			if seenArtifacts[handle] {
				t.Errorf("Duplicate artifact handle detected: %v from builder %d", handle, i)
			}
			seenArtifacts[handle] = true

			if _, ok := builders[0].ArtifactHandles[handle]; !ok {
				t.Errorf("Artifact handle %v from builder %d not found after union", handle, i)
			}
		}

		for _, handle := range allActionHandles[i] {
			if seenActions[handle] {
				t.Errorf("Duplicate action handle detected: %v from builder %d", handle, i)
			}
			seenActions[handle] = true

			if _, ok := builders[0].ActionHandles[handle]; !ok {
				t.Errorf("Action handle %v from builder %d not found after union", handle, i)
			}
		}
	}

	// Verify total counts
	expectedArtifacts := len(builders) * 3 // 3 artifacts per builder
	expectedActions := len(builders) * 2   // 2 actions per builder

	if len(builders[0].ArtifactHandles) != expectedArtifacts {
		t.Errorf("Expected %d total artifacts, got %d", expectedArtifacts, len(builders[0].ArtifactHandles))
	}
	if len(builders[0].ActionHandles) != expectedActions {
		t.Errorf("Expected %d total actions, got %d", expectedActions, len(builders[0].ActionHandles))
	}
}
