package skycastle

import (
	"fmt"
	"skycastle/skycastle/parser"

	"github.com/galsondor/go-ascii"
	"go.starlark.net/starlark"
)

// A port identifies an input or output of an action.
// Port names consist of one or more uppercase letters, digits, or underscores ([A-Z0-9_]+).
// Port names must be unique within an action, but the same port name can be used in different actions.
type Port string

var portCharP = parser.TakeWhile1[parser.Result[Port]](
	func(b byte) bool {
		return ascii.IsUpper(b) || ascii.IsDigit(b) || b == '_'
	}, "[A-Z0-9_]+")

var portP = parser.Map(portCharP, func(b []byte) Port {
	return Port(string(b))
})

func ParsePort(input string) (Port, error) {
	res, err := parser.ExactS(portP, input)
	if err != nil {
		return "", fmt.Errorf("failed to parse port: %w", err)
	}
	return res, nil
}

func (p Port) String() string {
	return string(p)
}

func (p Port) StarlarkString() starlark.String {
	return starlark.String(p)
}

func PortFromStarlarkString(s starlark.String) (Port, error) {
	p, err := ParsePort(string(s))
	if err != nil {
		return "", err
	}
	return p, nil
}
