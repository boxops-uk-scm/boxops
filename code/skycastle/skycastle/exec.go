package skycastle

import (
	"context"
	"errors"
	"fmt"
	"iter"
	"log/slog"
	"os"
	"path/filepath"
	"skycastle/skycastle/parser"
	"slices"
	"sync"
	"time"

	"github.com/hmdsefi/gograph"
	"go.starlark.net/starlark"
	"go.starlark.net/syntax"
)

var (
	ErrRepoRootEnvVarNotSet         = errors.New("SKYCASTLE_REPO_ROOT environment variable not set")
	ErrRepoRootNotFoundInFilesystem = errors.New("could not find .skycastleroot file in the current directory or any parent directory")
	ErrRepoRootNotFound             = errors.New("failed to determine repository root from environment variable or filesystem")
)

func RepoRootFromEnv() (Path[Absolute, Directory], error) {
	if val, ok := os.LookupEnv("SKYCASTLE_REPO_ROOT"); ok {
		repoRootPath, err := ParseAbsoluteDirectory(val)
		if err != nil {
			return Path[Absolute, Directory]{}, err
		}

		slog.Info("Using repository root from environment variable", "path", repoRootPath.String())
		return repoRootPath, nil
	}

	return Path[Absolute, Directory]{}, ErrRepoRootEnvVarNotSet
}

