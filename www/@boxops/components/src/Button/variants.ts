import * as stylex from '@stylexjs/stylex';

import { backgroundColor, semanticColor } from '../tokens.stylex';

import { vars } from './vars.stylex';

export const variants = stylex.create({
  default: {
    [vars.backgroundColor]: {
      default: backgroundColor.button,
      ':disabled': `color-mix(in srgb, white 50%, ${backgroundColor.button} 50%)`,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${backgroundColor.button} 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, ${backgroundColor.button} 90%)`,
    },
  },
  flat: {
    [vars.backgroundColor]: {
      default: 'transparent',
      ':disabled': 'rgba(255,255,255,0.5)',
      ':enabled:hover': 'rgba(0,0,0,0.05)',
      ':enabled:active': 'rgba(0,0,0,0.1)',
    },
  },
  primary: {
    [vars.backgroundColor]: {
      default: semanticColor.accent,
      ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.accent} 50%)`,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.accent} 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, ${semanticColor.accent} 90%)`,
    },
  },
  negative: {
    [vars.backgroundColor]: {
      default: semanticColor.negative,
      ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.negative} 50%)`,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.negative} 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, ${semanticColor.negative} 90%)`,
    },
  },
  positive: {
    [vars.backgroundColor]: {
      default: semanticColor.positive,
      ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.positive} 50%)`,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.positive} 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, ${semanticColor.positive} 90%)`,
    },
  },
});
