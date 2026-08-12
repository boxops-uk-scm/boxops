import * as stylex from '@stylexjs/stylex';

import { palette } from './palette.stylex';

/**
 * Dark values are recovered from the Feb-2025 design-token buffer and mapped onto the v3 token
 * names. Tokens whose recovered dark value equalled the light one are left as a single value.
 * `TODO(dark)` marks tokens the buffer never covered — they do not flip yet.
 */
const DARK = '@media (prefers-color-scheme: dark)';

export const semanticColor = stylex.defineVars({
  accent: { default: palette.blue650, [DARK]: palette.blue500 },
  positive: palette.green600,
  negative: palette.red600,
  warning: { default: palette.yellow300, [DARK]: palette.yellow250 },
  info: { default: palette.purple800, [DARK]: palette.purple700 },
  // TODO(dark): the alpha tints are a v3 addition and predate the buffer; they read acceptably on
  // both grounds because they are transparent, but were never designed against a dark surface.
  // Background of a selected/pressed item, and its hover intensity. Toggle and SideNav each
  // hardcoded these; the dark values are derived by the same rule as the nonsemantic ramp — hue and
  // chroma held, lightness solved so the tint sits the same perceptual distance from its surface.
  accentSelected: { default: 'oklch(66.60% 0.1630 257.90 / 16%)', [DARK]: 'oklch(56.41% 0.1630 257.90 / 16%)' },
  accentSelectedHover: { default: 'oklch(66.60% 0.1630 257.90 / 28%)', [DARK]: 'oklch(56.60% 0.1630 257.90 / 28%)' },
  accentSubtle: 'oklch(61.65% 0.2036 255.09 / 20%)',
  positiveSubtle: 'oklch(64.05% 0.2039 142.85 / 20%)',
  negativeSubtle: 'oklch(58.58% 0.2258 21.26 / 20%)',
  warningSubtle: 'oklch(75.76% 0.156365 81.2982 / 20%)',
  infoSubtle: 'oklch(58.25% 0.2416 286.61 / 20%)',
  focusOutline: 'oklch(53.34% 0.2049 258.81 / 20%)',
});

export const outlineColor = stylex.defineVars({
  focus: { default: 'oklch(56.3% 0.1932 256.2 / 30%)', [DARK]: 'oklch(61.65% 0.2036 255.09 / 30%)' },
  error: 'oklch(58.58% 0.2258 21.26 / 30%)',
  success: 'oklch(64.22% 0.1606 150.66 / 30%)',
  warning: 'oklch(75.76% 0.156365 81.2982 / 30%)',
  hover: { default: 'oklch(86.38% 0.0134 251.57 / 30%)', [DARK]: 'oklch(50.36% 0.0389 273.95 / 30%)' },
});

export const backgroundColor = stylex.defineVars({
  surface: { default: palette.white, [DARK]: palette.gray1050 },
  card: { default: palette.white, [DARK]: palette.gray1000 },
  navbar: { default: palette.white, [DARK]: palette.gray1050 },
  popover: { default: palette.white, [DARK]: palette.gray950 },
  // Must flip: a 5% black wash is invisible on a dark surface.
  secondary: { default: 'oklch(0% 0 0 / 5%)', [DARK]: 'oklch(100% 0 0 / 5%)' },
  // TODO(dark): buffer had no dark badge background (and its light value is not a ramp entry).
  badge: 'oklch(52.43% 0.0299 248.4)',
  button: { default: palette.gray100, [DARK]: 'oklch(100% 0 0 / 10%)' },
  input: { default: palette.white, [DARK]: palette.gray950 },
  // TODO(dark): a 10% black scrim barely registers on a dark ground; likely wants white/~20%.
  overlay: 'oklch(0% 0 0 / 10%)',
  tooltip: { default: palette.gray950, [DARK]: palette.white },
});

/**
 * The dark values in both nonsemantic ramps are derived from the light ones rather than chosen.
 *
 * Measured across the ten light-mode hues, the ramp holds two quantities steady: how far a chip
 * sits from its surface, and how far its ink sits from the chip — both as OKLCH lightness
 * distances. Those distances are the design; the absolute lightnesses are just where they landed
 * on white. So each dark value keeps the light one's hue exactly, keeps its chroma as far as the
 * sRGB gamut allows at the new lightness, and solves only for lightness such that the same two
 * distances hold against the dark surface.
 *
 * Lightness distance was chosen as the invariant over WCAG ratio because the light ramp holds it
 * more tightly (relative spread 7.7% against 13.6%), which says it is the quantity the ramp was
 * actually built on. WCAG is then a check rather than a target — and it lands within ~0.3 of the
 * light-mode ratio for every hue, which is the corroboration that the method is sound.
 *
 * Chroma is the one thing that cannot always survive: sRGB narrows sharply at high lightness, so
 * the light-on-dark inks are necessarily more pastel (blue and purple give up the most). Hue is
 * never touched, so a blue badge stays recognisably the same blue.
 */
