package parser

import (
	"bytes"
	"fmt"
	"unsafe"

	"github.com/galsondor/go-ascii"
)

func AnyByte[R any]() Parser[byte, R] {
	return func(s SourcePosition, accept Accept[byte, R], reject Reject[R]) R {
		if s.EOF() {
			return reject(false, UnexpectedEOF(s, "any byte"), s)
		}

		b := s.Peek()
		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func Byte[R any](b byte) Parser[byte, R] {
	return func(s SourcePosition, accept Accept[byte, R], reject Reject[R]) R {
		if s.EOF() {
			return reject(false, UnexpectedEOF(s, fmt.Sprintf("%q", b)), s)
		}

		if s.Peek() != b {
			err := NewSourceError(
				Singleton(s),
				WithExpected(fmt.Sprintf("%q", b)),
				WithGot(fmt.Sprintf("%q", s.Peek())),
				WithDefaultContext(),
			)

			return reject(false, err, s)
		}

		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func Satisfy[R any](predicate func(byte) bool, expected ...string) Parser[byte, R] {
	return func(s SourcePosition, accept Accept[byte, R], reject Reject[R]) R {
		if s.EOF() {
			return reject(false, UnexpectedEOF(s, expected...), s)
		}

		b := s.Peek()
		if !predicate(b) {
			err := NewSourceError(
				Singleton(s),
				WithExpected(expected...),
				WithGot(fmt.Sprintf("%q", b)),
				WithDefaultContext(),
			)

			return reject(false, err, s)
		}

		s = s.Advance([]byte{b})
		return accept(true, b, s)
	}
}

func String[R any](str string) Parser[string, R] {
	return func(s SourcePosition, accept Accept[string, R], reject Reject[R]) R {
		if s.Index()+len(str) > len(s.Source) {
			return reject(false, UnexpectedEOF(s, fmt.Sprintf("%q", str)), s)
		}

		b := unsafe.Slice(unsafe.StringData(str), len(str))

		if !bytes.Equal(s.Source[s.Index():s.Index()+len(str)], b) {
			span := SourceSpan{Start: s, Length: len(str)}

			err := NewSourceError(
				span,
				WithExpected(fmt.Sprintf("%q", str)),
				WithGot(fmt.Sprintf("%q", s.Source[s.Index():s.Index()+len(str)])),
				WithContext(
					span,
					"here",
				),
			)

			return reject(false, err, s)
		}

		s = s.Advance([]byte(str))
		return accept(true, str, s)
	}
}

func TakeWhile[R any](predicate func(byte) bool) Parser[[]byte, R] {
	return func(s SourcePosition, accept Accept[[]byte, R], reject Reject[R]) R {
		start := s.Index()
		for !s.EOF() && predicate(s.Peek()) {
			s = s.Advance([]byte{s.Peek()})
		}
		return accept(s.Index() > start, s.Source[start:s.Index()], s)
	}
}

func TakeWhile1[R any](predicate func(byte) bool, expected string) Parser[[]byte, R] {
	return func(s SourcePosition, accept Accept[[]byte, R], reject Reject[R]) R {
		if s.EOF() {
			return reject(false, UnexpectedEOF(s, expected), s)
		}

		start := s.Index()

		for !s.EOF() && predicate(s.Peek()) {
			s = s.Advance([]byte{s.Peek()})
		}

		if s.Index() == start {
			err := NewSourceError(
				Singleton(s),
				WithExpected(expected),
				WithGot(fmt.Sprintf("%q", s.Peek())),
				WithDefaultContext(),
			)

			return reject(false, err, s)
		}

		return accept(true, s.Source[start:s.Index()], s)
	}
}

func SkipWhitespaceAscii[R any]() Parser[[]byte, R] {
	return TakeWhile[R](func(b byte) bool {
		return ascii.IsSpace(b)
	})
}
