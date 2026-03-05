package skycastle

import (
	"time"

	"github.com/google/uuid"
	"github.com/ipfs/go-cid"
)

type StatusKind string

const (
	StatusKind_Pending    StatusKind = "PENDING"
	StatusKind_InProgress StatusKind = "IN_PROGRESS"
	StatusKind_Succeeded  StatusKind = "SUCCEEDED"
	StatusKind_Failed     StatusKind = "FAILED"
	StatusKind_Cancelled  StatusKind = "CANCELLED"
)

func (k StatusKind) IsTerminal() bool {
	switch k {
	case StatusKind_Succeeded, StatusKind_Failed, StatusKind_Cancelled:
		return true
	default:
		return false
	}
}

type Status_Pending struct {
	From time.Time
}

func (*Status_Pending) isWorkflowInstance_Status() {}
func (*Status_Pending) isActionInstance_Status()   {}

func (*Status_Pending) Kind() StatusKind { return StatusKind_Pending }

type Status_InProgress struct {
	From time.Time
}

func (*Status_InProgress) isWorkflowInstance_Status() {}
func (*Status_InProgress) isActionInstance_Status()   {}

func (*Status_InProgress) Kind() StatusKind { return StatusKind_InProgress }

type Status_Succeeded struct {
	At time.Time
}

func (*Status_Succeeded) isWorkflowInstance_Status() {}
func (*Status_Succeeded) isActionInstance_Status()   {}

func (*Status_Succeeded) Kind() StatusKind { return StatusKind_Succeeded }

type WorkflowInstanceId uuid.UUID

type WorkflowInstance struct {
	Id          WorkflowInstanceId
	Description string
	Env         map[string]string
	Inputs      map[Port]*ArtifactInstance
	Goals       []*ArtifactInstance
	Actions     map[ActionInstanceId]ActionInstance
	Artifacts   map[ArtifactInstanceId]ArtifactInstance
}

type isWorkflowInstance_Status interface {
	isWorkflowInstance_Status()
	Kind() StatusKind
}

type WorkflowInstance_Status_Failed struct {
	At                 time.Time
	UnsatisfiableGoals []*ArtifactInstance
}

func (*WorkflowInstance_Status_Failed) isWorkflowInstance_Status() {}

func (*WorkflowInstance_Status_Failed) Kind() StatusKind { return StatusKind_Failed }

type WorkflowInstance_Status_Cancelled struct {
	At time.Time
}

func (*WorkflowInstance_Status_Cancelled) isWorkflowInstance_Status() {}

func (*WorkflowInstance_Status_Cancelled) Kind() StatusKind { return StatusKind_Cancelled }

type ArtifactInstanceId uuid.UUID

type ArtifactInstance struct {
	Workflow    *WorkflowInstance
	Id          ArtifactInstanceId
	Description string
	Kind        ArtifactKind
	Status      isArtifactInstance_Status
	Producer    *ActionInstance
	consumers   []*ActionInstance
}

func (a *ArtifactInstance) IsReady() bool {
	return a.Status.IsReady()
}

type isArtifactInstance_Status interface {
	isArtifactInstance_Status()
	IsReady() bool
}

type ArtifactInstance_Status_Pending struct{}

func (*ArtifactInstance_Status_Pending) isArtifactInstance_Status() {}

func (*ArtifactInstance_Status_Pending) IsReady() bool { return false }

type ArtifactInstance_Status_Ready struct {
	Digest Digest
	Cid    cid.Cid
	Size   int64
}

func (*ArtifactInstance_Status_Ready) isArtifactInstance_Status() {}

func (*ArtifactInstance_Status_Ready) IsReady() bool { return true }

type ActionInstanceId uuid.UUID

type ActionInstance struct {
	Workflow    *WorkflowInstance
	Id          ActionInstanceId
	Status      isActionInstance_Status
	Description string
	Command     string
	Policy      Policy
	Inputs      map[Port]*ArtifactInstance
	Outputs     map[Port]*ArtifactInstance
	RetryOf     *ActionInstance
	Retries     []*ActionInstance
}

func (a *ActionInstance) IsReady() bool {
	for _, input := range a.Inputs {
		if !input.IsReady() {
			return false
		}
	}
	return true
}

type isActionInstance_Status interface {
	isActionInstance_Status()
	Kind() StatusKind
}

type ActionInstance_Status_Pending struct {
	From time.Time
}

type ActionInstance_Status_Failed struct {
	At       time.Time
	ExitCode int
}

func (*ActionInstance_Status_Failed) isActionInstance_Status() {}

func (*ActionInstance_Status_Failed) Kind() StatusKind { return StatusKind_Failed }

type ActionInstance_Status_Cancelled struct {
	At     time.Time
	Reason ActionInstance_Status_Cancelled_Reason
}

func (*ActionInstance_Status_Cancelled) isActionInstance_Status() {}

func (*ActionInstance_Status_Cancelled) Kind() StatusKind { return StatusKind_Cancelled }

type ActionInstance_Status_Cancelled_Reason interface {
	isActionInstance_Status_Cancelled_Reason()
}

type ActionInstance_Status_Cancelled_Reason_UserRequested struct{}

func (*ActionInstance_Status_Cancelled_Reason_UserRequested) isActionInstance_Status_Cancelled_Reason() {
}

type ActionInstance_Status_Cancelled_Reason_UnsatisfiableInputs struct {
	UnsatisfiableInputs map[Port]*ArtifactInstance
}

func (*ActionInstance_Status_Cancelled_Reason_UnsatisfiableInputs) isActionInstance_Status_Cancelled_Reason() {
}
