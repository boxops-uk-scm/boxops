package graph

import (
	"fmt"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/google/uuid"
)

func actionsTransaction(db fdb.Database, t fdb.ReadTransactor) (any, error) {
	return t.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		prefix, err := fdb.PrefixRange(action.Pack(tuple.Tuple{}))
		if err != nil {
			return nil, err
		}

		it := tr.GetRange(prefix, fdb.RangeOptions{}).Iterator()

		var actions []Action
		for it.Advance() {
			kv, err := it.Get()
			if err != nil {
				return nil, err
			}

			var ak actionKey
			if err := ak.Decode(kv.Key); err != nil {
				return nil, err
			}

			var av actionValue
			if err := av.Decode(kv.Value); err != nil {
				return nil, err
			}

			actions = append(actions, &actionCursor{
				db:    db,
				key:   ak,
				value: av,
			})
		}

		return actions, nil
	})
}

func actionInputsTransaction(db fdb.Database, t fdb.ReadTransactor, action Action) (any, error) {
	return t.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		prefixRange, err := actionInputRange(action.Id())
		if err != nil {
			return nil, err
		}

		it := tr.GetRange(prefixRange, fdb.RangeOptions{}).Iterator()

		inputs := make(map[string]Artifact)
		for it.Advance() {
			kv, err := it.Get()
			if err != nil {
				return nil, err
			}

			var aik actionInputKey
			if err := aik.Decode(kv.Key); err != nil {
				return nil, err
			}

			var aiv actionInputValue
			if err := aiv.Decode(kv.Value); err != nil {
				return nil, err
			}

			artifactCursor, err := artifactTransaction(db, t, aik.artifactID)
			if err != nil {
				return nil, err
			}

			inputs[aiv.Name] = artifactCursor.(Artifact)
		}

		return inputs, nil
	})
}

func actionOutputsTransaction(db fdb.Database, t fdb.ReadTransactor, action Action) (any, error) {
	return t.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		prefixRange, err := actionOutputRange(action.Id())
		if err != nil {
			return nil, err
		}

		it := tr.GetRange(prefixRange, fdb.RangeOptions{}).Iterator()

		outputs := make(map[string]Artifact)
		for it.Advance() {
			kv, err := it.Get()
			if err != nil {
				return nil, err
			}

			var aok actionOutputKey
			if err := aok.Decode(kv.Key); err != nil {
				return nil, err
			}

			var aov actionOutputValue
			if err := aov.Decode(kv.Value); err != nil {
				return nil, err
			}

			artifactCursor, err := artifactTransaction(db, t, aok.artifactID)
			if err != nil {
				return nil, err
			}

			outputs[aov.Name] = artifactCursor.(Artifact)
		}

		return outputs, nil
	})
}

func addActionInputTransaction(t fdb.Transactor, action Action, name string, artifact Artifact) (any, error) {
	return t.Transact(func(tr fdb.Transaction) (any, error) {
		aik := &actionInputKey{actionID: action.Id(), artifactID: artifact.(*artifactCursor).key.id}
		aiv := &actionInputValue{Name: name}

		key, err := aik.Encode()
		if err != nil {
			return nil, err
		}

		value, err := aiv.Encode()
		if err != nil {
			return nil, err
		}
		tr.Set(key, value)

		ack := &artifactConsumerKey{artifactID: artifact.(*artifactCursor).key.id, actionID: action.Id()}
		acv := &artifactConsumerValue{}

		key, err = ack.Encode()
		if err != nil {
			return nil, err
		}

		value, err = acv.Encode()
		if err != nil {
			return nil, err
		}

		tr.Set(key, value)

		return nil, nil
	})
}

func addActionOutputTransaction(db fdb.Database, t fdb.Transactor, action Action, name string, label string, kind ArtifactKind) (any, error) {
	artifact, err := addArtifactTransaction(db, t, label, kind)
	if err != nil {
		return nil, err
	}

	return t.Transact(func(tr fdb.Transaction) (any, error) {
		aok := &actionOutputKey{actionID: action.Id(), artifactID: artifact.(*artifactCursor).key.id}
		aov := &actionOutputValue{Name: name}

		key, err := aok.Encode()
		if err != nil {
			return nil, err
		}
		value, err := aov.Encode()
		if err != nil {
			return nil, err
		}
		tr.Set(key, value)

		apk := &artifactProducerKey{artifactID: artifact.(*artifactCursor).key.id}
		apv := &artifactProducerValue{ActionID: action.Id()}

		key, err = apk.Encode()
		if err != nil {
			return nil, err
		}
		value, err = apv.Encode()
		if err != nil {
			return nil, err
		}
		tr.Set(key, value)
		return artifact, nil
	})
}

