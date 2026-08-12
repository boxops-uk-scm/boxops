import * as stylex from '@stylexjs/stylex';

import { palette } from './palette.stylex';
import {
  backgroundColor,
  colorScheme,
  dividerColor,
  iconColor,
  nonsemanticBackgroundColor,
  nonsemanticTextColor,
  outlineColor,
  scrollbarColor,
  semanticColor,
  textColor,
} from './tokens.stylex';

/**
 * Themes that pin a subtree to one colour scheme.
 *
 * `tokens.stylex.ts` resolves light/dark from `prefers-color-scheme`, which is a whole-document
 * decision. These force the choice instead, so both schemes can be shown at once — which is what
 * the design system demo does. Application code should not normally reach for these: honouring the
 * reader's setting is the default, and that happens automatically via the tokens.
 *
 * Only tokens that actually differ between the schemes are overridden; the rest already resolve to
 * a single value. Values come from `palette.stylex.ts`, so there is one source for each ink.
 */

// Pinning the inks without pinning these two would leave the scrollbars painting against the
// reader's setting while the pane paints against the forced one — the two disagreeing is exactly the
// mismatch a forced theme exists to avoid.
const colorSchemeLight = stylex.createTheme(colorScheme, { ui: 'light' });

const colorSchemeDark = stylex.createTheme(colorScheme, { ui: 'dark' });

const scrollbarLight = stylex.createTheme(scrollbarColor, { subtle: `${palette.gray350} transparent` });

const scrollbarDark = stylex.createTheme(scrollbarColor, { subtle: `${palette.gray600} transparent` });

const semanticLight = stylex.createTheme(semanticColor, {
  accent: palette.blue650,
  accentSelected: 'oklch(66.60% 0.1630 257.90 / 16%)',
  accentSelectedHover: 'oklch(66.60% 0.1630 257.90 / 28%)',
  warning: palette.yellow300,
  info: palette.purple800,
  accentInk: 'oklch(35.06% 0.1746 263.19)',
  positiveInk: 'oklch(35.79% 0.0858 150.59)',
  negativeInk: 'oklch(33.40% 0.1360 25.97)',
  warningInk: 'oklch(38.40% 0.0808 63.05)',
  infoInk: 'oklch(34.97% 0.1541 286.86)',
  accentIconInk: palette.blue650,
  positiveIconInk: palette.green600,
  negativeIconInk: 'oklch(57.88% 0.2330 21.26)',
  warningIconInk: 'oklch(60.04% 0.1370 63.05)',
  infoIconInk: palette.purple800,
});

const semanticDark = stylex.createTheme(semanticColor, {
  accent: palette.blue500,
  accentSelected: 'oklch(56.41% 0.1630 257.90 / 16%)',
  accentSelectedHover: 'oklch(56.60% 0.1630 257.90 / 28%)',
  warning: palette.yellow250,
  info: palette.purple700,
  accentInk: 'oklch(87.32% 0.0618 263.19)',
  positiveInk: 'oklch(87.86% 0.0858 150.59)',
  negativeInk: 'oklch(84.20% 0.0867 25.97)',
  warningInk: 'oklch(90.34% 0.0651 63.05)',
  infoInk: 'oklch(86.44% 0.0701 286.86)',
  accentIconInk: palette.blue500,
  positiveIconInk: 'oklch(63.95% 0.2010 145.04)',
  negativeIconInk: 'oklch(64.18% 0.2445 21.26)',
  warningIconInk: palette.yellow250,
  infoIconInk: 'oklch(65.12% 0.1964 286.56)',
});

const outlineLight = stylex.createTheme(outlineColor, {
  focus: 'oklch(56.3% 0.1932 256.2 / 30%)',
  hover: 'oklch(86.38% 0.0134 251.57 / 30%)',
});

const outlineDark = stylex.createTheme(outlineColor, {
  focus: 'oklch(61.65% 0.2036 255.09 / 30%)',
  hover: 'oklch(50.36% 0.0389 273.95 / 30%)',
});

const backgroundLight = stylex.createTheme(backgroundColor, {
  surface: palette.white,
  card: palette.white,
  navbar: palette.white,
  popover: palette.white,
  secondary: 'oklch(0% 0 0 / 5%)',
  overlay: 'oklch(0% 0 0 / 10%)',
  button: palette.gray100,
  input: palette.white,
  tooltip: palette.gray950,
});

const backgroundDark = stylex.createTheme(backgroundColor, {
  surface: palette.gray1050,
  card: palette.gray1000,
  navbar: palette.gray1050,
  popover: palette.gray950,
  secondary: 'oklch(100% 0 0 / 5%)',
  overlay: 'oklch(100% 0 0 / 10%)',
  button: 'oklch(100% 0 0 / 10%)',
  input: palette.gray950,
  tooltip: palette.white,
});

