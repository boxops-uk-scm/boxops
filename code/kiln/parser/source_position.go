package parser

import (
	"bytes"

	"github.com/boxops-uk-scm/boxops/code/kiln/path"
)

const Newline byte = '\n'

type SourcePosition struct {
	Path     path.Path[path.Absolute, path.File]
	Source   []byte
	Position Position
}

func (s SourcePosition) Advance(by []byte) SourcePosition {
	s.Position = s.Position.Advance(by)
	return s
}

func (s SourcePosition) EOF() bool {
	return s.Position.Index >= len(s.Source)
}

func (s SourcePosition) Index() int {
	return s.Position.Index
}

func (s SourcePosition) Line() int {
	return s.Position.Line
}

func (s SourcePosition) Column() int {
	return s.Position.Column
}

func (s SourcePosition) Peek() byte {
	if s.EOF() {
		return 0
	}

	return s.Source[s.Position.Index]
}

func (s SourcePosition) Pop() (byte, SourcePosition) {
	if s.EOF() {
		return 0, s
	}

	c := s.Source[s.Position.Index]
	s.Position = s.Position.Advance([]byte{c})
	return c, s
}

func (s SourcePosition) PreviousLineEnd() (SourcePosition, bool) {
	i := bytes.LastIndexByte(s.Source[:s.Position.Index], Newline)
	if i == -1 {
		return SourcePosition{}, false
	}

	lineStart := 0
	if i > 0 {
		prevNewline := bytes.LastIndexByte(s.Source[:i], Newline)
		if prevNewline != -1 {
			lineStart = prevNewline + 1
		}
	}

	column := i - lineStart + 1

	return SourcePosition{
		Path:   s.Path,
		Source: s.Source,
		Position: Position{
			Index:  i,
			Line:   s.Position.Line - 1,
			Column: column,
		},
	}, true
}

func (s SourcePosition) LineStart() SourcePosition {
	s.Position.Index -= s.Position.Column - 1
	s.Position.Column = 1
	return s
}

func (s SourcePosition) LineEnd() SourcePosition {
	i := bytes.IndexByte(s.Source[s.Position.Index:], Newline)

	if i == -1 {
		s.Position.Column += len(s.Source) - s.Position.Index
		s.Position.Index = len(s.Source)
		return s
	}

	s.Position.Column += i
	s.Position.Index += i
	return s
}

func (s SourcePosition) LineSpan() SourceSpan {
	return SourceSpan{
		Start:  s.LineStart(),
		Length: s.LineEnd().Position.Index - s.LineStart().Position.Index,
	}
}

type Position struct {
	Index  int
	Line   int
	Column int
}

func NewPosition() Position {
	return Position{
		Index:  0,
		Line:   1,
		Column: 1,
	}
}

func (p Position) Advance(by []byte) Position {
	for len(by) > 0 {
		n := bytes.IndexByte(by, Newline)
		if n == -1 {
			p.Index += len(by)
			p.Column += len(by)
			return p
		}
		p.Index += n + 1
		p.Line++
		p.Column = 1
		by = by[n+1:]
	}
	return p
}

func (p Position) Retreat(by []byte) Position {
	for len(by) > 0 {
		n := bytes.LastIndexByte(by, Newline)
		if n == -1 {
			p.Index -= len(by)
			p.Column -= len(by)
			return p
		}
		p.Index -= len(by) - n
		p.Line--
		p.Column = 1
		by = by[:n]
	}
	return p
}
