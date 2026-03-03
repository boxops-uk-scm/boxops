package skycastle

import (
	"fmt"

	"go.starlark.net/starlark"
	"go.starlark.net/starlarkstruct"
)

type StarlarkFunction func(thread *starlark.Thread, fn *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error)

func WorkflowBuiltin(packagePath Path[Relative, File], b *WorkflowGraphBuilder, callback func(Workflow)) StarlarkFunction {
	return func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (val starlark.Value, err error) {
		if len(args) > 0 {
			err = fmt.Errorf("workflow() does not accept positional arguments")
			return
		}

		var (
			name        string
			description string
			goals       *starlark.List
		)

		if err = starlark.UnpackArgs("workflow", args, kwargs,
			"name", &name,
			"description?", &description,
			"goals?", &goals,
		); err != nil {
			return
		}

		if name == "" {
			err = fmt.Errorf("workflow() requires a name")
			return
		}

		var goalHandles []ArtifactHandle
		if goals != nil {
			iter := goals.Iterate()
			defer iter.Done()

			var goalVal starlark.Value
			for iter.Next(&goalVal) {
				goalStr, ok := goalVal.(starlark.String)
				if !ok {
					err = fmt.Errorf("goals must be strings")
					return
				}

				goalHandle, err := UniqueFromStarlarkString(goalStr)
				if err != nil {
					return nil, fmt.Errorf("invalid goal handle: %w", err)
				}

				goalHandles = append(goalHandles, ArtifactHandle(goalHandle))
			}
		}

		workflowOpts := []WorkflowSpecOption{}
		if description != "" {
			workflowOpts = append(workflowOpts, WithWorkflowDescription(description))
		}

		workflow, err := b.Build(
			Target{
				Path: packagePath,
				Name: name,
			},
			goalHandles,
			workflowOpts...,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to build workflow: %w", err)
		}

		callback(workflow)
		val = starlark.None
		return
	}
}

func FileBuiltin(b *WorkflowGraphBuilder) StarlarkFunction {
	return ArtifactBuiltin(b, ArtifactKindFile)
}

func DirBuiltin(b *WorkflowGraphBuilder) StarlarkFunction {
	return ArtifactBuiltin(b, ArtifactKindDirectory)
}

func ArtifactBuiltin(b *WorkflowGraphBuilder, kind ArtifactKind) StarlarkFunction {
	return func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (val starlark.Value, err error) {
		if len(args) > 0 {
			err = fmt.Errorf("artifact() does not accept positional arguments")
			return
		}

		var (
			description string
		)

		if err = starlark.UnpackArgs("artifact", args, kwargs,
			"description?", &description,
		); err != nil {
			return
		}

		artifactOpts := []ArtifactOption{}
		if description != "" {
			artifactOpts = append(artifactOpts, WithArtifactDescription(description))
		}

		artifactHandle := b.AddArtifact(kind, artifactOpts...)

		val = Unique(artifactHandle).StarlarkString()
		return
	}
}

func ActionBuiltin(b *WorkflowGraphBuilder) StarlarkFunction {
	return func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error) {
		var (
			description string
			command     string
			policyDict  *starlark.Dict
			inputsDict  *starlark.Dict
			outputsDict *starlark.Dict
		)

		if err := starlark.UnpackArgs("action", args, kwargs,
			"description?", &description,
			"command", &command,
			"policy?", &policyDict,
			"inputs?", &inputsDict,
			"outputs?", &outputsDict,
		); err != nil {
			return nil, err
		}

		if command == "" {
			return nil, fmt.Errorf("action() requires a command")
		}

		var actionOpts []ActionOption
		if description != "" {
			actionOpts = append(actionOpts, WithActionDescription(description))
		}

		if policyDict != nil {
			policy, err := PolicyFromStarlarkDict(policyDict)
			if err != nil {
				return nil, err
			}

			actionOpts = append(actionOpts, WithPolicy(policy))
		}

		action := b.AddAction(
			command,
			actionOpts...,
		)

		stdoutArtifactHandle, _ := b.AddOutputFile(
			action,
			"@stdout",
			WithArtifactDescription("stdout"))

		stderrArtifactHandle, _ := b.AddOutputFile(
			action,
			"@stderr",
			WithArtifactDescription("stderr"))

		if inputsDict != nil {
			iter := inputsDict.Iterate()
			defer iter.Done()

			var key starlark.Value
			for iter.Next(&key) {
				name, ok := key.(starlark.String)
				if !ok {
					return nil, fmt.Errorf("input names must be strings")
				}

				value, ok, err := inputsDict.Get(key)
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

				artifactHandle, err := UniqueFromStarlarkString(artifactIdS)
				if err != nil {
					return nil, fmt.Errorf("invalid UUID for key %v: %v", key, err)
				}

				port, err := PortFromStarlarkString(name)
				if err != nil {
					return nil, err
				}

				b.AddInput(action, port, ArtifactHandle(artifactHandle))
			}
		}

		var outputs *starlark.Dict

		if outputsDict != nil {
			outputs = starlark.NewDict(outputsDict.Len())
			iter := outputsDict.Iterate()
			defer iter.Done()

			var key starlark.Value
			for iter.Next(&key) {
				name, ok := key.(starlark.String)
				if !ok {
					return nil, fmt.Errorf("output names must be strings")
				}

				value, ok, err := outputsDict.Get(key)
				if err != nil {
					return nil, err
				}
				if !ok {
					return nil, fmt.Errorf("output key not found: %v", key)
				}

				artifactIdS, ok := value.(starlark.String)
				if !ok {
					return nil, fmt.Errorf("output value for key %v is not a string: %v", key, value)
				}

				artifactHandle, err := UniqueFromStarlarkString(artifactIdS)
				if err != nil {
					return nil, fmt.Errorf("invalid UUID for key %v: %v", key, err)
				}

				port, err := PortFromStarlarkString(name)
				if err != nil {
					return nil, err
				}

				err = b.AddOutput(action, port, ArtifactHandle(artifactHandle))
				if err != nil {
					return nil, fmt.Errorf("failed to add output for key %v: %v", key, err)
				}

				outputs.SetKey(key, value)
			}
		} else {
			outputs = starlark.NewDict(0)
		}

		val := starlarkstruct.FromStringDict(
			starlark.String("action"),
			starlark.StringDict{
				"outputs": outputs,
				"stdout":  Unique(stdoutArtifactHandle).StarlarkString(),
				"stderr":  Unique(stderrArtifactHandle).StarlarkString(),
			},
		)

		return val, nil
	}
}

func PolicyBuiltin(_ *WorkflowGraphBuilder) StarlarkFunction {
	return func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (val starlark.Value, err error) {
		policy := Policy{}

		var (
			maxRetries         int
			maxDurationSeconds int
		)

		if err = starlark.UnpackArgs("policy", args, kwargs,
			"max_retries?", &maxRetries,
			"max_duration_seconds?", &maxDurationSeconds,
		); err != nil {
			return
		}

		if maxRetries < 0 {
			err = fmt.Errorf("max_retries cannot be negative")
			return
		}

		if maxDurationSeconds < 0 {
			err = fmt.Errorf("max_duration_seconds cannot be negative")
			return
		}

		policy.MaxRetries = maxRetries
		policy.MaxDurationSeconds = maxDurationSeconds

		val = policy.StarlarkDict()
		return
	}
}
