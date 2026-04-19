import { Toggle as ToggleBase } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';
import { vars as buttonVars } from '../Button/vars.stylex';
import { IconContextProvider } from '../Icon';
import { vars as iconVars } from '../Icon/vars.stylex';
import { backgroundColor, semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

const variantStyles = {
  appearance: stylex.create({
    default: {
      [buttonVars.backgroundColor]: {
        default: backgroundColor.button,
        ':disabled': `color-mix(in srgb, white 50%, ${backgroundColor.button} 50%)`,
        ':enabled:hover': `color-mix(in srgb, black 5%, ${backgroundColor.button} 95%)`,
      },
    },
    flat: {
      [buttonVars.backgroundColor]: {
        default: 'transparent',
        ':disabled': 'rgba(255,255,255,0.5)',
        ':enabled:hover': 'rgba(0,0,0,0.05)',
      },
    },
  }),
  size: Button.variants.size,
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    [buttonVars.color]: {
      default: textColor.onLightMedia,
      ':disabled': `color-mix(in srgb, white 50%, ${textColor.subtle} 50%)`,
    },
  },
  selected: {
    [buttonVars.fill]: buttonVars.color,
    [buttonVars.color]: {
      default: semanticColor.accent,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.accent} 95%)`,
      ':disabled': `color-mix(in srgb, white 50%, ${semanticColor.accent} 50%)`,
    },
    [buttonVars.backgroundColor]: {
      default: 'oklch(66.6% 0.163 257.9 / 16%)',
      ':enabled:hover': 'oklch(66.6% 0.163 257.9 / 28%)',
    },
    [iconVars.fill]: buttonVars.color,
  },
});

const Toggle = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'button'>, Toggle.Props>(function Toggle(
      { pressed, defaultPressed, onPressedChange, xstyle, variants, label, loading, startContent, endContent, ...rest },
      ref,
    ) {
      return (
        <ToggleBase
          value=""
          ref={ref}
          pressed={pressed}
          defaultPressed={defaultPressed}
          onPressedChange={onPressedChange}
          {...rest}
          render={(props, toggleState) => {
            return (
              <Button
                {...props}
                label={label}
                loading={loading}
                startContent={({ variants: _, ...buttonState }) => {
                  const state: Toggle.State = {
                    ...buttonState,
                    variants,
                    pressed: toggleState.pressed,
                  };
                  return (
                    <IconContextProvider weight={state.pressed ? 'fill' : 'regular'}>
                      {bx.useRenderFunction(startContent, state)}
                    </IconContextProvider>
                  );
                }}
                endContent={({ variants: _, ...buttonState }) => {
                  const state: Toggle.State = {
                    ...buttonState,
                    variants,
                    pressed: toggleState.pressed,
                  };
                  return (
                    <IconContextProvider weight={state.pressed ? 'fill' : 'regular'}>
                      {bx.useRenderFunction(endContent, state)}
                    </IconContextProvider>
                  );
                }}
                variants={
                  variants?.size === undefined ? { appearance: undefined } : { size: variants.size, appearance: undefined }
                }
                xstyle={({ variants: _, ...buttonState }) => {
                  const state: Toggle.State = {
                    ...buttonState,
                    variants,
                    pressed: toggleState.pressed,
                  };

                  return [
                    baseStyles.base,
                    bx.useVariantStyle<Toggle.Variants>(variantStyles, variants, {
                      appearance: 'default',
                    }),
                    state.pressed && baseStyles.selected,
                    bx.useComponentStyleWithState<Toggle.State>(state, xstyle),
                  ];
                }}
              />
            );
          }}
          {...rest}
        />
      );
    }),
  ),
  {
    variants: variantStyles,
  },
);

namespace Toggle {
  export type Variants = bx.Variants<typeof variantStyles>;

  export interface State extends bx.VariantComponentState<Variants> {
    disabled: boolean;
    loading: boolean;
    pressed: boolean;
  }

  export interface Props extends Omit<bx.VariantComponentPropsWithState<'button', Variants, State>, 'value'> {
    label?: string;
    loading?: boolean;
    startContent?: bx.RenderFunction<State>;
    endContent?: bx.RenderFunction<State>;
    defaultPressed?: boolean;
    pressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  }
}

export default Toggle;
