package skycastle

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"go.starlark.net/starlark"
	"go.starlark.net/syntax"
)

type ExecConfig struct {
	RepoRootPath string
}

type ExecConfigOption func(*ExecConfig) error

func WithRepoRootPath(path string) ExecConfigOption {
	return func(c *ExecConfig) error {
		c.RepoRootPath = path
		return nil
	}
}

var ErrRepoRootEnvVarNotSet = errors.New("SKYCASTLE_REPO_ROOT environment variable not set")

func WithRepoRootPathFromEnv() ExecConfigOption {
	return func(c *ExecConfig) error {
		if repoRootPath, ok := os.LookupEnv("SKYCASTLE_REPO_ROOT"); ok {
			c.RepoRootPath = repoRootPath
			return nil
		}

		return ErrRepoRootEnvVarNotSet
	}
}

var ErrRepoRootNotDetected = errors.New("unable to detect repo root path")

func WithRepoRootPathFromFilesystem() ExecConfigOption {
	return func(c *ExecConfig) error {
		wd, err := os.Getwd()
		if err != nil {
			return err
		}

		wd, err = filepath.Abs(wd)
		if err != nil {
			return err
		}
		if resolved, err := filepath.EvalSymlinks(wd); err == nil {
			wd = resolved
		}

		dir := wd
		for {
			marker := filepath.Join(dir, ".skycastleroot")
			if info, err := os.Stat(marker); err == nil {
				if info.IsDir() {
					return errors.New(".skycastleroot exists but is a directory")
				}
				c.RepoRootPath = dir
				return nil
			} else if !os.IsNotExist(err) {
				return err
			}

			parent := filepath.Dir(dir)
			if parent == dir {
				break
			}
			dir = parent
		}

		return ErrRepoRootNotDetected
	}
}

type ExecContext struct {
	Config  ExecConfig
	Modules sync.Map
}

type Module struct {
	Path      string
	Globals   starlark.StringDict
	Workflows map[Target]Workflow
}

func NewExecContext(opts ...ExecConfigOption) (*ExecContext, error) {
	var config ExecConfig
	for _, opt := range opts {
		if err := opt(&config); err != nil {
			return nil, err
		}
	}
	return &ExecContext{
		Config: config,
	}, nil
}

func LoadModule(ctx context.Context, execCtx *ExecContext, path string) (Module, error) {
	if val, ok := execCtx.Modules.Load(path); ok {
		return val.(Module), nil
	}

	absolutePath := filepath.Join(execCtx.Config.RepoRootPath, path)
	src, err := os.ReadFile(absolutePath)
	if err != nil {
		return Module{}, err
	}

	workflows := map[Target]Workflow{}
	builder := NewWorkflowGraphBuilder()

	builtins := starlark.StringDict{
		"action": starlark.NewBuiltin("action", ActionBuiltin(builder)),
		"file":   starlark.NewBuiltin("file", FileBuiltin(builder)),
		"dir":    starlark.NewBuiltin("dir", DirBuiltin(builder)),
		"policy": starlark.NewBuiltin("policy", PolicyBuiltin(builder)),
		"workflow": starlark.NewBuiltin("workflow", WorkflowBuiltin(path, builder, func(wf Workflow) {
			workflows[wf.Target()] = wf
		})),
	}

	thread := &starlark.Thread{
		Name:  path,
		Print: func(_ *starlark.Thread, msg string) { fmt.Println(msg) },
	}

	globals, err := starlark.ExecFileOptions(&syntax.FileOptions{}, thread, path, src, builtins)
	if err != nil {
		return Module{}, err
	}

	module := Module{
		Path:      absolutePath,
		Globals:   globals,
		Workflows: workflows,
	}

	return module, nil
}
