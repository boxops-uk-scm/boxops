import '../tokens.stylex.ts';
import './vars.stylex.ts';
import * as stylex from '@stylexjs/stylex';
import { gap, outlineColor, padding } from '../tokens.stylex.ts';
import { vars } from './vars.stylex.ts';

export const styles = stylex.create({
  base: {
    gap: gap.S,
    fill: vars.color,
    backgroundColor: vars.backgroundColor,
    borderTopLeftRadius: vars.borderRadiusLeft,
    borderBottomLeftRadius: vars.borderRadiusLeft,
    borderTopRightRadius: vars.borderRadiusRight,
    borderBottomRightRadius: vars.borderRadiusRight,
    borderWidth: 0,
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: padding.S,
    cursor: 'pointer',
    ':disabled': {
      cursor: 'not-allowed',
    },
    ':focus-visible': {
      outline: `2px solid ${outlineColor.focus}`,
      outlineOffset: '2px',
    },
  },
});
