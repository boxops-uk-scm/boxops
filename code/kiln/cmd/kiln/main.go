package main

import (
	"fmt"
	"io"
	"os"

	"github.com/boxops-uk-scm/boxops/code/kiln/parser"
	"github.com/boxops-uk-scm/boxops/code/kiln/path"
)

const Source = "package main\n\nfunc main() {\n\tfoo := 5\n\tprintln(foo)\n\tfoo := 10\n}"

func main() {
	fmt.Println(io.EOF)

	firstSpan := parser.SourceSpan{
		Start: parser.SourcePosition{
			Path:     path.NewPath[path.Absolute, path.File]("code/kiln/cmd/kiln/main.go"),
			Source:   []byte(Source),
			Position: parser.NewPosition().Advance([]byte("package main\n\nfunc main() {\n\t")),
		},
		Length: 3,
	}

	secondSpan := parser.SourceSpan{
		Start: parser.SourcePosition{
			Path:     path.NewPath[path.Absolute, path.File]("code/kiln/cmd/kiln/main.go"),
			Source:   []byte(Source),
			Position: parser.NewPosition().Advance([]byte("package main\n\nfunc main() {\n\tfoo := 5\n\tprintln(foo)\n\t")),
		},
		Length: 3,
	}

	err := parser.NewSourceError(firstSpan,
		parser.WithMessage("cannot redeclare variable 'foo'"),
		parser.WithContext(
			firstSpan,
			"first declared here",
		),
		parser.WithContext(
			secondSpan,
			"redeclared here",
		),
	)

	err.FPrintln(os.Stderr, parser.WithShowWhitespace(true))

	fmt.Fprintln(os.Stderr)

	span := parser.SourceSpan{
		Start: parser.SourcePosition{
			Path:     path.NewPath[path.Absolute, path.File]("code/kiln/cmd/kiln/main.go"),
			Source:   []byte(Source),
			Position: parser.NewPosition().Advance([]byte("package main\n\nfunc main() {\n\t")),
		},
		Length: 33,
	}

	err = parser.NewSourceError(span,
		parser.WithMessage("missing return statement"),
		parser.WithContext(
			span,
			"expected return statement within this block",
		),
	)

	err.FPrintln(os.Stderr, parser.WithShowWhitespace(true))
}
