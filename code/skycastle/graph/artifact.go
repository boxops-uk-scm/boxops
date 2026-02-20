package graph

import (
	"bytes"
	"encoding/gob"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/subspace"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/google/uuid"
)

type ArtifactID = uuid.UUID

type ArtifactKind = byte

const (
	ArtifactKindFile ArtifactKind = iota
	ArtifactKindDirectory
)

var (
	action   = subspace.Sub("action")
	artifact = subspace.Sub("artifact")
	input    = subspace.Sub("input")
	output   = subspace.Sub("output")
	producer = subspace.Sub("producer")
	consumer = subspace.Sub("consumer")
)

type Artifact interface {
	Id() ArtifactID
	Label() string
	Kind() ArtifactKind
	Producer() (Action, error)
	Consumers() ([]Action, error)
}

type artifactKey struct {
	id ArtifactID
}

func (ak *artifactKey) Encode() (fdb.Key, error) {
	artifactIdB, err := ak.id.MarshalBinary()
	if err != nil {
		return nil, err
	}
	return artifact.Pack(tuple.Tuple{artifactIdB}), nil
}

func (ak *artifactKey) Decode(key fdb.Key) error {
	t, err := artifact.Unpack(key)
	if err != nil {
		return err
	}

	if len(t) != 1 {
		return NewErrInvalidTupleLength(1, len(t))
	}

	id, ok := t[0].([]byte)
	if !ok {
		return NewErrInvalidElementType("[]byte", t[0])
	}

	var uuidID uuid.UUID
	if err := uuidID.UnmarshalBinary(id); err != nil {
		return err
	}

	ak.id = uuidID
	return nil
}

type artifactValue struct {
	Label string
	Kind  ArtifactKind
}

func (av *artifactValue) Encode() ([]byte, error) {
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)

	if err := enc.Encode(av); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (av *artifactValue) Decode(data []byte) error {
	buf := bytes.NewBuffer(data)
	dec := gob.NewDecoder(buf)
	if err := dec.Decode(av); err != nil {
		return err
	}
	return nil
}