export const nonsemanticBackgroundColor = stylex.defineVars({
  gray: { default: 'oklch(17.98% 0.0158 227.42 / 20%)', [DARK]: 'oklch(87.15% 0.0158 227.42 / 20%)' },
  blue: { default: 'oklch(56.3% 0.1932 256.2 / 20%)', [DARK]: 'oklch(67.28% 0.1732 256.20 / 20%)' },
  green: { default: 'oklch(69.66% 0.1793 150.45 / 20%)', [DARK]: 'oklch(57.62% 0.1604 150.45 / 20%)' },
  yellow: { default: 'oklch(75.76% 0.156365 81.2982 / 20%)', [DARK]: 'oklch(51.57% 0.1104 81.30 / 20%)' },
  orange: { default: 'oklch(70.33% 0.1785 52.82 / 20%)', [DARK]: 'oklch(60.04% 0.1566 52.82 / 20%)' },
  red: { default: 'oklch(58.58% 0.2258 21.26 / 20%)', [DARK]: 'oklch(73.15% 0.1378 21.26 / 20%)' },
  pink: { default: 'oklch(64.35% 0.2381 342.69 / 20%)', [DARK]: 'oklch(68.51% 0.2381 342.69 / 20%)' },
  purple: { default: 'oklch(58.25% 0.2416 286.61 / 20%)', [DARK]: 'oklch(64.69% 0.1934 286.61 / 20%)' },
  teal: { default: 'oklch(70.36% 0.1203 189.21 / 20%)', [DARK]: 'oklch(57.07% 0.1017 189.21 / 20%)' },
  cyan: { default: 'oklch(67.98% 0.1314 227.47 / 20%)', [DARK]: 'oklch(59.35% 0.1173 227.47 / 20%)' },
});

export const textColor = stylex.defineVars({
  // Primary body ink, recovered from the buffer's `primary-text`. This is the one that follows the
  // scheme; `onLightMedia`/`onDarkMedia` below name a fixed ground and deliberately do not flip.
  // Without it there is no readable default in dark mode, since `Text` inherits its colour.
  primary: { default: palette.gray1100, [DARK]: palette.gray150 },
  // Fixed by definition — these name the media they sit on, so they must not flip.
  onLightMedia: palette.gray1100,
  onDarkMedia: palette.white,
  // Must flip: this is app body text at 80%, not text on a fixed ground.
  subtle: { default: 'oklch(17.98% 0.0158 227.42 / 80%)', [DARK]: 'oklch(100% 0 0 / 80%)' },
  // Opaque mid-gray secondary text, recovered from the buffer's `secondary-text`. Prefer this over
  // `subtle` where the text sits on a tinted ground and alpha blending would muddy it.
  secondary: { default: palette.gray700, [DARK]: palette.gray350 },
  disabled: { default: palette.gray350, [DARK]: palette.gray600 },
  link: { default: palette.blue650, [DARK]: palette.blue450 },
  tooltip: { default: palette.gray150, [DARK]: palette.gray1100 },
});

/** Derived alongside the tints above — see the note there for the method. */
export const nonsemanticTextColor = stylex.defineVars({
  // `gray` is the one hue that cannot hold its full ink gap: it asks for a lightness above 100%, so
  // it is capped at white. Its contrast still lands at 9.68, comfortably clear of the others.
  gray: { default: 'oklch(17.98% 0.0158 227.42)', [DARK]: 'oklch(99.50% 0.0031 227.42)' },
  blue: { default: 'oklch(36.2% 0.1746 263.19)', [DARK]: 'oklch(87.73% 0.0598 263.19)' },
  green: { default: 'oklch(34.07% 0.0858 150.59)', [DARK]: 'oklch(89.86% 0.0858 150.59)' },
  yellow: { default: 'oklch(38.36% 0.0808 63.05)', [DARK]: 'oklch(85.57% 0.0808 63.05)' },
  orange: { default: 'oklch(39.35% 0.1092 42.79)', [DARK]: 'oklch(84.58% 0.0892 42.79)' },
  red: { default: 'oklch(39.35% 0.1454 25.97)', [DARK]: 'oklch(84.58% 0.0843 25.97)' },
  pink: { default: 'oklch(37.72% 0.1466 344.72)', [DARK]: 'oklch(86.21% 0.0941 344.72)' },
  purple: { default: 'oklch(36.79% 0.1541 286.86)', [DARK]: 'oklch(87.14% 0.0663 286.86)' },
  teal: { default: 'oklch(36.79% 0.0559 195.44)', [DARK]: 'oklch(87.14% 0.0559 195.44)' },
  cyan: { default: 'oklch(36.2% 0.0629 229.24)', [DARK]: 'oklch(87.73% 0.0629 229.24)' },
});

export const dividerColor = stylex.defineVars({
  subtle: { default: palette.gray200, [DARK]: palette.gray600 },
  strong: { default: palette.gray600, [DARK]: palette.gray200 },
});

export const gap = stylex.defineVars({
  XXS: '2px',
  XS: '4px',
  S: '8px',
  M: '16px',
  L: '24px',
  XL: '32px',
  XXL: '48px',
});

export const padding = stylex.defineVars({
  XS: '4px',
  S: '8px',
  M: '16px',
  L: '24px',
});

export const borderRadius = stylex.defineVars({
  button: '8px',
});

export const iconColor = stylex.defineVars({
  // Primary icon ink, and the default an `Icon` picks up when nothing sets a fill. Follows the
  // scheme and matches `textColor.primary` exactly, so an icon and the label beside it agree.
  primary: { default: palette.gray1100, [DARK]: palette.gray150 },
  // Fixed by definition, as with the matching text tokens. `onDarkMedia` stays white in both
  // schemes on purpose: it names an icon sitting on dark media (a photo, a scrim), which is dark
  // regardless of the UI theme. Flipping it would break every real use.
  onLightMedia: palette.gray1100,
  onDarkMedia: palette.white,
  // The buffer never defined dark icon values; these mirror the text ramp, which is where the same
  // greys come from (`secondary` is the buffer's GRAY_700, `disabled` its GRAY_350).
  secondary: { default: palette.gray700, [DARK]: palette.gray350 },
  disabled: { default: palette.gray350, [DARK]: palette.gray600 },
});
