import * as stylex from '@stylexjs/stylex';

// Deliberately unset rather than defaulted to a token: a `defineVars` default is declared once on
// `:root`, so a token reference here would resolve there and stop following a scoped theme.
export const vars = stylex.defineVars({
  overlayColor: null,
  backgroundColor: null,
  iconSize: null,
});
