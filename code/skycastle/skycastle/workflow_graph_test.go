package skycastle

import (
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

	wf, err := b.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{bb})
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

	wf, err := b.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{bb})
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

		wf, err := b.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{out})
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

	res, err := b.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{out})
	wf1 := must(t, res, err)
	d1 := wf1.Digest()

	// Same structure, different command => different digest
	b2 := NewWorkflowGraphBuilder()
	act2 := b2.AddAction("echo bye")
	in2 := b2.AddFileArtifact()
	out2 := b2.AddFileArtifact()

	_ = b2.AddInput(act2, Port("in"), in2)
	_ = b2.AddOutput(act2, Port("out"), out2)

	res, err = b2.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{out2})
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

		res, err := b.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{out})
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

		res, err := b.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{out})
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

	res, err := b.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{bb})

	wf := must(t, res, err)
	d1 := wf.Digest()

	// Now remove the junk by rebuilding without it and compare digests.
	b2 := NewWorkflowGraphBuilder()
	act2 := b2.AddAction("main")
	a2 := b2.AddFileArtifact()
	b2out := b2.AddFileArtifact()
	_ = b2.AddInput(act2, Port("in"), a2)
	_ = b2.AddOutput(act2, Port("out"), b2out)

	res, err = b2.Build(Target{Path: "p", Name: "t"}, []ArtifactHandle{b2out})
	wf2 := must(t, res, err)
	d2 := wf2.Digest()

	if d1 != d2 {
		t.Fatalf("expected digest to ignore unreachable subgraph, but got %x vs %x", d1, d2)
	}
}
