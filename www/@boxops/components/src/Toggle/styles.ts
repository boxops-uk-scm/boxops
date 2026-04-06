import * as stylex from '@stylexjs/stylex';

import { vars as buttonVars, vars } from '../Button/vars.stylex';
import { vars as spinnerVars } from '../Spinner/vars.stylex';
import { gap, outlineColor, padding, semanticColor, textColor } from '../tokens.stylex';

export const styles = stylex.create({
  base: {
    gap: gap.S,
    fill: buttonVars.color,
    backgroundColor: buttonVars.backgroundColor,
    borderTopLeftRadius: buttonVars.borderRadiusLeft,
    borderBottomLeftRadius: buttonVars.borderRadiusLeft,
    borderTopRightRadius: buttonVars.borderRadiusRight,
    borderBottomRightRadius: buttonVars.borderRadiusRight,
    borderWidth: 0,
    display: 'flex',
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
      zIndex: 1,
    },
    [buttonVars.color]: {
      default: textColor.onLightMedia,
      ':disabled': `color-mix(in srgb, white 50%, ${textColor.subtle} 50%)`,
    },
  },
  label: {
    whiteSpace: 'nowrap',
    color: vars.color,
    userSelect: 'none',
    '::before': {
      content: 'attr(data-text)',
      fontWeight: 'bold',
      letterSpacing: '-0.24px',
      display: 'block',
      height: '0px',
      overflow: 'hidden',
      visibility: 'hidden',
      pointerEvents: 'none',
    },
  },
  onLightMedia: {
    [buttonVars.color]: {
      default: textColor.onLightMedia,
      ':disabled': `color-mix(in srgb, white 50%, ${textColor.subtle} 50%)`,
    },
    [spinnerVars.fill]: {
      default: semanticColor.accent,
      ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.accent} 50%)`,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.accent} 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, ${semanticColor.accent} 90%)`,
    },
  },
  compact: {
    padding: `${padding.XS} ${padding.S}`,
    gap: gap.XS,
  },
  selected: {
    [buttonVars.fill]: buttonVars.color,
    [buttonVars.color]: {
      default: semanticColor.accent,
      ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.accent} 50%)`,
    },
    [buttonVars.backgroundColor]: {
      default: 'oklch(66.6% 0.163 257.9 / 16%)',
      ':enabled:hover': 'oklch(66.6% 0.163 257.9 / 28%)',
    },
  },
  selectedIcon: {
    fill: semanticColor.accent,
  },
  placeholder: {
    '::before': {
      display: 'block',
      content: 'attr(data-text)',
      height: '0px',
      overflow: 'hidden',
      visibility: 'hidden',
      fontWeight: 'bold',
      letterSpacing: '-0.24px',
    },
  },
});