func RepoRootFromFilesystem() (Path[Absolute, Directory], error) {
	wd, err := os.Getwd()
	if err != nil {
		return Path[Absolute, Directory]{}, err
	}

	wd, err = filepath.Abs(wd)
	if err != nil {
		return Path[Absolute, Directory]{}, err
	}
	if resolved, err := filepath.EvalSymlinks(wd); err == nil {
		wd = resolved
	}

	dir := wd
	for {
		marker := filepath.Join(dir, ".skycastleroot")
		if info, err := os.Stat(marker); err == nil {
			if !info.IsDir() {
				p, err := ParseAbsoluteDirectory(dir)
				if err != nil {
					return Path[Absolute, Directory]{}, err
				}
				slog.Debug("Using repository root from filesystem", "path", p.String())
				return p, nil
			}
		}

		slog.Debug("Repository root marker not found in current directory, checking parent", "directory", dir)

		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	return Path[Absolute, Directory]{}, ErrRepoRootNotFoundInFilesystem
}

type ExecutionOptions struct {
	RepoRoot         Path[Absolute, Directory]
	FileOptions      *syntax.FileOptions
	Timeout          time.Duration
	ConcurrencyLimit int
}

type ExecutionOption func(*ExecutionOptions)

func WithRepoRoot(repoRoot Path[Absolute, Directory]) ExecutionOption {
	return func(opts *ExecutionOptions) {
		opts.RepoRoot = repoRoot
	}
}

func WithTimeout(timeout time.Duration) ExecutionOption {
	return func(opts *ExecutionOptions) {
		opts.Timeout = timeout
	}
}

func WithConcurrencyLimit(limit int) ExecutionOption {
	return func(opts *ExecutionOptions) {
		opts.ConcurrencyLimit = limit
	}
}

func AllowSetFunction(set bool) ExecutionOption {
	return func(opts *ExecutionOptions) {
		opts.FileOptions.Set = set
	}
}

func AllowWhileStatements(allow bool) ExecutionOption {
	return func(opts *ExecutionOptions) {
		opts.FileOptions.While = allow
	}
}

func AllowTopLevelControlStatements(allow bool) ExecutionOption {
	return func(opts *ExecutionOptions) {
		opts.FileOptions.TopLevelControl = allow
	}
}

func NewExecutionOptions(opts ...ExecutionOption) (ExecutionOptions, error) {
	executionOptions := ExecutionOptions{
		FileOptions:      DefaultFileOptions(),
		Timeout:          DefaultTimeout(),
		ConcurrencyLimit: DefaultConcurrencyLimit(),
	}

	repoRoot, err := RepoRootFromEnv()
	if err == nil {
		executionOptions.RepoRoot = repoRoot
	} else {
		slog.Debug("Repository root environment variable not set, falling back to filesystem search")
		repoRoot, err = RepoRootFromFilesystem()
		if err == nil {
			executionOptions.RepoRoot = repoRoot
		} else {
			return ExecutionOptions{}, ErrRepoRootNotFound
		}
	}

	for _, opt := range opts {
		opt(&executionOptions)
	}

	return executionOptions, nil
}

func DefaultFileOptions() *syntax.FileOptions {
	return &syntax.FileOptions{
		Set:             true,
		While:           true,
		TopLevelControl: true,
	}
}

func DefaultTimeout() time.Duration {
	return 5 * time.Minute
}

func DefaultConcurrencyLimit() int {
	return 4
}

func ParseImports(executionOptions ExecutionOptions, packagePath Path[Relative, File]) ([]Path[Relative, File], error) {
	slog.Debug("Parsing imports for package", "packagePath", packagePath.String())

	absolutePackagePath := Join(executionOptions.RepoRoot, packagePath)
	file, err := executionOptions.FileOptions.Parse(absolutePackagePath.String(), nil, 0)
	if err != nil {
		var syntaxError syntax.Error
		src, readErr := os.ReadFile(absolutePackagePath.String())
		if readErr != nil {
			return nil, readErr
		}

		if errors.As(err, &syntaxError) {
			state := parser.State{
				Input:  src,
				Line:   int(syntaxError.Pos.Line),
				Column: int(syntaxError.Pos.Col),
			}

			parseError := parser.ParseError{
				Message: syntaxError.Msg,
				At:      state,
			}

			fmt.Println(parseError.Pretty())

			return nil, parseError.Error()
		}

		return nil, err
	}

	imports := []Path[Relative, File]{}
	syntax.Walk(file, func(n syntax.Node) bool {
		if stmt, ok := n.(*syntax.LoadStmt); ok {
			importPathS := stmt.Module.Value.(string)
			importPath, err := ParseRelativeFile(importPathS)
			if err != nil {
				return true
			}

			slog.Debug("Found import", "importPath", importPath.String())
			imports = append(imports, importPath)
		}

		return true
	})

	return imports, nil
}

func GetDependents(importGraph gograph.Graph[Path[Relative, File]], of Path[Relative, File]) iter.Seq[Path[Relative, File]] {
	return func(yield func(Path[Relative, File]) bool) {
		vertex := importGraph.GetVertexByID(of)
		if vertex == nil {
			return
		}

		for _, edge := range importGraph.EdgesOf(vertex) {
			if edge.Destination() == vertex {
				if !yield(edge.Source().Label()) {
					return
				}
			}
		}
	}
}

func GetDependencies(importGraph gograph.Graph[Path[Relative, File]], of Path[Relative, File]) iter.Seq[Path[Relative, File]] {
	return func(yield func(Path[Relative, File]) bool) {
		vertex := importGraph.GetVertexByID(of)
		if vertex == nil {
			return
		}

		for _, edge := range importGraph.EdgesOf(vertex) {
			if edge.Source() == vertex {
				if !yield(edge.Destination().Label()) {
					return
				}
			}
		}
	}
}

func BuildImportGraph(executionOptions ExecutionOptions, packagePath Path[Relative, File]) (gograph.Graph[Path[Relative, File]], error) {
	importGraph := gograph.New[Path[Relative, File]](
		gograph.Directed(),
		gograph.Acyclic(),
	)

	queue := []Path[Relative, File]{packagePath}
	visited := make(map[Path[Relative, File]]bool)

	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]

		if visited[current] {
			continue
		}
		visited[current] = true

		imports, err := ParseImports(executionOptions, current)
		if err != nil {
			return nil, err
		}

		from := importGraph.AddVertexByLabel(current)

		for _, importPath := range imports {
			to := importGraph.AddVertexByLabel(importPath)
			importGraph.AddEdge(from, to)
			queue = append(queue, importPath)
		}
	}

	return importGraph, nil
}

type Package struct {
	Path      Path[Relative, File]
	Workflows map[Target]Workflow
	Builder   *WorkflowGraphBuilder
	Globals   starlark.StringDict
}

func NewPackage(path Path[Relative, File]) *Package {
	return &Package{
		Path:      path,
		Workflows: make(map[Target]Workflow),
		Builder:   NewWorkflowGraphBuilder(),
	}
}

type ExecutionResult struct {
	Package Package
	Err     error
}

func builtins(pkg *Package) starlark.StringDict {
	builtins := starlark.StringDict{
		"action": starlark.NewBuiltin("action", ActionBuiltin()),
		"file":   starlark.NewBuiltin("file", FileBuiltin()),
		"dir":    starlark.NewBuiltin("dir", DirBuiltin()),
		"policy": starlark.NewBuiltin("policy", PolicyBuiltin()),
		"workflow": starlark.NewBuiltin("workflow", WorkflowBuiltin(pkg.Path, func(wf Workflow) {
			pkg.Workflows[wf.Target()] = wf
		})),
	}

	return builtins
}

