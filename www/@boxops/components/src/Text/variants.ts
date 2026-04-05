import * as stylex from '@stylexjs/stylex';

import { textColor } from '../tokens.stylex';

export const variants = stylex.create({
  subtle: {
    color: textColor.subtle,
  },
  onLightMedia: {
    color: textColor.onLightMedia,
  },
  onDarkMedia: {
    color: textColor.onDarkMedia,
  },
});
