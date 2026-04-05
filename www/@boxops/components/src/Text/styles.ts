import '../tokens.stylex';

import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  base: {
    fontFamily: "'Open Sans', sans-serif",
  },
  body: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textSizeAdjust: 'none',
    fontOpticalSizing: 'auto',
    fontVariationSettings: "'wdth' 100",
    marginTop: 0,
    marginBlockEnd: 0,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0px',
    fontWeight: 'normal',
  },
  bold: {
    fontWeight: 'bold',
    letterSpacing: '-0.24px',
  },
  small: {
    fontSize: '14px',
    lineHeight: '20px',
  },
  code: {
    fontFamily: '"Noto Sans Mono", monospace',
  },
  unselectable: {
    userSelect: 'none',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecoration: 'underline',
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
});
