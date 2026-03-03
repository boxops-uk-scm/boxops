package parser

import (
	"os"
	"unsafe"
)

type Accept[T any, R any] func(consumed bool, val T, s State) R

type Reject[R any] func(consumed bool, err ParseError, s State) R

type Parser[T any, R any] func(s State, accept Accept[T, R], reject Reject[R]) R

type Result[T any] struct {
	val T
	ok  bool
	err ParseError
}

func Exact[T any](p Parser[T, Result[T]], input []byte) (T, error) {
	st := NewState(input)
	res := p(st,
		func(_ bool, v T, st2 State) Result[T] {
			if st2.Ix != len(input) {
				return Result[T]{ok: false, err: ExpectedEndOfInput(st2, string(st2.Input[st2.Ix:]))}
			}
			return Result[T]{val: v, ok: true}
		},
		func(_ bool, err ParseError, st2 State) Result[T] { return Result[T]{ok: false, err: err} },
	)

	if res.ok {
		return res.val, nil
	}

	os.Stderr.WriteString(res.err.Pretty() + "\n")
	return res.val, res.err.Error()
}

func ExactS[T any](p Parser[T, Result[T]], input string) (T, error) {
	return Exact(p, unsafe.Slice(unsafe.StringData(input), len(input)))
}
