package graph

import (
	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/google/uuid"
)

type artifactConsumerKey struct {
	artifactID ArtifactID
	actionID   ActionID
}

func (ack *artifactConsumerKey) Encode() (fdb.Key, error) {
	artifactIdB, err := ack.artifactID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	actionIdB, err := ack.actionID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	return consumer.Pack(tuple.Tuple{artifactIdB, actionIdB}), nil
}

func (ack *artifactConsumerKey) Decode(key fdb.Key) error {
	t, err := consumer.Unpack(key)
	if err != nil {
		return err
	}

	if len(t) != 2 {
		return NewErrInvalidTupleLength(2, len(t))
	}

	artifactID, ok := t[0].([]byte)
	if !ok {
		return NewErrInvalidElementType("[]byte", t[0])
	}

	var uuidArtifactID uuid.UUID
	if err := uuidArtifactID.UnmarshalBinary(artifactID); err != nil {
		return err
	}

	actionID, ok := t[1].([]byte)
	if !ok {
		return NewErrInvalidElementType("uuid.UUID", t[1])
	}

	var uuidActionID uuid.UUID
	if err := uuidActionID.UnmarshalBinary(actionID); err != nil {
		return err
	}

	ack.artifactID = uuidArtifactID
	ack.actionID = uuidActionID
	return nil
}

type artifactConsumerValue struct {
}

func (acv *artifactConsumerValue) Encode() ([]byte, error) {
	return []byte{}, nil
}

func (acv *artifactConsumerValue) Decode(data []byte) error {
	return nil
}

func artifactConsumerRange(artifactID ArtifactID) (fdb.ExactRange, error) {
	artifactIdB, err := artifactID.MarshalBinary()
	if err != nil {
		return nil, err
	}

	prefixRange, err := fdb.PrefixRange(consumer.Pack(tuple.Tuple{artifactIdB}))
	if err != nil {
		return nil, err
	}

	return prefixRange, nil
}
