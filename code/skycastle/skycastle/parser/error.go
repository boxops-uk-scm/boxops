package parser

import (
	"errors"
	"fmt"
	"strings"

	"github.com/fatih/color"
)

type ParseError struct {
	at       State
	expected string
	got      string
}

var (
	ErrParse = errors.New("parse error")
)

func (e ParseError) Error() error {
	return fmt.Errorf(
		"%w at line %d, col %d: expected %s, got %s",
		ErrParse,
		e.at.line,
		e.at.column,
		e.expected,
		e.got)
}

func (e ParseError) Pretty() string {
	lines := strings.Split(string(e.at.input), "\n")
	line := e.at.line
	col := e.at.column

	// Styles
	errWord := color.New(color.FgRed, color.Bold).Sprint("error")
	locStyle := color.New(color.FgBlue)
	caretStyle := color.New(color.FgYellow)
	caretHereStyle := color.New(color.FgYellow, color.Bold)

	var sb strings.Builder

	// Header
	sb.WriteString(errWord)
	fmt.Fprintf(&sb, ": expected %s, got %s\n", e.expected, e.got)

	// Location line
	fmt.Fprintf(&sb, "%s\n", locStyle.Sprintf("  --> input:%d:%d", line, col))

	// Bounds check
	if line < 1 || line > len(lines) {
		return sb.String()
	}

	srcLine := lines[line-1]
	lineNumWidth := len(fmt.Sprintf("%d", line))
	pad := strings.Repeat(" ", lineNumWidth)

	gutter := func(num string) string {
		// Keep the coloring only on the gutter, like your original.
		return locStyle.Sprintf("%*s |", lineNumWidth, num)
	}
	emptyGutter := gutter(pad)

	sb.WriteString(emptyGutter + "\n")
	sb.WriteString(gutter(fmt.Sprintf("%d", line)))
	sb.WriteString(" " + srcLine + "\n")
	sb.WriteString(emptyGutter)

	caretCol := min(max(col-1, 0), len(srcLine))
	leading := strings.Repeat(" ", caretCol)

	// Caret + "here"
	sb.WriteString(caretStyle.Sprint(" " + leading + "^"))
	sb.WriteString(caretHereStyle.Sprint(" here"))
	sb.WriteString("\n")

	sb.WriteString(emptyGutter)
	return sb.String()
}

func UnexpectedEndOfInput(at State, expected string) ParseError {
	return ParseError{
		at:       at,
		expected: expected,
		got:      "end of input",
	}
}

func ExpectedEndOfInput(at State, got string) ParseError {
	return ParseError{
		at:       at,
		expected: "end of input",
		got:      got,
	}
}

func NewParseError(at State, expected string, got string) ParseError {
	return ParseError{
		at:       at,
		expected: expected,
		got:      got,
	}
}
