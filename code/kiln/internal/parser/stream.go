package parser

import "io"

const (
	MinLookbehind = 512
)

type Stream struct {
	src io.Reader
	buf []byte
	hd  int // Current position in the buffer. Bytes before this index have been consumed.
	lo  int // Lower endpoint (inclusive) of the buffer.
	hi  int // Upper bound (exclusive) of the buffer. The next byte read from the source will be stored at this index.
}

func (s *Stream) Lookbehind() []byte {
	return s.buf[s.lo:s.hd]
}

func (s *Stream) Lookahead() []byte {
	return s.buf[s.hd:s.hi]
}
