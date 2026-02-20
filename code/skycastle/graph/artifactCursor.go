package graph

import (
	"fmt"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
)

type artifactCursor struct {
	db    fdb.Database
	key   artifactKey
	value artifactValue
}

func (a *artifactCursor) String() string {
	return fmt.Sprintf("Artifact{Id: %s, Label: %s, Kind: %d}", a.Id(), a.Label(), a.Kind())
}

func (ac *artifactCursor) Id() ArtifactID {
	return ac.key.id
}

func (ac *artifactCursor) Label() string {
	return ac.value.Label
}

func (ac *artifactCursor) Kind() ArtifactKind {
	return ac.value.Kind
}

func (ac *artifactCursor) Producer() (Action, error) {
	ret, err := ac.db.ReadTransact(func(rt fdb.ReadTransaction) (any, error) {
		return artifactProducerTransaction(ac.db, rt, ac)
	})
	if err != nil {
		return nil, err
	}
	return ret.(Action), nil
}

func (ac *artifactCursor) Consumers() ([]Action, error) {
	ret, err := ac.db.ReadTransact(func(rt fdb.ReadTransaction) (any, error) {
		return artifactConsumersTransaction(ac.db, rt, ac)
	})
	if err != nil {
		return nil, err
	}
	return ret.([]Action), nil
}
