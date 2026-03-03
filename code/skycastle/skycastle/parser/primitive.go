package parser

import (
	"bytes"
	"fmt"
	"unsafe"

	"github.com/galsondor/go-ascii"
)

func AnyByte[R any]() Parser[byte, R] {
	return func(s State, accept Accept[byte, R], reject Reject[R]) R {
		if s.Ix >= len(s.Input) {
			return reject(false, UnexpectedEndOfInput(s, "any byte"), s)
		}

		b := s.Input[s.Ix]
		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func Byte[R any](b byte) Parser[byte, R] {
	return func(s State, accept Accept[byte, R], reject Reject[R]) R {
		if s.Ix >= len(s.Input) {
			return reject(false, UnexpectedEndOfInput(s, fmt.Sprintf("%q", b)), s)
		}

		if s.Input[s.Ix] != b {
			return reject(false, NewParseError(s, fmt.Sprintf("%q", b), fmt.Sprintf("%q", s.Input[s.Ix])), s)
		}

		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func Satisfy[R any](predicate func(byte) bool, expected string) Parser[byte, R] {
	return func(s State, accept Accept[byte, R], reject Reject[R]) R {
		if s.Ix >= len(s.Input) {
			return reject(false, UnexpectedEndOfInput(s, expected), s)
		}

		b := s.Input[s.Ix]
		if !predicate(b) {
			return reject(false, NewParseError(s, expected, fmt.Sprintf("%q", b)), s)
		}

		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func String[R any](str string) Parser[string, R] {
	return func(s State, accept Accept[string, R], reject Reject[R]) R {
		if s.Ix+len(str) > len(s.Input) {
			return reject(false, UnexpectedEndOfInput(s, fmt.Sprintf("%q", str)), s)
		}

		b := unsafe.Slice(unsafe.StringData(str), len(str))

		if !bytes.Equal(s.Input[s.Ix:s.Ix+len(str)], b) {
			return reject(false, NewParseError(s, fmt.Sprintf("%q", str), fmt.Sprintf("%q", s.Input[s.Ix:s.Ix+len(str)])), s)
		}

		s = s.Advance([]byte(str))
		return accept(true, str, s)
	}
}

func TakeWhile[R any](predicate func(byte) bool) Parser[[]byte, R] {
	return func(s State, accept Accept[[]byte, R], reject Reject[R]) R {
		start := s.Ix
		for s.Ix < len(s.Input) && predicate(s.Input[s.Ix]) {
			s = s.Advance([]byte{s.Input[s.Ix]})
		}
		return accept(s.Ix > start, s.Input[start:s.Ix], s)
	}
}

func TakeWhile1[R any](predicate func(byte) bool, expected string) Parser[[]byte, R] {
	return func(s State, accept Accept[[]byte, R], reject Reject[R]) R {
		if s.Ix >= len(s.Input) {
			return reject(false, UnexpectedEndOfInput(s, expected), s)
		}

		start := s.Ix
		for s.Ix < len(s.Input) && predicate(s.Input[s.Ix]) {
			s = s.Advance([]byte{s.Input[s.Ix]})
		}
		if s.Ix == start {
			return reject(false, NewParseError(s, expected, fmt.Sprintf("%q", s.Input[s.Ix])), s)
		}
		return accept(true, s.Input[start:s.Ix], s)
	}
}

func SkipWhitespaceAscii[R any]() Parser[[]byte, R] {
	return TakeWhile[R](func(b byte) bool {
		return ascii.IsSpace(b)
	})
}
