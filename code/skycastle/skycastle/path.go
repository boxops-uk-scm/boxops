package skycastle

import (
	"bytes"
	"fmt"
	"skycastle/skycastle/parser"
	"strings"
	"unsafe"
)

type Absolute struct{ _ []func() }
type Relative struct{ _ []func() }

type File struct{ _ []func() }
type Directory struct{ _ []func() }

type Path[B, T any] struct {
	path string
}

func (p Path[B, T]) String() string {
	return p.path
}

func (p Path[B, File]) Basename() Path[Relative, File] {
	fileName := takeFileName(p.path)
	return Path[Relative, File]{path: fileName}
}

func Join[B, T any](a Path[B, Directory], b Path[Relative, T]) Path[B, T] {
	return Path[B, T]{path: a.path + b.path}
}

func (p Path[B, T]) Parent() Path[B, Directory] {
	if null(p.path) {
		return Path[B, Directory]{path: ""}
	}

	if isDrive(p.path) {
		return Path[B, Directory]{path: p.path}
	}

	return Path[B, Directory]{path: normalizeDirectory(takeDirectory(dropTrailingPathSeparator(p.path)))}
}

const pathSeparatorC = '/'
const pathSeparatorS = "/"
const relativeRoot = "./"

func isPosixPathChar(c byte) bool {
	return c != '\x00'
}

func ParseAbsoluteDirectory(s string) (Path[Absolute, Directory], error) {
	absDirP := absoluteDirectoryP[parser.Result[Path[Absolute, Directory]]](isPosixPathChar)
	p, err := parser.ExactS(absDirP, s)
	if err != nil {
		return Path[Absolute, Directory]{}, fmt.Errorf("failed to parse absolute directory path: %w", err)
	}
	return p, nil
}

func ParseAbsoluteFile(s string) (Path[Absolute, File], error) {
	absFileP := absoluteFileP[parser.Result[Path[Absolute, File]]](isPosixPathChar)

	p, err := parser.ExactS(absFileP, s)
	if err != nil {
		return Path[Absolute, File]{}, fmt.Errorf("failed to parse absolute file path: %w", err)
	}

	if !isValidAbsoluteFile(p.path) {
		return Path[Absolute, File]{}, fmt.Errorf("normalized path is not a valid file: %s", p)
	}

	return p, nil
}

func ParseRelativeFile(s string) (Path[Relative, File], error) {
	relFileP := relativeFileP[parser.Result[Path[Relative, File]]](isPosixPathChar)

	p, err := parser.ExactS(relFileP, s)
	if err != nil {
		return Path[Relative, File]{}, fmt.Errorf("failed to parse relative file path: %w", err)
	}

	if !isValidRelativeFile(p.path) {
		return Path[Relative, File]{}, fmt.Errorf("normalized path is not a valid file: %s", p)
	}

	return p, nil
}

func ParseRelativeDirectory(s string) (Path[Relative, Directory], error) {
	relDirP := relativeDirectoryP[parser.Result[Path[Relative, Directory]]](isPosixPathChar)
	p, err := parser.ExactS(relDirP, s)
	if err != nil {
		return Path[Relative, Directory]{}, fmt.Errorf("failed to parse relative directory path: %w", err)
	}
	return p, nil
}

func absoluteDirectoryP[R any](isValidPathChar func(byte) bool) parser.Parser[Path[Absolute, Directory], R] {
	return func(s parser.State, accept parser.Accept[Path[Absolute, Directory], R], reject parser.Reject[R]) R {
		return parsePathCore(s, accept, reject, isValidPathChar, func(consumed int, isAbs, hasParent, trailingSep, isDot bool) bool {
			return isAbs && !hasParent
		}, "absolute directory", normalizeDirectory)
	}
}

func absoluteFileP[R any](isValidPathChar func(byte) bool) parser.Parser[Path[Absolute, File], R] {
	return func(s parser.State, accept parser.Accept[Path[Absolute, File], R], reject parser.Reject[R]) R {
		return parsePathCore(s, accept, reject, isValidPathChar, func(consumed int, isAbs, hasParent, trailingSep, isDot bool) bool {
			return isAbs && !hasParent && !trailingSep
		}, "absolute file", normalizeFile)
	}
}

func relativeDirectoryP[R any](isValidPathChar func(byte) bool) parser.Parser[Path[Relative, Directory], R] {
	return func(s parser.State, accept parser.Accept[Path[Relative, Directory], R], reject parser.Reject[R]) R {
		return parsePathCore(s, accept, reject, isValidPathChar, func(consumed int, isAbs, hasParent, trailingSep, isDot bool) bool {
			return !isAbs && !hasParent
		}, "relative directory", normalizeDirectory)
	}
}

func relativeFileP[R any](isValidPathChar func(byte) bool) parser.Parser[Path[Relative, File], R] {
	return func(s parser.State, accept parser.Accept[Path[Relative, File], R], reject parser.Reject[R]) R {
		return parsePathCore(s, accept, reject, isValidPathChar, func(consumed int, isAbs, hasParent, trailingSep, isDot bool) bool {
			return !isAbs && !hasParent && !trailingSep && !isDot
		}, "relative file", normalizeFile)
	}
}

