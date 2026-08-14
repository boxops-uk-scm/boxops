import * as stylex from '@stylexjs/stylex';

/**
 * The same set `Checkbox` defines, for the same reasons — the size is chosen on the row, and the
 * button, the dot inside it and the description's indent are three elements underneath that cannot
 * see the row's props. The full reasoning, including why `hover` is a percentage rather than a
 * colour, is written up in `../Checkbox/vars.stylex.ts`.
 *
 * Deliberately a second set rather than the same one. A radio and a checkbox are the same control
 * with a different shape, but they are not the same *element*: a caller theming the radios in a
 * group by setting these on an ancestor should not also be repainting a checkbox that happens to sit
 * in the same form.
 */
export const vars = stylex.defineVars({
  /** Edge of the button. The description is indented by this plus the row's gap, so the two line up. */
  controlSize: null,
  /** How far the button drops to sit on the centre of the label's first line. */
  controlOffset: null,
  /** The dot, which is a good deal smaller than a checkbox's tick — it has a ring to sit inside. */
  glyphSize: null,
  labelColor: null,
  descriptionColor: null,
  /** How much of the hover treatment the button is taking. Declared by the label; read by the button. */
  hover: '0%',
});
