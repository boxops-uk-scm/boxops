import * as stylex from '@stylexjs/stylex';

import { semanticColor } from '../tokens.stylex';

import { vars } from './vars.stylex';

export const variants = stylex.create({
  accent: {
    [vars.fill]: semanticColor.accent,
  },
});
