package graph

import (
	"bytes"
	"encoding/gob"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/google/uuid"
)

type actionInputKey struct {
	actionID   ActionID
	artifactID ArtifactID
}

func (aik *actionInputKey) Encode() (fdb.Key, error) {
	actionIdB, err := aik.actionID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	artifactIdB, err := aik.artifactID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	return input.Pack(tuple.Tuple{actionIdB, artifactIdB}), nil
}

func (aik *actionInputKey) Decode(key fdb.Key) error {
	t, err := input.Unpack(key)
	if err != nil {
		return err
	}

	if len(t) != 2 {
		return NewErrInvalidTupleLength(2, len(t))
	}

	actionID, ok := t[0].([]byte)
	if !ok {
		return NewErrInvalidElementType("[]byte", t[0])
	}

	var uuidActionID uuid.UUID
	if err := uuidActionID.UnmarshalBinary(actionID); err != nil {
		return err
	}

	artifactID, ok := t[1].([]byte)
	if !ok {
		return NewErrInvalidElementType("[]byte", t[1])
	}

	var uuidArtifactID uuid.UUID
	if err := uuidArtifactID.UnmarshalBinary(artifactID); err != nil {
		return err
	}

	aik.actionID = uuidActionID
	aik.artifactID = uuidArtifactID
	return nil
}

type actionInputValue struct {
	Name string
}

func (aiv *actionInputValue) Encode() ([]byte, error) {
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)

	if err := enc.Encode(aiv); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (aiv *actionInputValue) Decode(data []byte) error {
	buf := bytes.NewBuffer(data)
	dec := gob.NewDecoder(buf)
	if err := dec.Decode(aiv); err != nil {
		return err
	}
	return nil
}

func actionInputRange(actionID ActionID) (fdb.ExactRange, error) {
	actionIdB, err := actionID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	prefixRange, err := fdb.PrefixRange(input.Pack(tuple.Tuple{actionIdB}))
	if err != nil {
		return nil, err
	}
	return prefixRange, nil
}
