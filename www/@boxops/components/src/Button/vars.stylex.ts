import '../tokens.stylex.ts';

import * as stylex from '@stylexjs/stylex';
import { borderRadius } from '../tokens.stylex';

export const vars = stylex.defineVars({
  backgroundColor: null,
  color: null,
  fill: null,
  borderRadiusLeft: borderRadius.button,
  borderRadiusRight: borderRadius.button,
});
