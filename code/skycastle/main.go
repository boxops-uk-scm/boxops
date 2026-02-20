package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"skycastle/graph"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/google/uuid"
	"github.com/spf13/cobra"
	"go.starlark.net/starlark"
	"go.starlark.net/starlarkstruct"
	"go.starlark.net/syntax"

	git "github.com/go-git/go-git/v5"
)

func clearDatabase(db fdb.Database) error {
	_, err := db.Transact(func(t fdb.Transaction) (any, error) {
		r := fdb.KeyRange{
			Begin: fdb.Key([]byte{0x00}),
			End:   fdb.Key([]byte{0xFF})}

		t.ClearRange(r)

		return nil, nil
	})

	return err
}

func main() {
	rootCmd := &cobra.Command{
		Use:   "skycastle",
		Short: "Skycastle CLI",
	}

	scheduleCmd := &cobra.Command{
		Use:   "schedule <workflow-file>",
		Short: "Schedule a workflow file",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			return Schedule(args[0])
		},
	}

	rootCmd.AddCommand(scheduleCmd)

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

var ErrDirtyRepo = errors.New("repo is not clean (differs from HEAD)")

func RepoVersion(repoPath string) (string, error) {
	repo, err := git.PlainOpen(repoPath)
	if err != nil {
		return "", err
	}

	wt, err := repo.Worktree()
	if err != nil {
		return "", err
	}

	st, err := wt.Status()
	if err != nil {
		return "", err
	}

	if !st.IsClean() {
		return "", fmt.Errorf("%w:\n%s", ErrDirtyRepo, st.String())
	}

	ref, err := repo.Head()
	if err != nil {
		return "", err
	}
	return ref.Hash().String(), nil
}

func Schedule(workflowPath string) error {
	src, err := os.ReadFile(workflowPath)
	if err != nil {
		return err
	}

	repoRoot := os.Getenv("BOXOPS_REPO_ROOT")
	if repoRoot == "" {
		return fmt.Errorf("BOXOPS_REPO_ROOT environment variable is not set")
	}

	repoVersion, err := RepoVersion(repoRoot)
	if err != nil {
		return fmt.Errorf("failed to get repo version: %w", err)
	}

	absoluteWorkflowPath, err := filepath.Abs(workflowPath)
	if err != nil {
		return fmt.Errorf("failed to get absolute workflow path: %w", err)
	}

	repoRootRelativeWorkflowPath, err := filepath.Rel(repoRoot, absoluteWorkflowPath)
	if err != nil {
		return fmt.Errorf("failed to get repo-relative workflow path: %w", err)
	}

	fmt.Printf("Repo version: %s\n", repoVersion)
	fmt.Printf("Scheduling workflow: %s\n", repoRootRelativeWorkflowPath)

	thread := &starlark.Thread{
		Name:  "main",
		Print: func(_ *starlark.Thread, msg string) { fmt.Println(msg) },
	}

	fdb.MustAPIVersion(730)
	db := fdb.MustOpenDefault()
	clearDatabase(db)

	g := graph.NewGraph(db)

	predeclared := starlark.StringDict{
		"action": starlark.NewBuiltin("action", action(g)),
		"file":   starlark.NewBuiltin("file", file()),
		"dir":    starlark.NewBuiltin("dir", dir()),
	}

	_, err = starlark.ExecFileOptions(&syntax.FileOptions{}, thread, workflowPath, src, predeclared)
	if err != nil {
		return err
	}

	return nil
}

type StarlarkFunction func(thread *starlark.Thread, fn *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error)

func file() StarlarkFunction {
	return func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error) {
		if len(args) > 0 || len(kwargs) > 0 {
			return nil, fmt.Errorf("file does not accept arguments")
		}

		return starlark.MakeInt(int(graph.ArtifactKindFile)), nil
	}
}

func dir() StarlarkFunction {
	return func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error) {
		if len(args) > 0 || len(kwargs) > 0 {
			return nil, fmt.Errorf("dir does not accept arguments")
		}

		return starlark.MakeInt(int(graph.ArtifactKindDirectory)), nil
	}
}

func action(g *graph.Graph) StarlarkFunction {
	return func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error) {
		if len(args) > 0 {
			return nil, fmt.Errorf("action does not accept positional arguments")
		}

		var (
			label   string
			command string
			inputs  *starlark.Dict
			outputs *starlark.Dict
		)

		if err := starlark.UnpackArgs("action", args, kwargs,
			"name", &label,
			"cmd", &command,
			"inputs?", &inputs,
			"outputs?", &outputs,
		); err != nil {
			return nil, err
		}

		action, err := g.AddAction(label, command)
		if err != nil {
			return nil, err
		}

		if inputs != nil {
			iter := inputs.Iterate()
			defer iter.Done()

			var key starlark.Value
			for iter.Next(&key) {
				name, ok := key.(starlark.String)
				if !ok {
					return nil, fmt.Errorf("input names must be strings")
				}

				value, ok, err := inputs.Get(key)
				if err != nil {
					return nil, err
				}
				if !ok {
					return nil, fmt.Errorf("input key not found: %v", key)
				}

				artifactIdS, ok := value.(starlark.String)
				if !ok {
					return nil, fmt.Errorf("input value for key %v is not a string: %v", key, value)
				}

				artifactId, err := uuid.Parse(artifactIdS.GoString())
				if err != nil {
					return nil, fmt.Errorf("invalid UUID for key %v: %v", key, err)
				}

				artifact, err := g.GetArtifact(artifactId)
				if err != nil {
					return nil, fmt.Errorf("input artifact not found for key %v: %v", key, err)
				}

				action.AddInput(name.GoString(), artifact)
			}
		}

		var outputArtifactsDict *starlark.Dict

		if outputs != nil {
			outputArtifactsDict = starlark.NewDict(outputs.Len())
			iter := outputs.Iterate()
			defer iter.Done()

			var key starlark.Value
			for iter.Next(&key) {
				name, ok := key.(starlark.String)
				if !ok {
					return nil, fmt.Errorf("output names must be strings")
				}

				artifactTypeV, ok, err := outputs.Get(key)
				if err != nil {
					return nil, err
				}
				if !ok {
					return nil, fmt.Errorf("output key not found: %v", key)
				}

				artifactTypeInt, ok := artifactTypeV.(starlark.Int)
				if !ok {
					return nil, fmt.Errorf("output value for key %v is not an int: %v", key, artifactTypeV)
				}

				artifactTypeInt64, ok := artifactTypeInt.Int64()
				if !ok {
					return nil, fmt.Errorf("output value for key %v is too large: %v", key, artifactTypeV)
				}

				artifactKind := graph.ArtifactKind(artifactTypeInt64)
				switch artifactKind {
				case graph.ArtifactKindFile, graph.ArtifactKindDirectory:
				default:
					return nil, fmt.Errorf("invalid artifact kind for key %v: %v", key, artifactTypeV)
				}

				artifact, err := action.AddOutput(name.GoString(), label, artifactKind)
				if err != nil {
					return nil, err
				}

				outputArtifactsDict.SetKey(key, starlark.String(artifact.Id().String()))
			}
		} else {
			outputArtifactsDict = starlark.NewDict(0)
		}

		return starlarkstruct.FromStringDict(
			starlark.String("action"),
			starlark.StringDict{
				"outputs": outputArtifactsDict,
			}), nil
	}
}
