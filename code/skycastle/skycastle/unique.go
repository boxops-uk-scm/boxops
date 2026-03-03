package skycastle

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"skycastle/skycastle/parser"

	"go.starlark.net/starlark"
)

type Unique [20]byte

func NewUnique() Unique {
	var u Unique
	rand.Read(u[:])
	return u
}

func (u Unique) String() string {
	return base64.RawURLEncoding.EncodeToString(u[:])
}

func (u Unique) Short() string {
	return u.String()[:8]
}

func (u Unique) StarlarkString() starlark.String {
	return starlark.String(u.String())
}

func isBase64Char(b byte) bool {
	return (b >= 'A' && b <= 'Z') ||
		(b >= 'a' && b <= 'z') ||
		(b >= '0' && b <= '9') ||
		b == '-' || b == '_'
}

var base64CharP = parser.Satisfy[parser.Result[[]byte]](
	func(b byte) bool {
		return isBase64Char(b)
	},
	"[A-Za-z0-9-_]",
)

var uniqueP = parser.Repeat(base64CharP, 27, "base64 characters")

func UniqueFromStarlarkString(s starlark.String) (Unique, error) {
	res, err := parser.Exact(uniqueP, []byte(s))
	if err != nil {
		return Unique{}, fmt.Errorf("failed to parse unique string: %w", err)
	}

	var u Unique
	base64.RawURLEncoding.Decode(u[:], res)
	return u, nil
}
