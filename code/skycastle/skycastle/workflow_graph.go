package skycastle

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"hash"
	"iter"
	"maps"
	"skycastle/skycastle/slice_extensions"
	"slices"

	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
)

type NodeId Unique

func NewNodeId() NodeId {
	return NodeId(NewUnique())
}

type EdgeId Unique

func NewEdgeId() EdgeId {
	return EdgeId(NewUnique())
}

type Edge struct {
	Id          EdgeId
	Description string
	Command     string
	Policy      Policy
	Inputs      map[Port]NodeId
	Outputs     map[Port]NodeId
}

type ActionOption func(*Edge)

func WithActionDescription(description string) ActionOption {
	return func(n *Edge) {
		n.Description = description
	}
}

type PolicyOption func(*Policy)

func WithMaxRetries(maximumRetries int) PolicyOption {
	return func(p *Policy) {
		p.MaxRetries = maximumRetries
	}
}

func WithMaxDuration(maxDurationSeconds int) PolicyOption {
	return func(p *Policy) {
		p.MaxDurationSeconds = maxDurationSeconds
	}
}

func WithPolicy(policy Policy) ActionOption {
	return func(n *Edge) {
		n.Policy = policy
	}
}

func WithPolicyOptions(opts ...PolicyOption) ActionOption {
	policy := DefaultPolicy()
	for _, opt := range opts {
		opt(&policy)
	}
	return WithPolicy(policy)
}

type Node struct {
	Id          NodeId
	Description string
	Kind        ArtifactKind
}

type ArtifactOption func(*Node)

func WithArtifactDescription(description string) ArtifactOption {
	return func(n *Node) {
		n.Description = description
	}
}

type WorkflowGraph struct {
	Nodes map[NodeId]Node
	Edges map[EdgeId]Edge
}

func NewWorkflowGraph() *WorkflowGraph {
	return &WorkflowGraph{
		Nodes: make(map[NodeId]Node),
		Edges: make(map[EdgeId]Edge),
	}
}

type Foot map[BoundaryHandle]NodeId

type WorkflowGraphCospan struct {
	Apex  *WorkflowGraph
	Left  Foot
	Right Foot
}

type ArtifactHandle Unique

func NewArtifactHandle() ArtifactHandle {
	return ArtifactHandle(NewUnique())
}

type ActionHandle Unique

func NewActionHandle() ActionHandle {
	return ActionHandle(NewUnique())
}

type BoundaryHandle Unique

func NewBoundaryHandle() BoundaryHandle {
	return BoundaryHandle(NewUnique())
}

type WorkflowGraphBuilder struct {
	Cospan          *WorkflowGraphCospan
	ArtifactHandles map[ArtifactHandle]NodeId
	ActionHandles   map[ActionHandle]EdgeId
}

func NewWorkflowGraphBuilder() *WorkflowGraphBuilder {
	return &WorkflowGraphBuilder{
		Cospan: &WorkflowGraphCospan{
			Apex:  NewWorkflowGraph(),
			Left:  make(Foot),
			Right: make(Foot),
		},
		ArtifactHandles: make(map[ArtifactHandle]NodeId),
		ActionHandles:   make(map[ActionHandle]EdgeId),
	}
}

func (b *WorkflowGraphBuilder) AddAction(command string, opts ...ActionOption) ActionHandle {
	id := NewEdgeId()
	handle := NewActionHandle()

	edge := Edge{
		Id:      id,
		Command: command,
		Policy:  DefaultPolicy(),
		Inputs:  make(map[Port]NodeId),
		Outputs: make(map[Port]NodeId),
	}

	for _, opt := range opts {
		opt(&edge)
	}

	b.Cospan.Apex.Edges[id] = edge
	b.ActionHandles[handle] = id

	return handle
}

func (b *WorkflowGraphBuilder) AddArtifact(kind ArtifactKind, opts ...ArtifactOption) ArtifactHandle {
	id := NewNodeId()
	handle := NewArtifactHandle()

	node := Node{
		Id:   id,
		Kind: kind,
	}

	for _, opt := range opts {
		opt(&node)
	}

	b.Cospan.Apex.Nodes[id] = node
	b.ArtifactHandles[ArtifactHandle(handle)] = id

	return ArtifactHandle(handle)
}

func (b *WorkflowGraphBuilder) AddFileArtifact(opts ...ArtifactOption) ArtifactHandle {
	return b.AddArtifact(ArtifactKindFile, opts...)
}