func Execute(ctx context.Context, executeOptions ExecutionOptions, target Target) (Workflow, error) {
	importGraph, err := BuildImportGraph(executeOptions, target.Path)
	if err != nil {
		return nil, err
	}

	packages, err := executeGraph(ctx, executeOptions, importGraph)
	if err != nil {
		return nil, err
	}

	pkg, ok := packages[target.Path]
	if !ok {
		return nil, fmt.Errorf("package for target %s not found after execution", target)
	}

	wf, ok := pkg.Workflows[target]
	if !ok {
		return nil, fmt.Errorf("workflow for target %s not found in package %s", target, pkg.Path)
	}

	return wf, nil
}

func executeGraph(
	rootCtx context.Context,
	executionOptions ExecutionOptions,
	importGraph gograph.Graph[Path[Relative, File]],

) (map[Path[Relative, File]]Package, error) {
	ctx, cancel := context.WithCancel(rootCtx)
	defer cancel()

	sortedVertices, err := gograph.TopologySort(importGraph)
	if err != nil {
		return nil, err
	}

	nodes := make([]Path[Relative, File], len(sortedVertices))
	for i, vertex := range sortedVertices {
		nodes[i] = vertex.Label()
	}

	jobs := make(chan Path[Relative, File], len(nodes))
	results := make(chan ExecutionResult, len(nodes))
	packages := make(map[Path[Relative, File]]Package)

	indegrees := make(map[Path[Relative, File]]int)
	for _, node := range nodes {
		indegrees[node] = len(slices.Collect(GetDependencies(importGraph, node)))
	}

	var wg sync.WaitGroup
	for i := 0; i < executionOptions.ConcurrencyLimit; i++ {
		wg.Go(func() {
			worker(ctx, executionOptions, jobs, results, packages)
		})
	}

	for _, path := range nodes {
		if indegrees[path] == 0 {
			jobs <- path
		}
	}

	completedCount := 0
	for completedCount < len(nodes) {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()

		case res := <-results:
			if res.Err != nil {
				return nil, res.Err
			}

			packages[res.Package.Path] = res.Package
			completedCount++

			for dependent := range GetDependents(importGraph, res.Package.Path) {
				indegrees[dependent]--
				if indegrees[dependent] == 0 {
					jobs <- dependent
				}
			}
		}
	}

	close(jobs)
	wg.Wait()

	return packages, nil
}

const workflowBuilderThreadLocalKey = "workflowBuilder"

func worker(
	ctx context.Context,
	executionOptions ExecutionOptions,
	jobs <-chan Path[Relative, File],
	results chan<- ExecutionResult,
	packages map[Path[Relative, File]]Package,
) {
	for packagePath := range jobs {
		slog.Debug("Executing package", "packagePath", packagePath.String())

		taskCtx, cancelTask := context.WithTimeout(ctx, executionOptions.Timeout)

		absolutePackagePath := Join(executionOptions.RepoRoot, packagePath)
		src, err := os.ReadFile(absolutePackagePath.String())
		if err != nil {
			results <- ExecutionResult{Err: fmt.Errorf("failed to read package source %s: %w", packagePath, err)}
			cancelTask()
			continue
		}

		pkg := NewPackage(packagePath)

		thread := &starlark.Thread{
			Name: absolutePackagePath.String(),
			Load: func(thread *starlark.Thread, importPath string) (starlark.StringDict, error) {
				slog.Debug("Loading import", "packagePath", packagePath.String(), "importPath", importPath)
				importedPackage := packages[Path[Relative, File]{path: importPath}]
				pkg.Builder.Union(importedPackage.Builder)
				return importedPackage.Globals, nil
			},
		}

		thread.SetLocal(workflowBuilderThreadLocalKey, pkg.Builder)

		done := make(chan struct{})

		go func() {
			select {
			case <-taskCtx.Done():
				if taskCtx.Err() != nil {
					thread.Cancel(taskCtx.Err().Error())
				}
			case <-done:
			}
		}()

		globals, err := starlark.ExecFileOptions(&syntax.FileOptions{}, thread, absolutePackagePath.String(), src, builtins(pkg))

		close(done)

		if err != nil {
			results <- ExecutionResult{Err: fmt.Errorf("failed to execute package %s: %w", packagePath, err)}
			cancelTask()
			continue
		}

		cancelTask()
		pkg.Globals = globals

		results <- ExecutionResult{
			Package: *pkg,
			Err:     nil,
		}
	}
}
