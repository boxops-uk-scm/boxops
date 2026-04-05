import * as stylex from '@stylexjs/stylex';

import { textColor } from '../tokens.stylex';

export const styles = stylex.create({
  base: {
    textWrap: 'balance',
    lineHeight: '1.1',
    color: textColor.onLightMedia,
    fontFamily: '"Open Sans", sans-serif',
    marginTop: 0,
    marginBlockEnd: 0,
  },
});