func (b *WorkflowGraphBuilder) AddDirectoryArtifact(opts ...ArtifactOption) ArtifactHandle {
	return b.AddArtifact(ArtifactKindDirectory, opts...)
}

var (
	ErrInvalidActionHandle   = errors.New("invalid action handle")
	ErrInvalidArtifactHandle = errors.New("invalid artifact handle")
)

func (b *WorkflowGraphBuilder) WireOutput(action ActionHandle, port Port, artifact ArtifactHandle) error {
	actionId, ok := b.ActionHandles[action]
	if !ok {
		return ErrInvalidActionHandle
	}

	artifactId, ok := b.ArtifactHandles[artifact]
	if !ok {
		return ErrInvalidArtifactHandle
	}

	edge := b.Cospan.Apex.Edges[actionId]
	edge.Outputs[port] = artifactId
	b.Cospan.Apex.Edges[actionId] = edge
	return nil
}

func (b *WorkflowGraphBuilder) AddInput(action ActionHandle, port Port, artifact ArtifactHandle) error {
	actionId, ok := b.ActionHandles[action]
	if !ok {
		return ErrInvalidActionHandle
	}

	artifactId, ok := b.ArtifactHandles[artifact]
	if !ok {
		return ErrInvalidArtifactHandle
	}

	edge := b.Cospan.Apex.Edges[actionId]
	edge.Inputs[port] = artifactId
	b.Cospan.Apex.Edges[actionId] = edge
	return nil
}

func (b *WorkflowGraphBuilder) AddOutput(action ActionHandle, port Port, artifact ArtifactHandle) error {
	return b.WireOutput(action, port, artifact)
}

func (b *WorkflowGraphBuilder) AddOutputFile(action ActionHandle, port Port, opts ...ArtifactOption) (ArtifactHandle, error) {
	artifact := b.AddFileArtifact(opts...)
	if err := b.WireOutput(action, port, artifact); err != nil {
		return ArtifactHandle{}, err
	}
	return artifact, nil
}

func (b *WorkflowGraphBuilder) AddOutputDirectory(action ActionHandle, port Port, opts ...ArtifactOption) (ArtifactHandle, error) {
	artifact := b.AddDirectoryArtifact(opts...)
	if err := b.WireOutput(action, port, artifact); err != nil {
		return ArtifactHandle{}, err
	}
	return artifact, nil
}

func (b *WorkflowGraphBuilder) ExposeRight(artifact ArtifactHandle) (BoundaryHandle, error) {
	artifactId, ok := b.ArtifactHandles[artifact]
	if !ok {
		return BoundaryHandle{}, ErrInvalidArtifactHandle
	}

	handle := NewBoundaryHandle()
	b.Cospan.Right[BoundaryHandle(handle)] = artifactId
	return BoundaryHandle(handle), nil
}

func (b *WorkflowGraphBuilder) ExposeLeft(handle BoundaryHandle, artifact ArtifactHandle) (BoundaryHandle, error) {
	artifactId, ok := b.ArtifactHandles[artifact]
	if !ok {
		return BoundaryHandle{}, ErrInvalidArtifactHandle
	}
	b.Cospan.Left[handle] = artifactId
	return handle, nil
}

func (left *WorkflowGraphBuilder) Union(right *WorkflowGraphBuilder) {
	maps.Copy(left.Cospan.Apex.Nodes, right.Cospan.Apex.Nodes)
	maps.Copy(left.Cospan.Apex.Edges, right.Cospan.Apex.Edges)
	maps.Copy(left.ArtifactHandles, right.ArtifactHandles)
	maps.Copy(left.ActionHandles, right.ActionHandles)
	maps.Copy(left.Cospan.Left, right.Cospan.Left)
	maps.Copy(left.Cospan.Right, right.Cospan.Right)
}

