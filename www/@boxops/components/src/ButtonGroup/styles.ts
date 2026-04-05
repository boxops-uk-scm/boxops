import * as stylex from '@stylexjs/stylex';

import { vars as buttonVars } from '../Button/vars.stylex';

export const styles = stylex.create({
  wrapper: {
    display: 'contents',
  },
  start: {
    [buttonVars.borderRadiusRight]: '0px',
  },
  middle: {
    [buttonVars.borderRadiusRight]: '0px',
    [buttonVars.borderRadiusLeft]: '0px',
  },
  end: {
    [buttonVars.borderRadiusLeft]: '0px',
  },
});
