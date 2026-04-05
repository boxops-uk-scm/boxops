import '../tokens.stylex';

import * as stylex from '@stylexjs/stylex';

import { vars } from './vars.stylex';

export const styles = stylex.create({
  base: {
    fill: vars.fill,
  },
});
