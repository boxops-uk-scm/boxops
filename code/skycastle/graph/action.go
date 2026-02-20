package graph

import (
	"bytes"
	"encoding/gob"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/google/uuid"
)

type ActionID = uuid.UUID

type Action interface {
	Id() ActionID
	Label() string
	Command() string
	Inputs() (map[string]Artifact, error)
	Outputs() (map[string]Artifact, error)
	AddInput(name string, artifact Artifact) error
	AddOutput(name string, label string, kind ArtifactKind) (Artifact, error)
}

type actionKey struct {
	id ActionID
}

func (ak *actionKey) Encode() (fdb.Key, error) {
	actionIdB, err := ak.id.MarshalBinary()
	if err != nil {
		return nil, err
	}
	return action.Pack(tuple.Tuple{actionIdB}), nil
}

func (ak *actionKey) Decode(key fdb.Key) error {
	t, err := action.Unpack(key)
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

type actionValue struct {
	Label   string
	Command string
}

func (av *actionValue) Encode() ([]byte, error) {
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)

	if err := enc.Encode(av); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (av *actionValue) Decode(data []byte) error {
	buf := bytes.NewBuffer(data)
	dec := gob.NewDecoder(buf)
	if err := dec.Decode(av); err != nil {
		return err
	}
	return nil
}
