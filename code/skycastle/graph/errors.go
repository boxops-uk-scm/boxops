package graph

import (
	"errors"
	"fmt"
)

var (
	ErrInvalidTupleLength = errors.New("invalid tuple length")
	ErrInvalidElementType = errors.New("invalid element type")
)

func NewErrInvalidTupleLength(expected int, actual int) error {
	return fmt.Errorf("%w: expected %d, got %d", ErrInvalidTupleLength, expected, actual)
}

func NewErrInvalidElementType(expected string, actual any) error {
	return fmt.Errorf("%w: expected %s, got %T", ErrInvalidElementType, expected, actual)
}
