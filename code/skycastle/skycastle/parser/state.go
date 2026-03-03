package parser

import (
	"bytes"
)

type State struct {
	Input  []byte
	Ix     int
	Line   int
	Column int
}

func NewState(input []byte) State {
	return State{
		Input:  input,
		Ix:     0,
		Line:   1,
		Column: 1,
	}
}

func (s State) Advance(by []byte) State {
	for i := 0; i < len(by); i++ {
		n := bytes.IndexByte(by, '\n')
		if n == -1 {
			s.Ix += len(by)
			s.Column += len(by)
			return s
		}
		s.Ix += n + 1
		s.Line++
		s.Column = 1
		by = by[n+1:]
	}

	return s
}
