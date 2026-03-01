package skycastle

import (
	"errors"

	"go.starlark.net/starlark"
)

type Policy struct {
	MaxDurationSeconds int
	MaxRetries         int
}

func DefaultPolicy() Policy {
	return Policy{}
}

func (p Policy) StarlarkDict() *starlark.Dict {
	dict := starlark.NewDict(2)
	dict.SetKey(starlark.String("max_duration_seconds"), starlark.MakeInt(p.MaxDurationSeconds))
	dict.SetKey(starlark.String("max_retries"), starlark.MakeInt(p.MaxRetries))
	return dict
}

func InvalidFieldType(expected string, got string) error {
	return errors.New("invalid field type: expected " + expected + ", got " + got)
}

func IntTooLarge(fieldName string) error {
	return errors.New(fieldName + " is too large to fit in int64")
}

func PolicyFromStarlarkDict(dict *starlark.Dict) (Policy, error) {
	var p Policy

	starlarkVal, ok, err := dict.Get(starlark.String("max_duration_seconds"))
	if err != nil {
		return p, err
	}
	if ok {
		starlarkInt, ok := starlarkVal.(starlark.Int)
		if !ok {
			return p, InvalidFieldType(starlarkInt.Type(), starlarkVal.Type())
		}

		maxDurationSeconds, ok := starlarkInt.Int64()
		if !ok {
			return p, IntTooLarge("max_duration_seconds")
		}
		p.MaxDurationSeconds = int(maxDurationSeconds)
	}

	starlarkVal, ok, err = dict.Get(starlark.String("max_retries"))
	if err != nil {
		return p, err
	}
	if ok {
		starlarkInt, ok := starlarkVal.(starlark.Int)
		if !ok {
			return p, InvalidFieldType(starlarkInt.Type(), starlarkVal.Type())
		}

		maxRetries, ok := starlarkInt.Int64()
		if !ok {
			return p, IntTooLarge("max_retries")
		}
		p.MaxRetries = int(maxRetries)
	}

	return p, nil
}
