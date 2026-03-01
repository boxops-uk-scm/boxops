package slice_extensions

func Map[A, B any](xs []A, f func(A) B) []B {
	out := make([]B, len(xs))
	for i, x := range xs {
		out[i] = f(x)
	}
	return out
}