func (left *WorkflowGraphBuilder) Connect(right *WorkflowGraphBuilder) {
	maps.Copy(left.Cospan.Apex.Nodes, right.Cospan.Apex.Nodes)
	maps.Copy(left.Cospan.Apex.Edges, right.Cospan.Apex.Edges)
	maps.Copy(left.ArtifactHandles, right.ArtifactHandles)
	maps.Copy(left.ActionHandles, right.ActionHandles)

	uf := NewUnionFind()
	for handle, leftId := range left.Cospan.Right {
		rightId, ok := right.Cospan.Left[handle]
		if !ok {
			continue
		}
		uf.Union(leftId, rightId)
	}

	for actionId, edge := range left.Cospan.Apex.Edges {
		for port, artifactId := range edge.Inputs {
			edge.Inputs[port] = uf.Find(artifactId)
		}
		for port, artifactId := range edge.Outputs {
			edge.Outputs[port] = uf.Find(artifactId)
		}
		left.Cospan.Apex.Edges[actionId] = edge
	}

	newLeftFoot := make(map[BoundaryHandle]NodeId, len(left.Cospan.Left))
	newRightFoot := make(map[BoundaryHandle]NodeId, len(right.Cospan.Right))

	for handle, id := range left.Cospan.Left {
		newLeftFoot[handle] = uf.Find(id)
	}

	for handle, id := range right.Cospan.Right {
		newRightFoot[handle] = uf.Find(id)
	}

	left.Cospan.Left = newLeftFoot
	left.Cospan.Right = newRightFoot
}

type WorkflowSpec struct {
	graph       *WorkflowGraph
	producers   map[NodeId]Producer
	consumers   map[NodeId][]Consumer
	description string
	target      Target
	digest      Digest
	goals       []NodeId
}

type WorkflowSpecOption func(*WorkflowSpec)

func WithWorkflowDescription(description string) WorkflowSpecOption {
	return func(ws *WorkflowSpec) {
		ws.description = description
	}
}

type Producer struct {
	ActionId EdgeId
	Port     Port
}

type Consumer struct {
	ActionId EdgeId
	Port     Port
}

type ActionCursor struct {
	ws *WorkflowSpec
	id EdgeId
}

type ArtifactCursor struct {
	ws *WorkflowSpec
	id NodeId
}

func workflowDigest(ws *WorkflowSpec, cache map[NodeId]Digest) Digest {
	goalDigests := slice_extensions.Map(ws.goals, func(id NodeId) Digest {
		return nodeDigest(id, ws, cache)
	})
	slices.SortFunc(goalDigests, func(a, b Digest) int {
		return slices.Compare(a[:], b[:])
	})

	t := tuple.Tuple{fmt.Sprintf("%v", ws.target)}
	for _, d := range goalDigests {
		t = append(t, d[:])
	}

	h := sha256.New()
	h.Write(t.Pack())
	return digestSum(h)
}

func nodeDigest(id NodeId, ws *WorkflowSpec, cache map[NodeId]Digest) Digest {
	if d, ok := cache[id]; ok {
		return d
	}
	n := ws.graph.Nodes[id]

	t := tuple.Tuple{int(n.Kind)}
	if p, ok := ws.producers[id]; ok {
		d := edgeDigest(p.ActionId, p.Port, ws, cache)
		t = append(t, d[:])
	}

	h := sha256.New()
	h.Write(t.Pack())
	d := digestSum(h)
	cache[id] = d
	return d
}

func edgeDigest(id EdgeId, outPort Port, ws *WorkflowSpec, cache map[NodeId]Digest) Digest {
	e := ws.graph.Edges[id]
	t := tuple.Tuple{e.Command, fmt.Sprintf("%v", e.Policy), fmt.Sprintf("%v", outPort)}

	inPorts := slices.Sorted(maps.Keys(e.Inputs))
	for _, port := range inPorts {
		t = append(t, fmt.Sprintf("%v", port))
		d := nodeDigest(e.Inputs[port], ws, cache)
		t = append(t, d[:])
	}

	h := sha256.New()
	h.Write(t.Pack())
	return digestSum(h)
}

func digestSum(h hash.Hash) Digest {
	var d Digest
	h.Sum(d[:0])
	return d
}

func (b *WorkflowGraphBuilder) Build(target Target, goals []ArtifactHandle, opts ...WorkflowSpecOption) (Workflow, error) {
	spec := &WorkflowSpec{
		graph:     b.Cospan.Apex,
		target:    target,
		goals:     make([]NodeId, len(goals)),
		producers: make(map[NodeId]Producer),
		consumers: make(map[NodeId][]Consumer),
	}

	for _, opt := range opts {
		opt(spec)
	}

	for i, goal := range goals {
		artifactId, ok := b.ArtifactHandles[goal]
		if !ok {
			return nil, ErrInvalidArtifactHandle
		}
		spec.goals[i] = artifactId
	}

	for _, edge := range spec.graph.Edges {
		for port, artifactId := range edge.Inputs {
			spec.consumers[artifactId] = append(spec.consumers[artifactId], Consumer{
				ActionId: edge.Id,
				Port:     port,
			})
		}
		for port, artifactId := range edge.Outputs {
			spec.producers[artifactId] = Producer{
				ActionId: edge.Id,
				Port:     port,
			}
		}
	}

	cache := make(map[NodeId]Digest)
	spec.digest = workflowDigest(spec, cache)

	return spec, nil
}

