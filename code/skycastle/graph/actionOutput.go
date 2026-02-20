package graph

import (
	"bytes"
	"encoding/gob"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/google/uuid"
)

type actionOutputKey struct {
	actionID   ActionID
	artifactID ArtifactID
}

func (aok *actionOutputKey) Encode() (fdb.Key, error) {
	actionIdB, err := aok.actionID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	artifactIdB, err := aok.artifactID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	return output.Pack(tuple.Tuple{actionIdB, artifactIdB}), nil
}

func (aok *actionOutputKey) Decode(key fdb.Key) error {
	t, err := output.Unpack(key)
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

	aok.actionID = uuidActionID
	aok.artifactID = uuidArtifactID
	return nil
}

type actionOutputValue struct {
	Name string
}

func (aov *actionOutputValue) Encode() ([]byte, error) {
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)

	if err := enc.Encode(aov); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (aov *actionOutputValue) Decode(data []byte) error {
	buf := bytes.NewBuffer(data)
	dec := gob.NewDecoder(buf)
	if err := dec.Decode(aov); err != nil {
		return err
	}
	return nil
}

func actionOutputRange(actionID ActionID) (fdb.ExactRange, error) {
	actionIdB, err := actionID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	prefixRange, err := fdb.PrefixRange(output.Pack(tuple.Tuple{actionIdB}))
	if err != nil {
		return nil, err
	}

	return prefixRange, nil
}
