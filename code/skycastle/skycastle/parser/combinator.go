package parser

import "fmt"

func Pure[T any, R any](x T) Parser[T, R] {
	return func(st State, accept Accept[T, R], reject Reject[R]) R {
		return accept(false, x, st)
	}
}

func Map[A any, B any, R any](p Parser[A, R], f func(A) B) Parser[B, R] {
	return func(st State, accept Accept[B, R], reject Reject[R]) R {
		return p(st,
			func(c bool, a A, st2 State) R { return accept(c, f(a), st2) },
			reject,
		)
	}
}

func Then[A any, B any, R any](p Parser[A, R], f func(A) Parser[B, R]) Parser[B, R] {
	return func(st State, accept Accept[B, R], reject Reject[R]) R {
		return p(st,
			func(c1 bool, a A, st2 State) R {
				return f(a)(st2,
					func(c2 bool, b B, st3 State) R { return accept(c1 || c2, b, st3) },
					func(c2 bool, err ParseError, st3 State) R { return reject(c1 || c2, err, st3) },
				)
			},
			reject,
		)
	}
}

func SkipThen[A any, B any, R any](p Parser[A, R], q Parser[B, R]) Parser[B, R] {
	return Then(p, func(_ A) Parser[B, R] { return q })
}

func Or[T any, R any](p, q Parser[T, R]) Parser[T, R] {
	return func(st State, accept Accept[T, R], reject Reject[R]) R {
		return p(st, accept, func(consumed bool, err ParseError, st2 State) R {
			if consumed {
				return reject(true, err, st2)
			}
			return q(st, accept, reject)
		})
	}
}

func Try[T any, R any](p Parser[T, R]) Parser[T, R] {
	return func(st State, accept Accept[T, R], reject Reject[R]) R {
		return p(st,
			accept,
			func(_ bool, err ParseError, _ State) R { return reject(false, err, st) },
		)
	}
}

func Repeat[T any, R any](p Parser[T, R], n int, name string) Parser[[]T, R] {
	return func(st State, accept Accept[[]T, R], reject Reject[R]) R {
		if n < 0 {
			return reject(false, NewParseError(st, "n >= 0", fmt.Sprintf("%d", n)), st)
		}

		out := make([]T, n)

		var loop func(i int, st State, consumedAny bool) R
		loop = func(i int, st State, consumedAny bool) R {
			if i == n {
				return accept(consumedAny, out, st)
			}

			if st.ix >= len(st.input) {
				expected := fmt.Sprint(n, " ", name)
				got := fmt.Sprintf("%d before input was exhausted", i)
				return reject(consumedAny, NewParseError(st, expected, got), st)
			}

			return p(
				st,
				func(consumed bool, val T, st2 State) R {
					out[i] = val
					return loop(i+1, st2, consumedAny || consumed)
				},
				func(consumed bool, err ParseError, st2 State) R {
					return reject(consumedAny || consumed, err, st2)
				},
			)
		}

		return loop(0, st, false)
	}
}
