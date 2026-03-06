package parser

import (
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/mattn/go-isatty"
	"github.com/mattn/go-runewidth"
)

type SourceError struct {
	SourceSpan SourceSpan
	Message    string
	Expected   []string
	Got        string
	Context    []ErrorContext
}

type ErrorContext struct {
	Span    SourceSpan
	Message string
}

func FPrintList(fprint func(w io.Writer, a ...any), to io.Writer, items []string) {
	switch len(items) {
	case 0:
		return
	case 1:
		fprint(to, items[0])
	default:
		for i, item := range items {
			if i == len(items)-1 {
				fprint(to, "or "+item)
			} else {
				fprint(to, item+", ")
			}
		}
	}
}

func (err SourceError) FPrintln(to io.Writer) {
	var (
		styleNone     = color.New()
		styleDull     = color.New(color.Faint)
		styleError    = color.New(color.FgRed, color.Bold)
		stylePosition = color.New(color.FgBlue)
		styleContext  = color.New(color.FgYellow)
	)

	file, ok := to.(*os.File)
	if !ok || !isatty.IsTerminal(file.Fd()) {
		styleError.DisableColor()
		stylePosition.DisableColor()
		styleContext.DisableColor()
		styleDull.DisableColor()
	}

	const (
		tabWidth = 4
		tab      = "\t"
	)

	expandTabs := func(s string) string {
		return strings.ReplaceAll(s, tab, strings.Repeat(" ", tabWidth))
	}

	displayWidth := func(s string) int {
		return runewidth.StringWidth(expandTabs(s))
	}

	locationString := func(span SourceSpan) string {
		startLine, startCol := span.Start.Line(), span.Start.Column()
		endLine, endCol := span.End().Line(), span.End().Column()

		if startLine == endLine && startCol+1 == endCol {
			if span.Start.Path.IsZero() {
				return fmt.Sprintf("%d:%d", startLine, startCol)
			}
			return fmt.Sprintf("%s %d:%d", span.Start.Path, startLine, startCol)
		}

		if span.Start.Path.IsZero() {
			return fmt.Sprintf("[%d:%d, %d:%d)", startLine, startCol, endLine, endCol)
		}
		return fmt.Sprintf("%s [%d:%d, %d:%d)", span.Start.Path, startLine, startCol, endLine, endCol)
	}

	lineNumbersWidth := 0
	for _, ctx := range err.Context {
		w := len(fmt.Sprintf("%d", ctx.Span.End().Line()))
		if w > lineNumbersWidth {
			lineNumbersWidth = w
		}
	}
	if lineNumbersWidth == 0 {
		lineNumbersWidth = len(fmt.Sprintf("%d", err.SourceSpan.End().Line()))
	}

	fprintGutter := func(lineNumber int) {
		stylePosition.Fprintf(to, "%*d | ", lineNumbersWidth, lineNumber)
	}

	fprintEmptyGutter := func() {
		stylePosition.Fprintf(to, "%*s | ", lineNumbersWidth, "")
	}

	fprintFullLine := func(span SourceSpan) {
		fprintGutter(span.Start.Line())
		styleNone.Fprintln(to, expandTabs(
			span.LineStartTo().String()+
				span.String()+
				span.LineEndFrom().String(),
		))
	}

	fprintSingleLineMarker := func(prefixWidth, spanWidth int, message string) {
		if spanWidth <= 0 {
			spanWidth = 1
		}

		fprintEmptyGutter()
		styleNone.Fprint(to, strings.Repeat(" ", prefixWidth))
		styleContext.Fprint(to, strings.Repeat("^", spanWidth))
		if message != "" {
			styleContext.Fprint(to, " ")
			styleContext.Fprint(to, message)
		}
		styleContext.Fprintln(to)
	}

	fprintMultiLineEdgeMarker := func(prefixWidth, spanWidth int, message string) {
		if spanWidth <= 0 {
			spanWidth = 1
		}

		fprintEmptyGutter()
		styleNone.Fprint(to, strings.Repeat(" ", prefixWidth))

		if spanWidth == 1 {
			styleContext.Fprint(to, "^")
		} else {
			styleContext.Fprint(to, strings.Repeat("-", spanWidth-1))
			styleContext.Fprint(to, "^")
		}

		if message != "" {
			styleContext.Fprint(to, " ")
			styleContext.Fprint(to, message)
		}
		styleContext.Fprintln(to)
	}

	fprintSingleLineContext := func(ctx ErrorContext) {
		span := ctx.Span

		before := span.LineStartTo()
		after := span.LineEndFrom()

		fprintGutter(span.Start.Line())
		styleNone.Fprint(to, expandTabs(before.String()))
		styleNone.Fprint(to, expandTabs(span.String()))
		styleNone.Fprintln(to, expandTabs(after.String()))

		fprintSingleLineMarker(
			displayWidth(before.String()),
			displayWidth(span.String()),
			ctx.Message,
		)
	}

	fprintMultiLineContext := func(ctx ErrorContext) {
		lines := ctx.Span.Lines()
		if len(lines) == 0 {
			return
		}

		firstLine := lines[0]
		lastLine := lines[len(lines)-1]

		fprintFullLine(firstLine)
		fprintMultiLineEdgeMarker(
			0,
			displayWidth(firstLine.LineStartTo().String()+firstLine.String()),
			"",
		)

		for _, line := range lines[1 : len(lines)-1] {
			fprintFullLine(line)
		}

		fprintFullLine(lastLine)
		fprintMultiLineEdgeMarker(
			0,
			displayWidth(lastLine.String()),
			ctx.Message,
		)
	}

	styleError.Fprint(to, "error")
	if err.Message != "" {
		styleNone.Fprint(to, ": ")
		styleNone.Fprint(to, err.Message)
	}

	styleNone.Fprint(to, " at ")
	styleDull.Fprint(to, locationString(err.SourceSpan))

	if len(err.Expected) > 0 {
		styleNone.Fprint(to, ": expected ")
		FPrintList(styleNone.FprintFunc(), to, err.Expected)
	}

	if err.Got != "" {
		styleNone.Fprint(to, "; got ")
		styleNone.Fprint(to, err.Got)
	}

	if len(err.Context) == 0 {
		return
	}

	fmt.Fprintln(to)

	for i, ctx := range err.Context {
		if i > 0 {
			fmt.Fprintln(to)
		}

		styleDull.Fprintln(to, locationString(ctx.Span))

		previousLine, hasPreviousLine := ctx.Span.PreviousLine()
		if hasPreviousLine && !previousLine.IsWhitespace() {
			fprintFullLine(previousLine)
		}

		if ctx.Span.Multiline() {
			fprintMultiLineContext(ctx)
		} else {
			fprintSingleLineContext(ctx)
		}
	}
}