func (wr *WorkflowSpec) Description() string {
	return wr.description
}

func (wr *WorkflowSpec) Digest() Digest {
	return wr.digest
}

func (wr *WorkflowSpec) Target() Target {
	return wr.target
}

func (wr *WorkflowSpec) Goals() iter.Seq[Artifact] {
	return func(yield func(Artifact) bool) {
		for _, goalId := range wr.goals {
			if !yield(ArtifactCursor{ws: wr, id: goalId}) {
				return
			}
		}
	}
}

func (wr *WorkflowSpec) Actions() iter.Seq[Action] {
	return func(yield func(Action) bool) {
		for _, edge := range wr.graph.Edges {
			if !yield(ActionCursor{ws: wr, id: edge.Id}) {
				return
			}
		}
	}
}

func (wr *WorkflowSpec) Artifacts() iter.Seq[Artifact] {
	return func(yield func(Artifact) bool) {
		for _, node := range wr.graph.Nodes {
			if !yield(ArtifactCursor{ws: wr, id: node.Id}) {
				return
			}
		}
	}
}

func (ar ArtifactCursor) Description() string {
	node := ar.ws.graph.Nodes[ar.id]
	return node.Description
}

func (ar ArtifactCursor) Workflow() Workflow {
	return ar.ws
}

func (ar ArtifactCursor) Kind() ArtifactKind {
	node := ar.ws.graph.Nodes[ar.id]
	return node.Kind
}

func (ar ArtifactCursor) Producer() (Port, Action) {
	producer := ar.ws.producers[ar.id]
	return producer.Port, ActionCursor{ws: ar.ws, id: producer.ActionId}
}

func (ar ArtifactCursor) Consumers() iter.Seq2[Port, Action] {
	return func(yield func(Port, Action) bool) {
		for _, consumer := range ar.ws.consumers[ar.id] {
			if !yield(consumer.Port, ActionCursor{ws: ar.ws, id: consumer.ActionId}) {
				return
			}
		}
	}
}

func (ar ActionCursor) Description() string {
	edge := ar.ws.graph.Edges[ar.id]
	return edge.Description
}

func (ar ActionCursor) Workflow() Workflow {
	return ar.ws
}

func (ar ActionCursor) Command() string {
	edge := ar.ws.graph.Edges[ar.id]
	return edge.Command
}

func (ar ActionCursor) Policy() Policy {
	edge := ar.ws.graph.Edges[ar.id]
	return edge.Policy
}

func (ar ActionCursor) Input(port Port) (Artifact, bool) {
	edge := ar.ws.graph.Edges[ar.id]
	artifactId, ok := edge.Inputs[port]
	if !ok {
		return nil, false
	}
	return ArtifactCursor{ws: ar.ws, id: artifactId}, true
}

func (ar ActionCursor) Output(port Port) (Artifact, bool) {
	edge := ar.ws.graph.Edges[ar.id]
	artifactId, ok := edge.Outputs[port]
	if !ok {
		return nil, false
	}
	return ArtifactCursor{ws: ar.ws, id: artifactId}, true
}

func (ar ActionCursor) Inputs() iter.Seq2[Port, Artifact] {
	return func(yield func(Port, Artifact) bool) {
		edge := ar.ws.graph.Edges[ar.id]
		for port, artifactId := range edge.Inputs {
			if !yield(port, ArtifactCursor{ws: ar.ws, id: artifactId}) {
				return
			}
		}
	}
}

func (ar ActionCursor) Outputs() iter.Seq2[Port, Artifact] {
	return func(yield func(Port, Artifact) bool) {
		edge := ar.ws.graph.Edges[ar.id]
		for port, artifactId := range edge.Outputs {
			if !yield(port, ArtifactCursor{ws: ar.ws, id: artifactId}) {
				return
			}
		}
	}
}
