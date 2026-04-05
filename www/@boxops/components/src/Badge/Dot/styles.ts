import '../../tokens.stylex';

import * as stylex from '@stylexjs/stylex';

import { vars } from '../vars.stylex';

export const styles = stylex.create({
  base: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: [vars.fill],
  },
});
