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

type SourceErrorOption func(*SourceError)

func NewSourceError(span SourceSpan, options ...SourceErrorOption) SourceError {
	err := SourceError{
		SourceSpan: span,
	}

	for _, option := range options {
		option(&err)
	}

	return err
}

func WithExpected(expected ...string) SourceErrorOption {
	return func(err *SourceError) {
		err.Expected = expected
	}
}

func WithGot(got string) SourceErrorOption {
	return func(err *SourceError) {
		err.Got = got
	}
}

func WithMessage(message string) SourceErrorOption {
	return func(err *SourceError) {
		err.Message = message
	}
}

func WithContext(span SourceSpan, message string) SourceErrorOption {
	return func(err *SourceError) {
		err.Context = append(err.Context, ErrorContext{
			Span:    span,
			Message: message,
		})
	}
}

func WithDefaultContext() SourceErrorOption {
	return func(err *SourceError) {
		err.Context = append(err.Context, ErrorContext{
			Span:    err.SourceSpan,
			Message: "here",
		})
	}
}

type SourceErrorFormat struct {
	TabSize         int
	ShowWhitespace  bool
	ErrorStyle      *color.Color
	PositionStyle   *color.Color
	ContextStyle    *color.Color
	DefaultStyle    *color.Color
	GutterStyle     *color.Color
	WhitespaceStyle *color.Color
}

type SourceErrorFormatOption func(*SourceErrorFormat)

func WithTabSize(tabSize int) SourceErrorFormatOption {
	return func(format *SourceErrorFormat) {
		format.TabSize = tabSize
	}
}

func WithShowWhitespace(show bool) SourceErrorFormatOption {
	return func(format *SourceErrorFormat) {
		format.ShowWhitespace = show
	}
}

func WithErrorStyle(style *color.Color) SourceErrorFormatOption {
	return func(format *SourceErrorFormat) {
		format.ErrorStyle = style
	}
}

func WithPositionStyle(style *color.Color) SourceErrorFormatOption {
	return func(format *SourceErrorFormat) {
		format.PositionStyle = style
	}
}

func WithContextStyle(style *color.Color) SourceErrorFormatOption {
	return func(format *SourceErrorFormat) {
		format.ContextStyle = style
	}
}

func WithDefaultStyle(style *color.Color) SourceErrorFormatOption {
	return func(format *SourceErrorFormat) {
		format.DefaultStyle = style
	}
}

func WithGutterStyle(style *color.Color) SourceErrorFormatOption {
	return func(format *SourceErrorFormat) {
		format.GutterStyle = style
	}
}

func WithWhitespaceStyle(style *color.Color) SourceErrorFormatOption {
	return func(format *SourceErrorFormat) {
		format.WhitespaceStyle = style
	}
}

func NewFormatOptions(options ...SourceErrorFormatOption) SourceErrorFormat {
	formatOptions := SourceErrorFormat{
		TabSize:         4,
		ShowWhitespace:  false,
		ErrorStyle:      color.New(color.FgRed, color.Bold),
		PositionStyle:   color.New(color.Faint),
		ContextStyle:    color.New(color.FgYellow),
		DefaultStyle:    color.New(),
		GutterStyle:     color.New(color.FgBlue),
		WhitespaceStyle: color.New(color.Faint),
	}

	for _, option := range options {
		option(&formatOptions)
	}

	return formatOptions
}

func (s SourceError) Error() string {
	var b strings.Builder
	s.FPrintln(&b)
	return b.String()
}

func UnexpectedEOF(span SourcePosition, expected ...string) SourceError {
	return SourceError{
		SourceSpan: SourceSpan{Start: span},
		Message:    "unexpected end of input",
		Expected:   expected,
	}
}

func ExpectedEOF(span SourcePosition, expected ...string) SourceError {
	return SourceError{
		SourceSpan: SourceSpan{Start: span},
		Expected:   []string{"end of input"},
		Got:        fmt.Sprintf("%q", span.Peek()),
	}
}

type ErrorContext struct {
	Span    SourceSpan
	Message string
}

