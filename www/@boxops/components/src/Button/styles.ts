import * as stylex from '@stylexjs/stylex';

import { vars as badgeVars } from '../Badge/vars.stylex';
import { vars as spinnerVars } from '../Spinner/vars.stylex';
import { gap, outlineColor, padding, semanticColor, textColor } from '../tokens.stylex';

import { vars } from './vars.stylex';

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
    [badgeVars.color]: {
      default: 'white',
      ':enabled:hover': `color-mix(in srgb, black 5%, white 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, white 90%)`,
    },
    [badgeVars.backgroundColor]: {
      default: 'rgba(0,0,0,0.5)',
      ':disabled': 'rgba(0,0,0,0.2)',
    },
    [badgeVars.fill]: badgeVars.color,
    [vars.color]: badgeVars.color,
    [spinnerVars.fill]: badgeVars.color,
  },
  onLightMedia: {
    [vars.color]: {
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
  label: {
    whiteSpace: 'nowrap',
    color: vars.color,
    userSelect: 'none',
  },
  placeholder: {
    '::before': {
      display: 'block',
      content: 'attr(data-text)',
      height: '0px',
      overflow: 'hidden',
      visibility: 'hidden',
    },
  },
  compact: {
    padding: `${padding.XS} ${padding.S}`,
    gap: gap.XS,
  },
});
