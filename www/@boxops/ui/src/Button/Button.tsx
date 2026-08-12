import { Button as ButtonBase } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { vars as badgeVars } from '../Badge/vars.stylex';
import { IconContextProvider } from '../Icon';
import { vars as iconVars } from '../Icon/vars.stylex';
import { Spinner } from '../Spinner';
import { vars as spinnerVars } from '../Spinner/vars.stylex';
import { Text } from '../Text';
import { backgroundColor, gap, iconColor, outlineColor, padding, semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

/**
 * Interaction states are expressed as blends toward a token, not toward a literal, so they follow
 * the colour scheme:
 *
 * - **disabled** fades halfway into `backgroundColor.surface` — the ground the button sits on. It
 *   used to blend toward literal `white`, which is the surface in light mode but the opposite of it
 *   in dark mode, making disabled buttons brighter and more prominent than enabled ones.
 * - **hover/active** shift toward `textColor.primary`, the foreground ink. That darkens on a light
 *   ground and lightens on a dark one, where blending toward literal `black` left almost no
 *   perceptible feedback.
 *
 * In light mode both resolve to the values they always had, so nothing there changes.
 */
const variantStyles = {
  appearance: stylex.create({
    default: {
      [vars.backgroundColor]: {
        default: backgroundColor.button,
        ':disabled': `color-mix(in srgb, ${backgroundColor.surface} 50%, ${backgroundColor.button} 50%)`,
        ':enabled:hover': `color-mix(in srgb, ${textColor.primary} 5%, ${backgroundColor.button} 95%)`,
        ':enabled:active': `color-mix(in srgb, ${textColor.primary} 10%, ${backgroundColor.button} 90%)`,
      },
    },
    flat: {
      [vars.backgroundColor]: {
        default: 'transparent',
        ':disabled': `oklch(from ${backgroundColor.surface} l c h / 50%)`,
        ':enabled:hover': `oklch(from ${textColor.primary} l c h / 5%)`,
        ':enabled:active': `oklch(from ${textColor.primary} l c h / 10%)`,
      },
    },
    primary: {
      [vars.backgroundColor]: {
        default: semanticColor.accent,
        ':disabled': `color-mix(in srgb, ${backgroundColor.surface} 50%, ${semanticColor.accent} 50%)`,
        ':enabled:hover': `color-mix(in srgb, ${textColor.primary} 5%, ${semanticColor.accent} 95%)`,
        ':enabled:active': `color-mix(in srgb, ${textColor.primary} 10%, ${semanticColor.accent} 90%)`,
      },
    },
    negative: {
      [vars.backgroundColor]: {
        default: semanticColor.negative,
        ':disabled': `color-mix(in srgb, ${backgroundColor.surface} 50%, ${semanticColor.negative} 50%)`,
        ':enabled:hover': `color-mix(in srgb, ${textColor.primary} 5%, ${semanticColor.negative} 95%)`,
        ':enabled:active': `color-mix(in srgb, ${textColor.primary} 10%, ${semanticColor.negative} 90%)`,
      },
    },
    positive: {
      [vars.backgroundColor]: {
        default: semanticColor.positive,
        ':disabled': `color-mix(in srgb, ${backgroundColor.surface} 50%, ${semanticColor.positive} 50%)`,
        ':enabled:hover': `color-mix(in srgb, ${textColor.primary} 5%, ${semanticColor.positive} 95%)`,
        ':enabled:active': `color-mix(in srgb, ${textColor.primary} 10%, ${semanticColor.positive} 90%)`,
      },
    },
  }),
  size: stylex.create({
    default: {
      gap: gap.S,
      padding: padding.S,
    },
    compact: {
      padding: `${padding.XS} ${padding.S}`,
      gap: gap.XS,
    },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    // Set on the button itself, not just on `label`: the UA stylesheet gives form controls their
    // own `color`, so a `<button>` never inherits the page ink. Without this, anything passed as
    // `startContent`/`endContent` that relies on inheritance — plain text glyphs, for instance —
    // renders UA black, which happens to look right on a light ground and wrong on a dark one.
    color: vars.color,
    fill: vars.color,
    backgroundColor: vars.backgroundColor,
    borderTopLeftRadius: vars.borderRadiusLeft,
    borderBottomLeftRadius: vars.borderRadiusLeft,
    borderTopRightRadius: vars.borderRadiusRight,
    borderBottomRightRadius: vars.borderRadiusRight,
    borderWidth: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    ':disabled': {
      cursor: 'not-allowed',
    },
    ':focus-visible': {
      outline: `2px solid ${outlineColor.focus}`,
      outlineOffset: '2px',
      zIndex: 1,
    },
    [badgeVars.color]: {
      default: 'white',
      ':enabled:hover': `color-mix(in srgb, ${textColor.primary} 5%, white 95%)`,
      ':enabled:active': `color-mix(in srgb, ${textColor.primary} 10%, white 90%)`,
    },
    [badgeVars.backgroundColor]: {
      default: 'rgba(0,0,0,0.5)',
      ':disabled': 'rgba(0,0,0,0.2)',
    },
    [badgeVars.fill]: badgeVars.color,
    [vars.color]: badgeVars.color,
    [spinnerVars.fill]: badgeVars.color,
    [iconVars.fill]: {
      default: 'white',
      ':enabled:hover': `color-mix(in srgb, ${textColor.primary} 5%, white 95%)`,
      ':enabled:active': `color-mix(in srgb, ${textColor.primary} 10%, white 90%)`,
    },
  },
  spinner: {
    [spinnerVars.fill]: null,
  },
  onSurface: {
    [vars.color]: {
      default: textColor.primary,
      ':disabled': `color-mix(in srgb, ${backgroundColor.surface} 50%, ${textColor.subtle} 50%)`,
    },
    [spinnerVars.fill]: {
      default: semanticColor.accent,
      ':disabled': `color-mix(in srgb, ${backgroundColor.surface} 50%, ${semanticColor.accent} 50%)`,
      ':enabled:hover': `color-mix(in srgb, ${textColor.primary} 5%, ${semanticColor.accent} 95%)`,
      ':enabled:active': `color-mix(in srgb, ${textColor.primary} 10%, ${semanticColor.accent} 90%)`,
    },
    [iconVars.fill]: {
      default: iconColor.primary,
      ':disabled': `color-mix(in srgb, ${backgroundColor.surface} 50%, ${iconColor.primary} 50%)`,
      ':enabled:hover': `color-mix(in srgb, ${textColor.primary} 5%, ${iconColor.primary} 95%)`,
      ':enabled:active': `color-mix(in srgb, ${textColor.primary} 10%, ${iconColor.primary} 90%)`,
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

const Button = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'button'>, Button.Props>(function Button(
      {
        label,
        loading,
        xstyle,
        disabled,
        'aria-label': ariaLabel,
        variants = {
          appearance: 'default',
        },
        startContent: startContentRenderProp,
        endContent: endContentRenderProp,
        ...rest
      },
      ref,
    ) {
      variants = {
        size: 'default',
        appearance: 'default',
        ...variants,
      };

      const appearance = variants.appearance;
      const onSurface = appearance === undefined || appearance === 'default' || appearance === 'flat';
      const labelBaseStyle = loading ? baseStyles.placeholder : baseStyles.label;
      const state: Button.State = { variants, disabled: !!disabled, loading: !!loading };

      const startContent = bx.useRenderFunction(startContentRenderProp, state);
      const endContent = bx.useRenderFunction(endContentRenderProp, state);

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<Button.Variants>(variantStyles, variants),
        onSurface && baseStyles.onSurface,
        bx.useComponentStyleWithState<Button.State>(state, xstyle),
      ];

      return (
        <IconContextProvider weight="fill">
          <ButtonBase aria-label={ariaLabel ?? label} ref={ref} disabled={state.disabled} {...rest} {...stylex.props(styles)}>
            {startContent}
            {(state.loading || label) && (
              <>
                {!state.loading && (
                  <Text data-text={label} xstyle={labelBaseStyle}>
                    {onSurface ? label : <Text as="b">{label}</Text>}
                  </Text>
                )}
                {state.loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text data-text={label} xstyle={labelBaseStyle} />
                    <Spinner variants={{ color: onSurface ? 'onLightMedia' : 'onDarkMedia' }} xstyle={baseStyles.spinner} />
                  </div>
                )}
              </>
            )}
            {endContent}
          </ButtonBase>
        </IconContextProvider>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Button {
  export type Variants = bx.Variants<typeof variantStyles>;

  export interface State extends bx.VariantComponentState<Variants> {
    disabled: boolean;
    loading: boolean;
  }

  export interface Props extends bx.VariantComponentPropsWithState<'button', Variants, State> {
    label?: string;
    loading?: boolean;
    startContent?: bx.RenderFunction<State>;
    endContent?: bx.RenderFunction<State>;
  }
}

export default Button;
