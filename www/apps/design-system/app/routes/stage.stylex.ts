import * as stylex from '@stylexjs/stylex';

/**
 * What a pane's component stages are drawn on.
 *
 * Vars rather than a style applied to each stage: there are thirty-odd `<section>`s wearing
 * `componentStage`, and the control that changes them sits in the pane's top bar, which is an
 * ancestor of none of them. Declared once on the pane's content, this reaches all of them — and a
 * third ground, later, costs one entry here rather than thirty edits.
 *
 * No defaults, as with `@boxops/ui`'s own var files: the pane always sets a pair, and a default
 * would be a second place the checkerboard is written down.
 */
export const stage = stylex.defineVars({
  backgroundColor: null,
  backgroundImage: null,
});
