package skycastle

import (
	"fmt"
	"skycastle/skycastle/parser"

	"github.com/galsondor/go-ascii"
)

type Target struct {
	Path Path[Relative, File]
	Name string
}

func (t Target) String() string {
	return fmt.Sprintf("//%s:%s", t.Path, t.Name)
}

var isTargetPathChar = func(b byte) bool {
	return ascii.IsLower(b) || ascii.IsUpper(b) || ascii.IsDigit(b) || b == '/' || b == '.' || b == '_' || b == '-'
}

func isTargetNameChar(b byte) bool {
	return ascii.IsLower(b) || ascii.IsUpper(b) || ascii.IsDigit(b) || b == '_' || b == '-' || b == '=' || b == ',' || b == '@' || b == '~' || b == '+'
}

var nameP = parser.TakeWhile1[parser.Result[Target]](
	func(b byte) bool {
		return isTargetNameChar(b)
	}, "[A-Za-z0-9_/.=,@~+-]+")

var prefixP = parser.String[parser.Result[Target]]("//")

var delimiterP = parser.Byte[parser.Result[Target]](':')

var targetP = parser.SkipThen(
	prefixP,
	parser.Then(
		relativeFileP[parser.Result[Target]](isTargetPathChar),
		func(path Path[Relative, File]) parser.Parser[Target, parser.Result[Target]] {
			return parser.SkipThen(
				delimiterP,
				parser.Map(nameP, func(name []byte) Target {
					return Target{
						Path: path,
						Name: string(name),
					}
				}),
			)
		},
	),
)

func ParseTarget(input string) (Target, error) {
	res, err := parser.ExactS(targetP, input)
	if err != nil {
		return Target{}, fmt.Errorf("failed to parse target: %w", err)
	}
	return res, nil
}
