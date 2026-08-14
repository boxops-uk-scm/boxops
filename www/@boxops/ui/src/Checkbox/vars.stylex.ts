import * as stylex from '@stylexjs/stylex';

/**
 * Mostly empty defaults, like `TextInput`'s: a var with no default inherits whatever an ancestor
 * set, so a parent can theme a box it does not own. The values arrive with the size variant and the
 * row's own styles.
 *
 * The three geometry vars exist because the parts that need them are not the parts that know them.
 * The size is chosen on the row; the box, the glyph inside it and the description's indent are three
 * separate elements underneath, and none of them can see a prop the row was given.
 */
export const vars = stylex.defineVars({
  /** Edge of the box. The description is indented by this plus the row's gap, so the two line up. */
  controlSize: null,
  /**
   * How far the box drops to sit on the centre of the label's first line.
   *
   * The row aligns to the start rather than the centre, because centring a two-line label against a
   * 16px box floats the box into the middle of the paragraph. Half the difference between the line
   * box and the control puts it where centring would have, and leaves it there when the label wraps.
   */
  controlOffset: null,
  /** The tick or the dash inside the box, small enough to leave a margin against the border. */
  glyphSize: null,
  labelColor: null,
  descriptionColor: null,
  /**
   * How much of the hover treatment the box is taking, as a percentage the box mixes with.
   *
   * A percentage rather than a colour because the box has two resting appearances — ticked and not —
   * and hovering means something different to each: the empty box takes the accent on its border,
   * the filled one darkens the way every other control here darkens. What is shared is only *when*,
   * and when is the one thing the box cannot work out for itself.
   *
   * Native controls light up when you hover their label, not just their box, so the label is where
   * this is declared. The box only reads it — declaring it locally would shadow the label's copy for
   * the box's own subtree, which is exactly how the disabled and read-only styles switch it off.
   *
   * `0%` is a real default rather than `null`, so a box with no label around it still resolves.
   */
  hover: '0%',
});