func artifactProducerTransaction(db fdb.Database, t fdb.ReadTransactor, artifact Artifact) (any, error) {
	ret, err := t.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {

		apk := &artifactProducerKey{artifactID: artifact.Id()}
		key, err := apk.Encode()
		if err != nil {
			return nil, err
		}

		data, err := tr.Get(key).Get()
		if err != nil {
			return nil, err
		}

		if data == nil {
			return nil, fmt.Errorf("no producer found for artifact with ID %s", artifact.Id())
		}

		var apv artifactProducerValue
		if err := apv.Decode(data); err != nil {
			return nil, err
		}

		return apv.ActionID, nil
	})

	if err != nil {
		return nil, err
	}

	actionID := ret.(ActionID)
	return actionTransaction(db, t, actionID)
}

func artifactConsumersTransaction(db fdb.Database, t fdb.ReadTransactor, artifact Artifact) (any, error) {
	return t.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		prefix, err := artifactConsumerRange(artifact.Id())
		if err != nil {
			return nil, err
		}

		it := tr.GetRange(prefix, fdb.RangeOptions{}).Iterator()

		var actions []Action
		for it.Advance() {
			kv, err := it.Get()
			if err != nil {
				return nil, err
			}

			var ack artifactConsumerKey
			if err := ack.Decode(kv.Key); err != nil {
				return nil, err
			}

			actionCursor, err := actionTransaction(db, t, ack.actionID)
			if err != nil {
				return nil, err
			}

			actions = append(actions, actionCursor.(Action))
		}

		return actions, nil
	})
}

func addActionTransaction(db fdb.Database, t fdb.Transactor, label string, command string) (any, error) {
	return t.Transact(func(tr fdb.Transaction) (any, error) {
		id, err := uuid.NewV7()
		if err != nil {
			return nil, err
		}

		ak := &actionKey{id: id}
		av := &actionValue{Label: label, Command: command}

		key, err := ak.Encode()
		if err != nil {
			return nil, err
		}
		value, err := av.Encode()
		if err != nil {
			return nil, err
		}
		tr.Set(key, value)

		return &actionCursor{
			db:    db,
			key:   *ak,
			value: *av,
		}, nil
	})
}

func actionTransaction(db fdb.Database, t fdb.ReadTransactor, id ActionID) (any, error) {
	return t.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		ak := &actionKey{id: id}
		av := &actionValue{}

		key, err := ak.Encode()
		if err != nil {
			return nil, err
		}

		data, err := tr.Get(key).Get()
		if err != nil {
			return nil, err
		}

		if data == nil {
			return nil, fmt.Errorf("action with ID %s not found", id)
		}

		if err := av.Decode(data); err != nil {
			return nil, err
		}

		return &actionCursor{
			db:    db,
			key:   *ak,
			value: *av,
		}, nil
	})
}

func addArtifactTransaction(db fdb.Database, t fdb.Transactor, label string, kind ArtifactKind) (any, error) {
	return t.Transact(func(tr fdb.Transaction) (any, error) {
		id, err := uuid.NewV7()
		if err != nil {
			return nil, err
		}

		ak := &artifactKey{id: id}
		av := &artifactValue{Label: label, Kind: kind}

		key, err := ak.Encode()

		if err != nil {
			return nil, err
		}

		value, err := av.Encode()
		if err != nil {
			return nil, err
		}
		tr.Set(key, value)

		return &artifactCursor{
			db:    db,
			key:   *ak,
			value: *av,
		}, nil
	})
}

func artifactTransaction(db fdb.Database, t fdb.ReadTransactor, id ArtifactID) (any, error) {
	return t.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		ak := &artifactKey{id: id}
		av := &artifactValue{}

		key, err := ak.Encode()
		if err != nil {
			return nil, err
		}

		data, err := tr.Get(key).Get()
		if err != nil {
			return nil, err
		}

		if data == nil {
			return nil, fmt.Errorf("artifact with ID %s not found", id)
		}

		if err := av.Decode(data); err != nil {
			return nil, err
		}

		return &artifactCursor{
			db:    db,
			key:   *ak,
			value: *av,
		}, nil
	})
}
