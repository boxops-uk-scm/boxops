import * as stylex from '@stylexjs/stylex';

/**
 * Left empty deliberately, like `TextInput`'s: a var with no default inherits whatever an ancestor
 * set, so a parent can theme a select it does not own. The values arrive when the styles do.
 *
 * The trigger's frame is described in vars rather than in plain declarations for one reason beyond
 * that: the frame reacts to four conditions — hover, focus, open, and a status the caller asserted —
 * and three of them are known in different places. Naming the colours lets each place set the one it
 * knows about instead of restating the whole border.
 */
export const vars = stylex.defineVars({
  color: null,
  backgroundColor: null,
  borderColor: null,
  placeholderColor: null,
  labelColor: null,
  messageColor: null,
});
