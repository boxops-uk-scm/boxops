package parser

import (
	"bytes"
	"testing"

	"pgregory.net/rapid"
)

func TestSourcePosition_EOF(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		// Draw a random slice of bytes
		source := rapid.SliceOf(rapid.Byte()).Draw(t, "source")

		// Advance the SourcePosition to the end of the source
		sp := SourcePosition{Source: source, Position: NewPosition()}
		sp = sp.Advance(source)

		// The SourcePosition should report EOF when at the end of the source.
		if !sp.EOF() {
			t.Fatalf("expected SourcePosition to be at EOF")
		}
	})
}

func TestSourcePosition_Index(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		// Draw a random slice of bytes
		source := rapid.SliceOf(rapid.Byte()).Draw(t, "source")

		// Advance the SourcePosition to a random index within the source
		sp := SourcePosition{Source: source, Position: NewPosition()}
		i := rapid.IntRange(0, len(source)).Draw(t, "index")
		sp = sp.Advance(source[:i])

		// The SourcePosition index should match the number of bytes advanced.
		if sp.Index() != i {
			t.Fatalf("expected index %d, got %d", i, sp.Index())
		}
	})
}

func TestSourcePosition_Line(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		// Draw a random slice of bytes
		source := rapid.SliceOf(rapid.Byte()).Draw(t, "source")

		// Advance the SourcePosition to a random index within the source
		sp := SourcePosition{Source: source, Position: NewPosition()}
		i := rapid.IntRange(0, len(source)).Draw(t, "index")
		sp = sp.Advance(source[:i])

		// Calculate the expected line by counting newlines before the index
		expectedLine := bytes.Count(source[:i], []byte{Newline}) + 1

		// The SourcePosition line should match the number of newlines + 1.
		if sp.Line() != expectedLine {
			t.Fatalf("expected line %d, got %d", expectedLine, sp.Line())
		}
	})
}

func TestSourcePosition_Column(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		// Draw a random slice of bytes
		source := rapid.SliceOf(rapid.Byte()).Draw(t, "source")

		// Advance the SourcePosition to a random index within the source
		sp := SourcePosition{Source: source, Position: NewPosition()}
		i := rapid.IntRange(0, len(source)).Draw(t, "index")
		sp = sp.Advance(source[:i])

		// Calculate the expected column by finding the last newline before the index
		lastNewline := bytes.LastIndexByte(source[:i], Newline)
		expectedColumn := i - lastNewline
		if lastNewline == -1 {
			expectedColumn = i + 1
		}

		// The SourcePosition column should match the distance from the last newline.
		if sp.Column() != expectedColumn {
			t.Fatalf("expected column %d, got %d", expectedColumn, sp.Column())
		}
	})
}

// // TestPositionAdvance_Properties tests the fundamental math of moving a Position forward.
// func TestPositionAdvance_Properties(t *testing.T) {
// 	rapid.Check(t, func(t *rapid.T) {
// 		// Generate random chunks of bytes (including newlines)
// 		chunks := rapid.SliceOf(rapid.SliceOf(rapid.Byte())).Draw(t, "chunks")

// 		p := NewPosition()
// 		var totalBytes []byte

// 		for _, chunk := range chunks {
// 			p = p.Advance(chunk)
// 			totalBytes = append(totalBytes, chunk...)
// 		}

// 		pDirect := NewPosition().Advance(totalBytes)

// 		// Property 1: Composition. Advancing piece-by-piece should exactly
// 		// match advancing the concatenated string all at once.
// 		if p != pDirect {
// 			t.Fatalf("composition mismatch: piece-by-piece %v != direct %v", p, pDirect)
// 		}

// 		// Property 2: Index constraint. The resulting index must equal the total bytes advanced.
// 		if p.Index != len(totalBytes) {
// 			t.Fatalf("index mismatch: %d != %d", p.Index, len(totalBytes))
// 		}

// 		// Property 3: Line constraint. The resulting line must equal the number of newlines + 1.
// 		expectedLines := bytes.Count(totalBytes, []byte{Newline}) + 1
// 		if p.Line != expectedLines {
// 			t.Fatalf("line mismatch: %d != %d", p.Line, expectedLines)
// 		}
// 	})
// }

// // TestSourcePosition_PopPeek_Properties ensures the cursor can cleanly iterate through a file.
// func TestSourcePosition_PopPeek_Properties(t *testing.T) {
// 	rapid.Check(t, func(t *rapid.T) {
// 		source := rapid.SliceOf(rapid.Byte()).Draw(t, "source")
// 		sp := SourcePosition{Source: source, Position: NewPosition()}

// 		var popped []byte
// 		for !sp.EOF() {
// 			peeked := sp.Peek()
// 			c, nextSp := sp.Pop()

