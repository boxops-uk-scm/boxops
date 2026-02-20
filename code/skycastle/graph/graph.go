package graph

import (
	"github.com/apple/foundationdb/bindings/go/src/fdb"
)

type Graph struct {
	db fdb.Database
}

func NewGraph(db fdb.Database) *Graph {
	return &Graph{db: db}
}

func (g *Graph) AddAction(label string, command string) (Action, error) {
	ret, err := g.db.Transact(func(tr fdb.Transaction) (any, error) {
		return addActionTransaction(g.db, tr, label, command)
	})
	if err != nil {
		return nil, err
	}
	return ret.(Action), nil
}

func (g *Graph) Action(id ActionID) (Action, error) {
	ret, err := g.db.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		return actionTransaction(g.db, tr, id)
	})
	if err != nil {
		return nil, err
	}
	return ret.(Action), nil
}

func (g *Graph) Actions() ([]Action, error) {
	ret, err := g.db.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		return actionsTransaction(g.db, tr)
	})
	if err != nil {
		return nil, err
	}
	return ret.([]Action), nil
}

func (g *Graph) AddArtifact(label string, kind ArtifactKind) (Artifact, error) {
	ret, err := g.db.Transact(func(tr fdb.Transaction) (any, error) {
		return addArtifactTransaction(g.db, tr, label, kind)
	})
	if err != nil {
		return nil, err
	}
	return ret.(Artifact), nil
}

func (g *Graph) GetArtifact(id ArtifactID) (Artifact, error) {
	ret, err := g.db.ReadTransact(func(tr fdb.ReadTransaction) (any, error) {
		return artifactTransaction(g.db, tr, id)
	})
	if err != nil {
		return nil, err
	}
	return ret.(Artifact), nil
}
