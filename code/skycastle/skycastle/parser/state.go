package parser

import (
	"bytes"
)

type State struct {
	input  []byte
	ix     int
	line   int
	column int
}

func NewState(input []byte) State {
	return State{
		input:  input,
		ix:     0,
		line:   1,
		column: 1,
	}
}

func (s State) Advance(by []byte) State {
	for i := 0; i < len(by); i++ {
		n := bytes.IndexByte(by, '\n')
		if n == -1 {
			s.ix += len(by)
			s.column += len(by)
			return s
		}
		s.ix += n + 1
		s.line++
		s.column = 1
		by = by[n+1:]
	}

	return s
}
