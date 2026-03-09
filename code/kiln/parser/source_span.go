package parser

import (
	"bytes"

	"github.com/boxops-uk-scm/boxops/code/kiln/path"
)

type SourceSpan struct {
	Start  SourcePosition
	Length int
}

func Singleton(pos SourcePosition) SourceSpan {
	return SourceSpan{
		Start:  pos,
		Length: 1,
	}
}

func (s SourceSpan) Path() path.Path[path.Absolute, path.File] {
	return s.Start.Path
}

func (s SourceSpan) Bytes() []byte {
	return s.Start.Source[s.Start.Position.Index : s.Start.Position.Index+s.Length]
}

func (s SourceSpan) String() string {
	return string(s.Bytes())
}

func (s SourceSpan) End() SourcePosition {
	return SourcePosition{
		Path:     s.Start.Path,
		Source:   s.Start.Source,
		Position: s.Start.Position.Advance(s.Start.Source[s.Start.Position.Index : s.Start.Position.Index+s.Length]),
	}
}

func (s SourceSpan) PreviousLine() (SourceSpan, bool) {
	previousLineEnd, ok := s.Start.PreviousLineEnd()
	if !ok {
		return SourceSpan{}, false
	}

	previousLineStart := previousLineEnd.LineStart()

	return SourceSpan{
		Start:  previousLineStart,
		Length: previousLineEnd.Position.Index - previousLineStart.Position.Index,
	}, true
}

func (s SourceSpan) IsWhitespace() bool {
	for _, b := range s.Bytes() {
		if b != ' ' && b != '\t' && b != '\n' && b != '\r' {
			return false
		}
	}

	return true
}

func (s SourceSpan) LineStartTo() SourceSpan {
	start := s.Start.LineStart()
	end := s.Start
	return SourceSpan{
		Start:  start,
		Length: end.Position.Index - start.Position.Index,
	}
}

func (s SourceSpan) LineEndFrom() SourceSpan {
	start := s.End()
	end := start.LineEnd()

	return SourceSpan{
		Start:  start,
		Length: end.Position.Index - start.Position.Index,
	}
}

func (s SourceSpan) Multiline() bool {
	return bytes.IndexByte(s.Bytes(), Newline) >= 0
}

func (s SourceSpan) LineCount() int {
	return bytes.Count(s.Bytes(), []byte{Newline}) + 1
}

func (s SourceSpan) Lines() []SourceSpan {
	var lines []SourceSpan

	end := s.End()
	current := s.Start

	for {
		lineEnd := current.LineEnd()

		clampedEndIdx := lineEnd.Position.Index
		if clampedEndIdx > end.Position.Index {
			clampedEndIdx = end.Position.Index
		}

		lines = append(lines, SourceSpan{
			Start:  current,
			Length: clampedEndIdx - current.Position.Index,
		})

		if lineEnd.Position.Index >= end.Position.Index {
			break
		}

		_, current = lineEnd.Pop()
	}

	return lines
}