func parsePathCore[B, T, R any](
	s parser.State,
	accept parser.Accept[Path[B, T], R],
	reject parser.Reject[R],
	isValidPathChar func(byte) bool,
	validate func(consumed int, isAbs, hasParent, trailingSep, isDot bool) bool,
	expectedPathType string,
	normalize func(string) string,
) R {
	if s.Ix >= len(s.Input) {
		return reject(false, parser.UnexpectedEndOfInput(s, expectedPathType), s)
	}

	i := s.Ix
	length := len(s.Input)

	isAbs := false
	hasParent := false
	trailingSep := false

	compLen := 0
	isDotDot := false
	isDotComp := false

scan:
	for ; i < length; i++ {
		c := s.Input[i]

		switch c {
		case '\x00':
			break scan
		case '/':
			if i == s.Ix {
				isAbs = true
			}

			trailingSep = true

			if compLen == 2 && isDotDot {
				hasParent = true
			}

			compLen = 0
			isDotDot = false
			isDotComp = false
		default:
			if !isValidPathChar(c) {
				break scan
			}

			trailingSep = false

			switch compLen {
			case 0:
				if c == '.' {
					isDotComp = true
				}
			case 1:
				if isDotComp && c == '.' {
					isDotDot = true
					isDotComp = false
				} else {
					isDotComp = false
				}
			default:
				isDotDot = false
				isDotComp = false
			}
			compLen++
		}
	}

	if compLen == 2 && isDotDot {
		hasParent = true
	}

	consumed := i - s.Ix
	if consumed == 0 {
		return reject(false, parser.NewParseError(s, expectedPathType, "invalid character or NUL"), s)
	}

	isDot := (consumed == 1 && s.Input[s.Ix] == '.')

	if validate(consumed, isAbs, hasParent, trailingSep, isDot) {
		consumedBytes := s.Input[s.Ix:i]
		s = s.Advance(consumedBytes)
		return accept(true, Path[B, T]{path: normalize(string(consumedBytes))}, s)
	}

	return reject(false, parser.NewParseError(s, expectedPathType, "violates path constraints"), s)
}

func isValidRelativeFile(path string) bool {
	return !isAbsolute(path) &&
		!null(path) &&
		!hasParentDirectory(path) &&
		!hasTrailingPathSeparator(path) &&
		path != "." &&
		isValid(path)
}

func isValidRelativeDirectory(path string) bool {
	return !isAbsolute(path) &&
		!null(path) &&
		!hasParentDirectory(path) &&
		isValid(path)
}

func isValidAbsoluteFile(path string) bool {
	return isAbsolute(path) &&
		!hasTrailingPathSeparator(path) &&
		!hasParentDirectory(path) &&
		isValid(path)
}

func isValidAbsoluteDirectory(path string) bool {
	return isAbsolute(path) && !hasParentDirectory(path) && isValid(path)
}

func hasParentDirectory(path string) bool {
	bs := unsafe.Slice(unsafe.StringData(path), len(path))

	return path == ".." ||
		bytes.HasPrefix(bs, []byte{'.', '.', pathSeparatorC}) ||
		bytes.Contains(bs, []byte{pathSeparatorC, '.', '.', pathSeparatorC}) ||
		bytes.HasSuffix(bs, []byte{pathSeparatorC, '.', '.'})
}

func isValid(path string) bool {
	return !null(path) && strings.IndexByte(path, '\x00') == -1
}

func isAbsolute(path string) bool {
	return !isRelative(path)
}

func isRelative(path string) bool {
	return null(takeDrive(path))
}

func takeFileName(path string) string {
	_, fileName := splitFileName(path)
	return fileName
}

func splitDirectories(path string) []string {
	res := splitPath(path)
	for i := range res {
		res[i] = dropTrailingPathSeparator(res[i])
	}
	return res
}

func dropDots(directories []string) []string {
	res := directories[:0]
	for _, dir := range directories {
		if dir == "." {
			continue
		}
		res = append(res, dir)
	}
	return res
}

func normalizeDirectorySeparators(directories []string) []string {
	if len(directories) == 0 {
		return directories
	}

	allPathSeparators := true
	for i := 0; i < len(directories[0]); i++ {
		if directories[0][i] != pathSeparatorC {
			allPathSeparators = false
			break
		}
	}

	if allPathSeparators {
		directories[0] = pathSeparatorS
	}

	return directories
}

func splitPath(path string) []string {
	drive, rest := splitDrive(path)

	if null(path) {
		return []string{}
	}

	cap := 1
	for i := 0; i < len(rest); i++ {
		if rest[i] == pathSeparatorC {
			cap++
		}
	}

	if !null(drive) {
		cap++
	}

	res := make([]string, 0, cap)

	if !null(drive) {
		res = append(res, drive)
	}

	for len(rest) != 0 {
		k := breakSpanEqualIndex(pathSeparatorC, rest)
		res = append(res, rest[:k])
		rest = rest[k:]
	}
	return res
}

