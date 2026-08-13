import * as stylex from '@stylexjs/stylex';

export const vars = stylex.defineVars({
  // `currentColor`, not a token, because a `defineVars` default is declared once on `:root` — so a
  // token reference here is substituted *there*, freezing the icon to the document's colour scheme
  // and making it immune to any theme scoped to a subtree. `currentColor` resolves at the element
  // instead, so an unstyled icon simply matches the text around it, exactly as `Text` already does
  // by inheriting. Parents that want a specific ink (Button, Toggle, Logo) still set this var.
  fill: 'currentColor',
});
