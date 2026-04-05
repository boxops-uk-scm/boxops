import '../tokens.stylex';

import * as stylex from '@stylexjs/stylex';

import { vars } from './vars.stylex';

export const styles = stylex.create({
  base: {
    height: '20px',
    borderRadius: '10px',
    padding: `0px 6px 0 6px`,
    minWidth: 'fit-content',
    backgroundColor: vars.backgroundColor,
    fill: vars.fill,
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '12px',
    letterSpacing: -0.24,
    color: vars.color,
  },
  dot: {
    [vars.fill]: `oklch(from ${vars.backgroundColor} l c h / 100%)`,
  },
});
