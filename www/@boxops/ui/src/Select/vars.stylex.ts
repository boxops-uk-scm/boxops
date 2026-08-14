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
  /**
   * The tint of the 3px ring inside the frame — and a var rather than a value for a reason worth
   * stating, because getting it wrong is a bug this component already had.
   *
   * Two separate things decide the ring: *whether* there is one (focus, or an open popup) and *what
   * colour* it is (the accent, or whatever status the caller asserted). Those are known in different
   * places. Written as a colour, the status style has to restate the whole `box-shadow` — and since
   * it is applied after the open style, its own `default` then overrode the open one, so a field in
   * error lost its ring the moment the list opened. Naming the colour lets the status style say only
   * the half it knows.
   */
  ringColor: null,
  placeholderColor: null,
  labelColor: null,
  messageColor: null,
});
