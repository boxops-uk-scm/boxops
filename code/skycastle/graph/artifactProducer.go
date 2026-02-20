package graph

import (
	"bytes"
	"encoding/gob"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/google/uuid"
)

type artifactProducerKey struct {
	artifactID ArtifactID
}

func (apk *artifactProducerKey) Encode() (fdb.Key, error) {
	artifactIdB, err := apk.artifactID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	return producer.Pack(tuple.Tuple{artifactIdB}), nil
}

func (apk *artifactProducerKey) Decode(key fdb.Key) error {
	t, err := producer.Unpack(key)
	if err != nil {
		return err
	}

	if len(t) != 1 {
		return NewErrInvalidTupleLength(1, len(t))
	}

	artifactID, ok := t[0].([]byte)
	if !ok {
		return NewErrInvalidElementType("[]byte", t[0])
	}

	var uuidArtifactID uuid.UUID
	if err := uuidArtifactID.UnmarshalBinary(artifactID); err != nil {
		return err
	}

	apk.artifactID = uuidArtifactID
	return nil
}

type artifactProducerValue struct {
	ActionID ActionID
}

func (apv *artifactProducerValue) Encode() ([]byte, error) {
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)

	if err := enc.Encode(apv); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (apv *artifactProducerValue) Decode(data []byte) error {
	buf := bytes.NewBuffer(data)
	dec := gob.NewDecoder(buf)
	if err := dec.Decode(apv); err != nil {
		return err
	}
	return nil
}
