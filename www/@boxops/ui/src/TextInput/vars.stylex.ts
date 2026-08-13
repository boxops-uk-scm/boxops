import * as stylex from '@stylexjs/stylex';

/**
 * Left empty deliberately, like `Button`'s: a var with no default inherits whatever an ancestor
 * set, so a parent can theme an input it does not own. The values arrive when the styles do.
 *
 * The frame (border, background) belongs to the row rather than the `<input>` itself, because the
 * row is what holds any leading or trailing content — an input drawing its own border would put
 * that content outside the box it appears to sit in.
 */
export const vars = stylex.defineVars({
  color: null,
  backgroundColor: null,
  borderColor: null,
  placeholderColor: null,
  labelColor: null,
  messageColor: null,
});
