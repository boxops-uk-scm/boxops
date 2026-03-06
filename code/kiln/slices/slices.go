package slices

import "cmp"

func Maximum[T cmp.Ordered](items []T) (max T) {
	return MaximumBy(cmp.Compare, items)
}

func MaximumBy[T any](compare func(a, b T) int, items []T) (max T) {
	for i, item := range items {
		if i == 0 || compare(item, max) > 0 {
			max = item
		}
	}

	return max
}

func Map[T any, U any](project func(T) U, items []T) []U {
	result := make([]U, len(items))
	for i, item := range items {
		result[i] = project(item)
	}

	return result
}

func SplitAt[T any](index int, items []T) (before []T, after []T) {
	return items[:index], items[index:]
}
