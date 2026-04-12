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

const variantStyles = {
  appearance: stylex.create({
    default: {
      [vars.backgroundColor]: {
        default: backgroundColor.button,
        ':disabled': `color-mix(in srgb, white 50%, ${backgroundColor.button} 50%)`,
        ':enabled:hover': `color-mix(in srgb, black 5%, ${backgroundColor.button} 95%)`,
        ':enabled:active': `color-mix(in srgb, black 10%, ${backgroundColor.button} 90%)`,
      },
    },
    flat: {
      [vars.backgroundColor]: {
        default: 'transparent',
        ':disabled': 'rgba(255,255,255,0.5)',
        ':enabled:hover': 'rgba(0,0,0,0.05)',
        ':enabled:active': 'rgba(0,0,0,0.1)',
      },
    },
    primary: {
      [vars.backgroundColor]: {
        default: semanticColor.accent,
        ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.accent} 50%)`,
        ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.accent} 95%)`,
        ':enabled:active': `color-mix(in srgb, black 10%, ${semanticColor.accent} 90%)`,
      },
    },
    negative: {
      [vars.backgroundColor]: {
        default: semanticColor.negative,
        ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.negative} 50%)`,
        ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.negative} 95%)`,
        ':enabled:active': `color-mix(in srgb, black 10%, ${semanticColor.negative} 90%)`,
      },
    },
    positive: {
      [vars.backgroundColor]: {
        default: semanticColor.positive,
        ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.positive} 50%)`,
        ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.positive} 95%)`,
        ':enabled:active': `color-mix(in srgb, black 10%, ${semanticColor.positive} 90%)`,
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
    [iconVars.fill]: {
      default: 'white',
      ':enabled:hover': `color-mix(in srgb, black 5%, white 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, white 90%)`,
    },
  },
  spinner: {
    [spinnerVars.fill]: null,
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
    [iconVars.fill]: {
      default: iconColor.onLightMedia,
      ':disabled': `color-mix(in srgb, white 50%, ${iconColor.onLightMedia} 50%)`,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${iconColor.onLightMedia} 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, ${iconColor.onLightMedia} 90%)`,
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
      const onLightMedia = appearance === 'default' || appearance === 'flat';
      const labelBaseStyle = loading ? baseStyles.placeholder : baseStyles.label;
      const state: Button.State = { variants, disabled: !!disabled, loading: !!loading };

      const startContent = bx.useRenderFunction(startContentRenderProp, state);
      const endContent = bx.useRenderFunction(endContentRenderProp, state);

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<Button.Variants>(variantStyles, variants),
        onLightMedia && baseStyles.onLightMedia,
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
                    {onLightMedia ? label : <Text as="b">{label}</Text>}
                  </Text>
                )}
                {state.loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text data-text={label} xstyle={labelBaseStyle} />
                    <Spinner variants={{ color: onLightMedia ? 'onLightMedia' : 'onDarkMedia' }} xstyle={baseStyles.spinner} />
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
