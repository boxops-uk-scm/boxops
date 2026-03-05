package skycastle

import (
	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/subspace"
)

type EventLog struct {
	db        fdb.Database
	root      subspace.Subspace
	events    subspace.Subspace
	snapshots subspace.Subspace
}

func NewEventLog(db fdb.Database) *EventLog {
	root := subspace.Sub("skycastle")

	return &EventLog{
		db:        db,
		root:      root,
		events:    root.Sub("events"),
		snapshots: root.Sub("snapshots"),
	}
}