func fprintList(fprint func(w io.Writer, a ...any), to io.Writer, items []string) {
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

func (err SourceError) FPrintln(to io.Writer, options ...SourceErrorFormatOption) {
	format := NewFormatOptions(options...)

	file, ok := to.(*os.File)
	if !ok || !isatty.IsTerminal(file.Fd()) {
		format = SourceErrorFormat{
			TabSize:         format.TabSize,
			ShowWhitespace:  format.ShowWhitespace,
			ErrorStyle:      color.New(),
			PositionStyle:   color.New(),
			ContextStyle:    color.New(),
			DefaultStyle:    color.New(),
			GutterStyle:     color.New(),
			WhitespaceStyle: color.New(),
		}
	}

	const (
		tabWidth = 4
		tab      = "\t"
	)

	expandTabs := func(s string) string {
		return strings.ReplaceAll(s, tab, strings.Repeat(" ", tabWidth))
	}

	fprintExpandedTabs := func(fprint func(w io.Writer, a ...any), s string) {
		if !format.ShowWhitespace {
			fprint(to, s)
			return
		}

		for _, r := range s {
			switch r {
			case '\t':
				format.WhitespaceStyle.Fprint(to, "→")
				format.WhitespaceStyle.Fprint(to, strings.Repeat(" ", format.TabSize-1))
			case ' ':
				format.WhitespaceStyle.Fprint(to, "·")
			case '\n':
				format.WhitespaceStyle.Fprintln(to, "↵")
			case '\r':
			default:
				fprint(to, string(r))
			}
		}
	}

	displayWidth := func(s string) int {
		return runewidth.StringWidth(expandTabs(s))
	}

	locationString := func(span SourceSpan) string {
		startLine, startCol := span.Start.Line(), span.Start.Column()-1
		endLine, endCol := span.End().Line(), span.End().Column()-1

		if startLine == endLine && startCol+1 == endCol {
			if span.Start.Path.IsZero() {
				return fmt.Sprintf("%d:%d", startLine, startCol)
			}
			return fmt.Sprintf("%s %d:%d", span.Start.Path, startLine, startCol)
		}

		if span.Start.Path.IsZero() {
			return fmt.Sprintf("%d:%d-%d:%d", startLine, startCol, endLine, endCol)
		}
		return fmt.Sprintf("%s %d:%d-%d:%d", span.Start.Path, startLine, startCol, endLine, endCol)
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
		format.GutterStyle.Fprintf(to, "%*d | ", lineNumbersWidth, lineNumber)
	}

	fprintEmptyGutter := func() {
		format.GutterStyle.Fprintf(to, "%*s | ", lineNumbersWidth, "")
	}

	fprintFullLine := func(span SourceSpan) {
		fprintGutter(span.Start.Line())
		fprintExpandedTabs(format.DefaultStyle.FprintFunc(), span.LineStartTo().String()+
			span.String()+
			span.LineEndFrom().String()+"\n")
	}

	fprintSingleLineMarker := func(prefixWidth, spanWidth int, message string) {
		if spanWidth <= 0 {
			spanWidth = 1
		}

		fprintEmptyGutter()
		format.DefaultStyle.Fprint(to, strings.Repeat(" ", prefixWidth))
		format.ContextStyle.Fprint(to, strings.Repeat("^", spanWidth))
		if message != "" {
			format.ContextStyle.Fprint(to, " ")
			format.ContextStyle.Fprint(to, message)
		}
		format.ContextStyle.Fprintln(to)
	}

	fprintMultiLineEdgeMarker := func(prefixWidth, spanWidth int, message string) {
		if spanWidth <= 0 {
			spanWidth = 1
		}

		fprintEmptyGutter()
		format.DefaultStyle.Fprint(to, strings.Repeat(" ", prefixWidth))

		if spanWidth == 1 {
			format.ContextStyle.Fprint(to, "^")
		} else {
			format.ContextStyle.Fprint(to, strings.Repeat("-", spanWidth-1))
			format.ContextStyle.Fprint(to, "^")
		}

		if message != "" {
			format.ContextStyle.Fprint(to, " ")
			format.ContextStyle.Fprint(to, message)
		}
		format.ContextStyle.Fprintln(to)
	}

	fprintSingleLineContext := func(ctx ErrorContext) {
		span := ctx.Span

		before := span.LineStartTo()
		after := span.LineEndFrom()

		fprintGutter(span.Start.Line())
		fprintExpandedTabs(format.DefaultStyle.FprintFunc(), before.String())
		fprintExpandedTabs(format.DefaultStyle.FprintFunc(), span.String())
		fprintExpandedTabs(format.DefaultStyle.FprintFunc(), after.String()+"\n")

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

	format.ErrorStyle.Fprint(to, "error")
	if err.Message != "" {
		format.DefaultStyle.Fprint(to, ": ")
		format.DefaultStyle.Fprint(to, err.Message)
	}

	if (len(err.Context) == 0 || err.Context[0].Span.Path() != err.SourceSpan.Path()) && !err.SourceSpan.Path().IsZero() {
		format.DefaultStyle.Fprint(to, " at ")
		format.PositionStyle.Fprint(to, locationString(err.SourceSpan))
	}

	if len(err.Expected) > 0 {
		format.DefaultStyle.Fprint(to, ": expected ")
		fprintList(format.DefaultStyle.FprintFunc(), to, err.Expected)
	}

	if err.Got != "" {
		format.DefaultStyle.Fprint(to, "; got ")
		format.DefaultStyle.Fprint(to, err.Got)
	}

	if len(err.Context) == 0 {
		return
	}

	fmt.Fprintln(to)

	for i, ctx := range err.Context {
		if i > 0 {
			fmt.Fprintln(to)
		}

		format.PositionStyle.Fprintln(to, locationString(ctx.Span))

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
