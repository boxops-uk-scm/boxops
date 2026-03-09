package parser

import (
	"unsafe"
)

type Accept[T any, R any] func(consumed bool, val T, s SourcePosition) R

type Reject[R any] func(consumed bool, err SourceError, s SourcePosition) R

type Parser[T any, R any] func(s SourcePosition, accept Accept[T, R], reject Reject[R]) R

type Result[T any] struct {
	val T
	ok  bool
	err SourceError
}

func accept[T any]() Accept[T, Result[T]] {
	return func(_ bool, val T, sp SourcePosition) Result[T] {
		return Result[T]{val: val, ok: true}
	}
}

func reject[T any]() Reject[Result[T]] {
	return func(consumed bool, err SourceError, s SourcePosition) Result[T] {
		return Result[T]{ok: false, err: err}
	}
}

func ParseB[T any](p Parser[T, Result[T]], input []byte) (T, error) {
	res := p(
		SourcePosition{
			Source:   input,
			Position: NewPosition(),
		},
		accept[T](),
		reject[T](),
	)

	if res.ok {
		return res.val, nil
	}

	return res.val, res.err
}

func ParseS[T any](p Parser[T, Result[T]], input string) (T, error) {
	return ParseB(p, unsafe.Slice(unsafe.StringData(input), len(input)))
}

func ParseOnlyB[T any](p Parser[T, Result[T]], input []byte) (T, error) {
	res := p(
		SourcePosition{
			Source:   input,
			Position: NewPosition(),
		},
		func(_ bool, v T, sp SourcePosition) Result[T] {
			if !sp.EOF() {
				return Result[T]{ok: false, err: ExpectedEOF(sp, string(sp.Source[sp.Position.Index:]))}
			}
			return Result[T]{val: v, ok: true}
		},
		reject[T](),
	)

	if res.ok {
		return res.val, nil
	}

	return res.val, res.err
}

func ParseOnlyS[T any](p Parser[T, Result[T]], input string) (T, error) {
	return ParseOnlyB(p, unsafe.Slice(unsafe.StringData(input), len(input)))
}
