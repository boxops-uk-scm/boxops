package path

type opaque struct{}

type Absolute struct {
	_ opaque
}

type Relative struct {
	_ opaque
}

type File struct {
	_ opaque
}

type Directory struct {
	_ opaque
}

type Path[T any, U any] struct {
	raw string
}

func NewPath[T any, U any](raw string) Path[T, U] {
	return Path[T, U]{raw: raw}
}

func (p Path[T, U]) String() string {
	return p.raw
}

// IsZero returns true if the path is empty
// An empty path is *never* a valid path - it is used to represent the absence of a path, and should be treated as an error if encountered in a context where a path is expected.
func (p Path[T, U]) IsZero() bool {
	return p.raw == ""
}

// Join combines an directory path with a relative path.
// The resulting path is of the same type as the directory path (i.e. if the directory path is absolute, the resulting path is absolute; otherwise, the resulting path is relative).
func Join[T any, U any](a Path[T, Directory], b Path[Relative, U]) Path[T, U] {
	return Path[T, U]{raw: a.raw + "/" + b.raw}
}
