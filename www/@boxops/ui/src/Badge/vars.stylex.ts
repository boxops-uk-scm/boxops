import * as stylex from '@stylexjs/stylex';

import { backgroundColor, iconColor, textColor } from '../tokens.stylex';

export const vars = stylex.defineVars({
  backgroundColor: backgroundColor.badge,
  fill: iconColor.onDarkMedia,
  color: textColor.onDarkMedia,
});
