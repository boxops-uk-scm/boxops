package ord

func Comparing[T, U any](project func(U) T, compare func(a, b T) int) func(a, b U) int {
	return func(a, b U) int {
		return compare(project(a), project(b))
	}
}
