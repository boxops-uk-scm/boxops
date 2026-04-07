import * as stylex from '@stylexjs/stylex';

export const semanticColor = stylex.defineVars({
  accent: 'oklch(53.34% 0.2049 258.81)',
  positive: 'oklch(54.05% 0.1651 145.04)',
  negative: 'oklch(58.58% 0.2258 21.26)',
  warning: 'oklch(78.64% 0.1602 84.29)',
  info: 'oklch(45.28% 0.2565 287.41)',
  accentSubtle: 'oklch(61.65% 0.2036 255.09 / 20%)',
  positiveSubtle: 'oklch(64.05% 0.2039 142.85 / 20%)',
  negativeSubtle: 'oklch(58.58% 0.2258 21.26 / 20%)',
  warningSubtle: 'oklch(75.76% 0.156365 81.2982 / 20%)',
  infoSubtle: 'oklch(58.25% 0.2416 286.61 / 20%)',
  focusOutline: 'oklch(53.34% 0.2049 258.81 / 20%)',
});

export const outlineColor = stylex.defineVars({
  focus: 'oklch(56.3% 0.1932 256.2 / 30%)',
  error: 'oklch(58.58% 0.2258 21.26 / 30%)',
  success: 'oklch(64.22% 0.1606 150.66 / 30%)',
  warning: 'oklch(75.76% 0.156365 81.2982 / 30%)',
  hover: 'oklch(86.38% 0.0134 251.57 / 30%)',
});

export const backgroundColor = stylex.defineVars({
  surface: 'oklch(100% 0 0)',
  card: 'oklch(100% 0 0)',
  navbar: 'oklch(100% 0 0)',
  popover: 'oklch(100% 0 0)',
  secondary: 'oklch(0% 0 0 / 5%)',
  badge: 'oklch(52.43% 0.0299 248.4)',
  button: 'oklch(93.74% 0.0076 241.67)',
  input: 'oklch(100% 0 0)',
  overlay: 'oklch(0% 0 0 / 10%)',
  tooltip: 'oklch(32.2% 0.0274 231.78)',
});

export const nonsemanticBackgroundColor = stylex.defineVars({
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

export const textColor = stylex.defineVars({
  onLightMedia: 'oklch(17.98% 0.0158 227.42)',
  onDarkMedia: 'oklch(100% 0 0)',
  subtle: 'oklch(17.98% 0.0158 227.42 / 80%)',
  link: 'oklch(53.34% 0.2049 258.81)',
  tooltip: 'oklch(91.07% 0.0098 252.82)',
});

export const nonsemanticTextColor = stylex.defineVars({
  gray: 'oklch(17.98% 0.0158 227.42)',
  blue: 'oklch(36.2% 0.1746 263.19)',
  green: 'oklch(34.07% 0.0858 150.59)',
  yellow: 'oklch(42.62% 0.0974 58.56)',
  orange: 'oklch(36.15% 0.1109 39.72)',
  red: 'oklch(36.83% 0.1478 25.03)',
  pink: 'oklch(34.4% 0.150752 338.1014)',
  purple: 'oklch(34.92% 0.1955 287.64)',
  teal: 'oklch(31.88% 0.0518 215.16)',
  cyan: 'oklch(39.11% 0.0968 244.49)',
});

export const dividerColor = stylex.defineVars({
  subtle: 'oklch(86.38% 0.0134 251.57)',
  strong: 'oklch(55.66% 0.0317 243.47)',
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
  onLightMedia: 'oklch(17.98% 0.0158 227.42)',
  onDarkMedia: 'oklch(100% 0 0)',
  secondary: 'oklch(47.98% 0.0328 243.64)',
  disabled: 'oklch(75.16% 0.0219 248.12)',
});
