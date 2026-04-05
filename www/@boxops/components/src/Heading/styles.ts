import * as stylex from '@stylexjs/stylex';

import { textColor } from '../tokens.stylex';

export const styles = stylex.create({
  base: {
    color: textColor.onLightMedia,
    fontFamily: '"Open Sans", sans-serif',
    marginTop: 0,
    marginBlockEnd: 0,
  },
});
