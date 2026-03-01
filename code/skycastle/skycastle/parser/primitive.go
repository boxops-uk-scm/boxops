package parser

import (
	"bytes"
	"fmt"
	"unsafe"

	"github.com/galsondor/go-ascii"
)

func AnyByte[R any]() Parser[byte, R] {
	return func(s State, accept Accept[byte, R], reject Reject[R]) R {
		if s.ix >= len(s.input) {
			return reject(false, UnexpectedEndOfInput(s, "any byte"), s)
		}

		b := s.input[s.ix]
		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func Byte[R any](b byte) Parser[byte, R] {
	return func(s State, accept Accept[byte, R], reject Reject[R]) R {
		if s.ix >= len(s.input) {
			return reject(false, UnexpectedEndOfInput(s, fmt.Sprintf("%q", b)), s)
		}

		if s.input[s.ix] != b {
			return reject(false, NewParseError(s, fmt.Sprintf("%q", b), fmt.Sprintf("%q", s.input[s.ix])), s)
		}

		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func Satisfy[R any](predicate func(byte) bool, expected string) Parser[byte, R] {
	return func(s State, accept Accept[byte, R], reject Reject[R]) R {
		if s.ix >= len(s.input) {
			return reject(false, UnexpectedEndOfInput(s, expected), s)
		}

		b := s.input[s.ix]
		if !predicate(b) {
			return reject(false, NewParseError(s, expected, fmt.Sprintf("%q", b)), s)
		}

		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func String[R any](str string) Parser[string, R] {
	return func(s State, accept Accept[string, R], reject Reject[R]) R {
		if s.ix+len(str) > len(s.input) {
			return reject(false, UnexpectedEndOfInput(s, fmt.Sprintf("%q", str)), s)
		}

		b := unsafe.Slice(unsafe.StringData(str), len(str))

		if !bytes.Equal(s.input[s.ix:s.ix+len(str)], b) {
			return reject(false, NewParseError(s, fmt.Sprintf("%q", str), fmt.Sprintf("%q", s.input[s.ix:s.ix+len(str)])), s)
		}

		s = s.Advance([]byte(str))
		return accept(true, str, s)
	}
}

func TakeWhile[R any](predicate func(byte) bool) Parser[[]byte, R] {
	return func(s State, accept Accept[[]byte, R], reject Reject[R]) R {
		start := s.ix
		for s.ix < len(s.input) && predicate(s.input[s.ix]) {
			s = s.Advance([]byte{s.input[s.ix]})
		}
		return accept(s.ix > start, s.input[start:s.ix], s)
	}
}

func TakeWhile1[R any](predicate func(byte) bool, expected string) Parser[[]byte, R] {
	return func(s State, accept Accept[[]byte, R], reject Reject[R]) R {
		if s.ix >= len(s.input) {
			return reject(false, UnexpectedEndOfInput(s, expected), s)
		}

		start := s.ix
		for s.ix < len(s.input) && predicate(s.input[s.ix]) {
			s = s.Advance([]byte{s.input[s.ix]})
		}
		if s.ix == start {
			return reject(false, NewParseError(s, expected, fmt.Sprintf("%q", s.input[s.ix])), s)
		}
		return accept(true, s.input[start:s.ix], s)
	}
}

func SkipWhitespaceAscii[R any]() Parser[[]byte, R] {
	return TakeWhile[R](func(b byte) bool {
		return ascii.IsSpace(b)
	})
}
