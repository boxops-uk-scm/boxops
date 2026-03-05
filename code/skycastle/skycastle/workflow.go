package skycastle

import (
	"encoding/base64"
	"io"
	"iter"
)

type Digest [32]byte

func (d Digest) String() string {
	buf := make([]byte, 32)
	copy(buf, d[:])
	return base64.URLEncoding.EncodeToString(buf)
}

type Workflow interface {
	Description() string
	Digest() Digest
	Target() Target
	Goals() iter.Seq[Artifact]
	Actions() iter.Seq[Action]
	Artifacts() iter.Seq[Artifact]
	PrettyPrint(io.Writer) error
	Input(Port) (Artifact, bool)
	Inputs() iter.Seq2[Port, Artifact]
}