func normalizeLeadingSeparators(path string) string {
	leadingSeparators, rest := spanEqual(pathSeparatorC, path)
	if null(leadingSeparators) {
		return rest
	}

	return string(append([]byte{pathSeparatorC}, rest...))
}

func normalize(path string) string {
	drive, rest := splitDrive(path)
	drive = normalizeDrive(drive)

	res := joinPath(dropDots(normalizeDirectorySeparators(splitDirectories(rest))))

	if null(drive) && null(res) {
		res = "."
	} else {
		res = joinDrive(drive, res)
	}

	if isDirectory(rest) && !hasTrailingPathSeparator(res) {
		res = addTrailingPathSeparator(res)
	}

	return res
}

func normalizeDrive(drive string) string {
	if null(drive) {
		return drive
	}

	return pathSeparatorS
}

func joinDrive(drive, path string) string {
	return combineAlways(drive, path)
}

func joinPath(paths []string) string {
	if len(paths) == 0 {
		return ""
	}

	res := paths[0]
	for i := 1; i < len(paths); i++ {
		res = combine(res, paths[i])
	}
	return res
}

func hasLeadingPathSeparator(path string) bool {
	return !null(path) && isPathSeparator(path[0])
}

func combine(a, b string) string {
	if hasLeadingPathSeparator(b) || hasDrive(b) {
		return b
	}

	return combineAlways(a, b)
}

func combineAlways(a, b string) string {
	if null(a) {
		return b
	}

	if null(b) {
		return a
	}

	if hasTrailingPathSeparator(a) {
		return a + b
	}

	return a + pathSeparatorS + b
}

func hasDrive(path string) bool {
	return !null(takeDrive(path))
}

func isDirectory(path string) bool {
	endsWithSlashDot := !null(path) &&
		path[len(path)-1] == '.' &&
		hasTrailingPathSeparator(path[:len(path)-1])

	return hasTrailingPathSeparator(path) || endsWithSlashDot
}

func normalizeDirectory(path string) string {
	return normalizeRelativeDirectory(addTrailingPathSeparator(normalizeFile(path)))
}

func normalizeRelativeDirectory(path string) string {
	if path == relativeRoot {
		return ""
	}

	return path
}

func normalizeFile(path string) string {
	return normalizeLeadingSeparators(normalize(path))
}

func addTrailingPathSeparator(path string) string {
	if !hasTrailingPathSeparator(path) {
		return path + string(pathSeparatorC)
	}

	return path
}

func takeDirectory(path string) string {
	return dropTrailingPathSeparator(dropFileName(path))
}

func dropFileName(path string) string {
	dir, _ := splitFileName(path)
	return dir
}

func splitFileName(path string) (string, string) {
	if null(path) {
		return relativeRoot, ""
	}

	return breakEndEqual(pathSeparatorC, path)
}

func dropTrailingPathSeparator(path string) string {
	if hasTrailingPathSeparator(path) && !isDrive(path) {
		res := dropWhileEndEqual(pathSeparatorC, path)
		if null(res) {
			return path[len(path)-1:]
		}

		return res
	}

	return path
}

func hasTrailingPathSeparator(path string) bool {
	return !null(path) && isPathSeparator(path[len(path)-1])
}

func isPathSeparator(c byte) bool {
	return c == pathSeparatorC
}

func isDrive(path string) bool {
	return !null(path) && null(dropDrive(path))
}

func dropDrive(path string) string {
	_, path = splitDrive(path)
	return path
}

func takeDrive(path string) string {
	drive, _ := splitDrive(path)
	return drive
}

func splitDrive(path string) (string, string) {
	return spanEqual(pathSeparatorC, path)
}

func null(path string) bool {
	return path == ""
}

func dropWhileEndEqual(c byte, s string) string {
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] != c {
			return s[:i+1]
		}
	}
	return ""
}

func dropWhileEnd(p func(byte) bool, s string) string {
	for i := len(s) - 1; i >= 0; i-- {
		if !p(s[i]) {
			return s[:i+1]
		}
	}
	return ""
}

func breakSpanEqualIndex(c byte, s string) (k int) {
	i := 0

	for i < len(s) && s[i] != c {
		i++
	}

	for i < len(s) && s[i] == c {
		i++
	}

	return i
}

func breakEqual(c byte, s string) (string, string) {
	for i := 0; i < len(s); i++ {
		if s[i] == c {
			return s[:i], s[i:]
		}
	}
	return s, ""
}

func breakEndEqual(c byte, s string) (string, string) {
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] == c {
			return s[:i+1], s[i+1:]
		}
	}
	return "", s
}

func spanEqual(c byte, s string) (string, string) {
	for i := 0; i < len(s); i++ {
		if s[i] != c {
			return s[:i], s[i:]
		}
	}
	return s, ""
}
