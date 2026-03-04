package skycastle

import "iter"

type Action interface {
	Workflow() Workflow
	Description() string
	Command() string
	Policy() Policy
	Input(port Port) (Artifact, bool)
	Output(port Port) (Artifact, bool)
	Inputs() iter.Seq2[Port, Artifact]
	Outputs() iter.Seq2[Port, Artifact]
	Env() iter.Seq2[string, string]
	EnvVar(name string) (string, bool)
}