const textLight = stylex.createTheme(textColor, {
  primary: palette.gray1100,
  subtle: 'oklch(17.98% 0.0158 227.42 / 80%)',
  secondary: palette.gray700,
  disabled: palette.gray350,
  link: palette.blue650,
  tooltip: palette.gray150,
});

const textDark = stylex.createTheme(textColor, {
  primary: palette.gray150,
  subtle: 'oklch(100% 0 0 / 80%)',
  secondary: palette.gray350,
  disabled: palette.gray600,
  link: palette.blue450,
  tooltip: palette.gray1100,
});

const dividerLight = stylex.createTheme(dividerColor, {
  subtle: palette.gray200,
  strong: palette.gray600,
});

const dividerDark = stylex.createTheme(dividerColor, {
  subtle: palette.gray600,
  strong: palette.gray200,
});

const iconLight = stylex.createTheme(iconColor, {
  primary: palette.gray1100,
  secondary: palette.gray700,
  disabled: palette.gray350,
});

const iconDark = stylex.createTheme(iconColor, {
  primary: palette.gray150,
  secondary: palette.gray350,
  disabled: palette.gray600,
});

const nonsemanticBackgroundLight = stylex.createTheme(nonsemanticBackgroundColor, {
  gray: 'oklch(17.98% 0.0158 227.42 / 20%)',
  blue: 'oklch(56.3% 0.1932 256.2 / 20%)',
  green: 'oklch(69.66% 0.1793 150.45 / 20%)',
  yellow: 'oklch(75.76% 0.156365 81.2982 / 20%)',
  orange: 'oklch(70.33% 0.1785 52.82 / 20%)',
  red: 'oklch(58.58% 0.2258 21.26 / 20%)',
  pink: 'oklch(64.35% 0.2381 342.69 / 20%)',
  purple: 'oklch(58.25% 0.2416 286.61 / 20%)',
  teal: 'oklch(70.36% 0.1203 189.21 / 20%)',
  cyan: 'oklch(67.98% 0.1314 227.47 / 20%)',
});

const nonsemanticBackgroundDark = stylex.createTheme(nonsemanticBackgroundColor, {
  gray: 'oklch(87.15% 0.0158 227.42 / 20%)',
  blue: 'oklch(67.28% 0.1732 256.20 / 20%)',
  green: 'oklch(57.62% 0.1604 150.45 / 20%)',
  yellow: 'oklch(51.57% 0.1104 81.30 / 20%)',
  orange: 'oklch(60.04% 0.1566 52.82 / 20%)',
  red: 'oklch(73.15% 0.1378 21.26 / 20%)',
  pink: 'oklch(68.51% 0.2381 342.69 / 20%)',
  purple: 'oklch(64.69% 0.1934 286.61 / 20%)',
  teal: 'oklch(57.07% 0.1017 189.21 / 20%)',
  cyan: 'oklch(59.35% 0.1173 227.47 / 20%)',
});

const nonsemanticTextLight = stylex.createTheme(nonsemanticTextColor, {
  gray: 'oklch(17.98% 0.0158 227.42)',
  blue: 'oklch(36.2% 0.1746 263.19)',
  green: 'oklch(34.07% 0.0858 150.59)',
  yellow: 'oklch(38.36% 0.0808 63.05)',
  orange: 'oklch(39.35% 0.1092 42.79)',
  red: 'oklch(39.35% 0.1454 25.97)',
  pink: 'oklch(37.72% 0.1466 344.72)',
  purple: 'oklch(36.79% 0.1541 286.86)',
  teal: 'oklch(36.79% 0.0559 195.44)',
  cyan: 'oklch(36.2% 0.0629 229.24)',
});

const nonsemanticTextDark = stylex.createTheme(nonsemanticTextColor, {
  gray: 'oklch(99.50% 0.0031 227.42)',
  blue: 'oklch(87.73% 0.0598 263.19)',
  green: 'oklch(89.86% 0.0858 150.59)',
  yellow: 'oklch(85.57% 0.0808 63.05)',
  orange: 'oklch(84.58% 0.0892 42.79)',
  red: 'oklch(84.58% 0.0843 25.97)',
  pink: 'oklch(86.21% 0.0941 344.72)',
  purple: 'oklch(87.14% 0.0663 286.86)',
  teal: 'oklch(87.14% 0.0559 195.44)',
  cyan: 'oklch(87.73% 0.0629 229.24)',
});

export const lightTheme = [
  colorSchemeLight,
  scrollbarLight,
  semanticLight,
  outlineLight,
  backgroundLight,
  textLight,
  dividerLight,
  iconLight,
  nonsemanticBackgroundLight,
  nonsemanticTextLight,
];

export const darkTheme = [
  colorSchemeDark,
  scrollbarDark,
  semanticDark,
  outlineDark,
  backgroundDark,
  textDark,
  dividerDark,
  iconDark,
  nonsemanticBackgroundDark,
  nonsemanticTextDark,
];