// 			// Property 1: Peek should always preview what Pop removes.
// 			if peeked != c {
// 				t.Fatalf("peeked %c != popped %c", peeked, c)
// 			}
// 			popped = append(popped, c)
// 			sp = nextSp
// 		}

// 		// Property 2: Reversibility. Popping until EOF should perfectly yield the original source.
// 		if !bytes.Equal(popped, source) {
// 			t.Fatalf("popped bytes do not match original source")
// 		}

// 		// Property 3: EOF bounds. Once EOF is reached, Peek/Pop should return 0 safely.
// 		if sp.Peek() != 0 {
// 			t.Fatalf("expected Peek at EOF to be 0")
// 		}
// 		c, _ := sp.Pop()
// 		if c != 0 {
// 			t.Fatalf("expected Pop at EOF to yield 0")
// 		}
// 	})
// }

// // TestSourcePosition_LineBoundaries_Properties validates LineStart and LineEnd math.
// func TestSourcePosition_LineBoundaries_Properties(t *testing.T) {
// 	rapid.Check(t, func(t *rapid.T) {
// 		source := rapid.SliceOf(rapid.Byte()).Draw(t, "source")
// 		if len(source) == 0 {
// 			t.Skip("skipping empty source")
// 		}

// 		// Pick an arbitrary cursor location
// 		idx := rapid.IntRange(0, len(source)-1).Draw(t, "idx")
// 		sp := SourcePosition{Source: source, Position: NewPosition()}.Advance(source[:idx])

// 		ls := sp.LineStart()
// 		le := sp.LineEnd()
// 		span := sp.LineSpan()

// 		// Property 1: Ordering bounds. LineStart <= Current <= LineEnd
// 		if ls.Position.Index > sp.Position.Index {
// 			t.Fatalf("LineStart index (%d) > current index (%d)", ls.Position.Index, sp.Position.Index)
// 		}
// 		if le.Position.Index < sp.Position.Index {
// 			t.Fatalf("LineEnd index (%d) < current index (%d)", le.Position.Index, sp.Position.Index)
// 		}

// 		// Property 2: Exclusivity. A LineSpan itself should never contain a newline.
// 		if bytes.Contains(span.Bytes(), []byte{Newline}) {
// 			t.Fatalf("LineSpan contains a newline: %q", span.Bytes())
// 		}

// 		// Property 3: Boundary proofs. The byte immediately preceding a LineStart
// 		// must be a newline (or it's the start of the file).
// 		if ls.Position.Index > 0 && source[ls.Position.Index-1] != Newline {
// 			t.Fatalf("Byte preceding LineStart is not a newline")
// 		}

// 		// Property 4: Boundary proofs. The byte exactly at LineEnd
// 		// must be a newline (or it's EOF).
// 		if le.Position.Index < len(source) && source[le.Position.Index] != Newline {
// 			t.Fatalf("Byte at LineEnd is not a newline")
// 		}
// 	})
// }

// // TestSourceSpan_Lines_Properties verifies that multiline spans split correctly into sub-spans.
// func TestSourceSpan_Lines_Properties(t *testing.T) {
// 	rapid.Check(t, func(t *rapid.T) {
// 		source := rapid.SliceOf(rapid.Byte()).Draw(t, "source")

// 		startIdx := rapid.IntRange(0, len(source)).Draw(t, "startIdx")
// 		endIdx := rapid.IntRange(startIdx, len(source)).Draw(t, "endIdx")

// 		sp := SourcePosition{Source: source, Position: NewPosition()}.Advance(source[:startIdx])
// 		span := SourceSpan{Start: sp, Length: endIdx - startIdx}

// 		lines := span.Lines()

// 		// Property 1: Line counting matches array length.
// 		if span.LineCount() != len(lines) {
// 			t.Fatalf("LineCount %d != len(Lines) %d", span.LineCount(), len(lines))
// 		}

// 		var reconstructed []byte
// 		for i, line := range lines {
// 			// Property 2: No child line span should be multiline.
// 			if line.Multiline() {
// 				t.Fatalf("Child line from Lines() is Multiline: %q", line.Bytes())
// 			}

// 			reconstructed = append(reconstructed, line.Bytes()...)

// 			// We append the newline manually because span.Lines() excludes the delimiter.
// 			if i < len(lines)-1 {
// 				reconstructed = append(reconstructed, Newline)
// 			}
// 		}

// 		// Property 3: Reversibility. Re-joining the lines with newlines should
// 		// exactly match the original raw span bytes.
// 		if !bytes.Equal(reconstructed, span.Bytes()) {
// 			t.Fatalf("Reconstructed span doesn't match original.\nGot:  %q\nWant: %q", reconstructed, span.Bytes())
// 		}
// 	})
// }
