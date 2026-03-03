package parser

import (
	"errors"
	"fmt"
	"strings"

	"github.com/fatih/color"
)

type ParseError struct {
	At       State
	Expected string
	Got      string
	Message  string
}

var (
	ErrParse = errors.New("parse error")
)

func (e ParseError) Error() error {
	return fmt.Errorf(
		"%w at line %d, col %d: expected %s, got %s",
		ErrParse,
		e.At.Line,
		e.At.Column,
		e.Expected,
		e.Got)
}

func (e ParseError) Pretty() string {
	lines := strings.Split(string(e.At.Input), "\n")
	line := e.At.Line
	col := e.At.Column

	errWord := color.New(color.FgRed, color.Bold).Sprint("error")
	locStyle := color.New(color.FgBlue)
	caretStyle := color.New(color.FgYellow)
	caretHereStyle := color.New(color.FgYellow, color.Bold)

	var sb strings.Builder

	sb.WriteString(errWord)

	if e.Message != "" {
		fmt.Fprintf(&sb, ": %s\n", e.Message)
	} else {
		fmt.Fprintf(&sb, ": expected %s, got %s\n", e.Expected, e.Got)
	}

	fmt.Fprintf(&sb, "%s\n", locStyle.Sprintf("  --> input:%d:%d", line, col))

	if line < 1 || line > len(lines) {
		return sb.String()
	}

	srcLine := lines[line-1]
	lineNumWidth := len(fmt.Sprintf("%d", line))
	pad := strings.Repeat(" ", lineNumWidth)

	gutter := func(num string) string {
		return locStyle.Sprintf("%*s |", lineNumWidth, num)
	}
	emptyGutter := gutter(pad)

	sb.WriteString(emptyGutter + "\n")
	sb.WriteString(gutter(fmt.Sprintf("%d", line)))
	sb.WriteString(" " + srcLine + "\n")
	sb.WriteString(emptyGutter)

	caretCol := min(max(col-1, 0), len(srcLine))
	leading := strings.Repeat(" ", caretCol)

	sb.WriteString(caretStyle.Sprint(" " + leading + "^"))
	sb.WriteString(caretHereStyle.Sprint(" here"))
	sb.WriteString("\n")

	sb.WriteString(emptyGutter)
	return sb.String()
}

func UnexpectedEndOfInput(at State, expected string) ParseError {
	return ParseError{
		At:       at,
		Expected: expected,
		Got:      "end of input",
	}
}

func ExpectedEndOfInput(at State, got string) ParseError {
	return ParseError{
		At:       at,
		Expected: "end of input",
		Got:      got,
	}
}

func NewParseError(at State, expected string, got string) ParseError {
	return ParseError{
		At:       at,
		Expected: expected,
		Got:      got,
	}
}
