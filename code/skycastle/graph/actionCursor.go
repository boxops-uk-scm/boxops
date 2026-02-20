package graph

import (
	"fmt"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
)

type actionCursor struct {
	db    fdb.Database
	key   actionKey
	value actionValue
}

func (a *actionCursor) String() string {
	return fmt.Sprintf("Action{Id: %s, Label: %s, Command: %s}", a.Id(), a.Label(), a.Command())
}

func (ac *actionCursor) Id() ActionID {
	return ac.key.id
}

func (ac *actionCursor) Label() string {
	return ac.value.Label
}

func (ac *actionCursor) Command() string {
	return ac.value.Command
}

func (ac *actionCursor) Inputs() (map[string]Artifact, error) {
	ret, err := ac.db.ReadTransact(func(rt fdb.ReadTransaction) (any, error) {
		return actionInputsTransaction(ac.db, rt, ac)
	})
	if err != nil {
		return nil, err
	}
	return ret.(map[string]Artifact), nil
}

func (ac *actionCursor) Outputs() (map[string]Artifact, error) {
	ret, err := ac.db.ReadTransact(func(rt fdb.ReadTransaction) (any, error) {
		return actionOutputsTransaction(ac.db, rt, ac)
	})
	if err != nil {
		return nil, err
	}
	return ret.(map[string]Artifact), nil
}

func (ac *actionCursor) AddInput(name string, artifact Artifact) error {
	_, err := ac.db.Transact(func(tr fdb.Transaction) (any, error) {
		return addActionInputTransaction(tr, ac, name, artifact)
	})
	return err
}

func (ac *actionCursor) AddOutput(name string, label string, kind ArtifactKind) (Artifact, error) {
	ret, err := ac.db.Transact(func(tr fdb.Transaction) (any, error) {
		return addActionOutputTransaction(ac.db, tr, ac, name, label, kind)
	})
	if err != nil {
		return nil, err
	}
	return ret.(Artifact), nil
}
