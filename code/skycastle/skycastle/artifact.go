package skycastle

import "iter"

type ArtifactKind uint8

const (
	ArtifactKindFile ArtifactKind = iota
	ArtifactKindDirectory
)

func (k ArtifactKind) String() string {
	switch k {
	case ArtifactKindFile:
		return "file"
	case ArtifactKindDirectory:
		return "directory"
	default:
		panic("unknown ArtifactKind")
	}
}

type Artifact interface {
	Workflow() Workflow
	Description() string
	Kind() ArtifactKind
	Producer() (Port, Action)
	Consumers() iter.Seq2[Port, Action]
}
