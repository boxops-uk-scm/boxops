import * as stylex from '@stylexjs/stylex';

/**
 * The raw palette the design system is built from.
 *
 * Recovered from the Feb-2025 design-token buffer, where these were hex constants; converted to
 * OKLCH. Sixteen of the values were already present in `tokens.stylex.ts` as inline literals — the
 * ramp was always there, it just had no names. Nothing here is a semantic decision: these are the
 * available inks. Reach for `tokens.stylex.ts` in components, never this file.
 *
 * `defineConsts` rather than `defineVars` deliberately — these are compile-time constants that
 * inline at every use, so both the token definitions and the forced themes in `themes.stylex.ts`
 * can share them without emitting a second layer of CSS variables.
 */
export const palette = stylex.defineConsts({
  white: 'oklch(100% 0 0)',

  gray1100: 'oklch(17.98% 0.0158 227.42)',
  gray1050: 'oklch(23.93% 0.0204 230.31)',
  gray1000: 'oklch(27.93% 0.0250 232.09)',
  gray950: 'oklch(32.20% 0.0274 231.78)',
  gray700: 'oklch(47.98% 0.0328 243.64)',
  gray650: 'oklch(50.36% 0.0389 273.95)',
  gray600: 'oklch(55.66% 0.0317 243.47)',
  gray550: 'oklch(61.08% 0.0310 243.39)',
  gray350: 'oklch(75.16% 0.0219 248.12)',
  gray200: 'oklch(86.38% 0.0134 251.57)',
  gray150: 'oklch(91.07% 0.0098 252.82)',
  gray100: 'oklch(93.74% 0.0076 241.67)',

  blue650: 'oklch(53.34% 0.2049 258.81)',
  blue600: 'oklch(56.30% 0.1932 256.20)',
  blue550: 'oklch(61.65% 0.2036 255.09)',
  blue500: 'oklch(66.13% 0.1833 252.40)',
  blue450: 'oklch(68.69% 0.1636 250.95)',

  green600: 'oklch(54.05% 0.1651 145.04)',
  green500: 'oklch(64.22% 0.1606 150.66)',

  yellow350: 'oklch(75.76% 0.1564 81.30)',
  yellow300: 'oklch(78.64% 0.1602 84.29)',
  yellow250: 'oklch(82.89% 0.1680 89.46)',

  red600: 'oklch(58.58% 0.2258 21.26)',

  purple800: 'oklch(45.28% 0.2565 287.41)',
  purple700: 'oklch(51.72% 0.2826 286.56)',
});
