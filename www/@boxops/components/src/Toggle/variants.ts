import * as stylex from '@stylexjs/stylex';

import { vars as buttonVars } from '../Button/vars.stylex';
import { backgroundColor } from '../tokens.stylex';

export const variants = stylex.create({
  default: {
    [buttonVars.backgroundColor]: {
      default: backgroundColor.button,
      ':disabled': `color-mix(in srgb, white 50%, ${backgroundColor.button} 50%)`,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${backgroundColor.button} 95%)`,
    },
  },
  flat: {
    [buttonVars.backgroundColor]: {
      default: 'transparent',
      ':disabled': 'rgba(255,255,255,0.5)',
      ':enabled:hover': 'rgba(0,0,0,0.05)',
    },
  },
});
