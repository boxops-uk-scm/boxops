package skycastle

import (
	"fmt"
	"io"
	"maps"

	"github.com/fatih/color"
	"github.com/xlab/treeprint"
)

type workflowStyles struct {
	Key     *color.Color
	Kind    *color.Color
	Port    *color.Color
	Command *color.Color
	Number  *color.Color
	None    *color.Color
	Digest  *color.Color
	Value   *color.Color
	EnvVar  *color.Color
}

func defaultWorkflowStyles() workflowStyles {
	return workflowStyles{
		Key:     color.New(color.FgBlue, color.Bold),
		Kind:    color.New(color.FgMagenta),
		Port:    color.New(color.FgYellow),
		Command: color.New(color.FgGreen, color.Bold),
		Number:  color.New(color.FgRed),
		None:    color.New(color.Faint),
		Digest:  color.New(),
		Value:   color.New(),
		EnvVar:  color.New(color.FgYellow),
	}
}

func (wf WorkflowSpec) PrettyPrint(w io.Writer) error {
	st := defaultWorkflowStyles()
	goals := treeprint.NewWithRoot(st.Key.Sprint("Goals:"))

	fmt.Printf("%s %s\n", st.Key.Sprint("Target:"), st.Value.Sprint(safeString(wf.Target())))
	fmt.Printf("%s %s\n", st.Key.Sprint("Digest:"), st.Digest.Sprint(safeString(wf.Digest())))
	fmt.Printf("%s %s\n", st.Key.Sprint("Description:"), st.Value.Sprint(wf.Description()))

	for goal := range wf.Goals() {
		addArtifact(goals, st, goal)
	}

	_, err := io.WriteString(w, goals.String())
	return err
}

func addArtifact(parent treeprint.Tree, st workflowStyles, a Artifact) {
	art := parent.AddBranch(st.Key.Sprint("Artifact"))
	art.AddNode(fmt.Sprintf("%s %s", st.Key.Sprint("Kind:"), st.Kind.Sprint(safeString(a.Kind()))))
	art.AddNode(fmt.Sprintf("%s %s", st.Key.Sprint("Description:"), st.Value.Sprint(a.Description())))

	port, producer := a.Producer()
	if producer == nil {
		art.AddNode(fmt.Sprintf("%s %s", st.Key.Sprint("ProducedBy:"), st.None.Sprint("<none>")))
		return
	}

	prod := art.AddBranch(fmt.Sprintf("%s %s", st.Key.Sprint("ProducedBy:"), st.Port.Sprint(safeString(port))))
	addAction(prod, st, producer)
}

func addAction(parent treeprint.Tree, st workflowStyles, act Action) {
	ac := parent.AddBranch(st.Key.Sprint("Action"))
	ac.AddNode(fmt.Sprintf("%s %s", st.Key.Sprint("Description:"), st.Value.Sprint(act.Description())))
	ac.AddNode(fmt.Sprintf("%s %s", st.Key.Sprint("Command:"), st.Command.Sprint(act.Command())))

	pol := ac.AddBranch(st.Key.Sprint("Policy:"))
	p := act.Policy()
	pol.AddNode(fmt.Sprintf("%s %s", st.Key.Sprint("MaxDurationSeconds:"), intOrNone(st, p.MaxDurationSeconds)))
	pol.AddNode(fmt.Sprintf("%s %s", st.Key.Sprint("MaxRetries:"), intOrNone(st, p.MaxRetries)))

	env := ac.AddBranch(st.Key.Sprint("Env:"))
	envMap := maps.Collect(act.Env())
	if len(envMap) == 0 {
		env.AddNode(st.None.Sprint("<none>"))
	} else {
		for k, v := range envMap {
			env.AddNode(fmt.Sprintf("%s=%s", st.EnvVar.Sprint(safeString(k)), st.Value.Sprint(safeString(v))))
		}
	}

	ins := ac.AddBranch(st.Key.Sprint("Inputs:"))
	hasAny := false
	for inPort, inArt := range act.Inputs() {
		hasAny = true
		portNode := ins.AddBranch(fmt.Sprintf("%s %s", st.Key.Sprint("Port:"), st.Port.Sprint(safeString(inPort))))
		addArtifact(portNode, st, inArt)
	}
	if !hasAny {
		ins.AddNode(st.None.Sprint("<none>"))
	}
}

func safeString(v any) string {
	if v == nil {
		return "<nil>"
	}
	if s, ok := v.(fmt.Stringer); ok {
		return s.String()
	}
	return fmt.Sprint(v)
}

func intOrNone(st workflowStyles, i int) string {
	if i == 0 {
		return st.None.Sprint("<none>")
	}
	return st.Number.Sprint(fmt.Sprint(i))
}
