import * as stylex from '@stylexjs/stylex';

import { backgroundColor, textColor } from '../tokens.stylex';

export const styles = stylex.create({
  base: {
    width: 'fit-content',
    borderRadius: '12px',
    padding: '4px 8px',
    backgroundColor: backgroundColor.tooltip,
    userSelect: 'none',
    zIndex: 200,
  },
  label: {
    fontSize: '15px',
    lineHeight: '1',
    color: textColor.tooltip,
  },
});
