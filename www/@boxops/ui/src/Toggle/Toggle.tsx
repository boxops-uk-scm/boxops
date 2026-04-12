import { Toggle as ToggleBase } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';
import { vars as buttonVars } from '../Button/vars.stylex';
import { vars as iconVars } from '../Icon/vars.stylex';
import { semanticColor } from '../tokens.stylex';
import * as bx from '../types';

import type { Icon } from '../Icon';

const variantStyles = {
  appearance: {
    default: Button.variants.appearance.default,
    flat: Button.variants.appearance.flat,
  },
  size: Button.variants.size,
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  selected: {
    [buttonVars.fill]: buttonVars.color,
    [buttonVars.color]: {
      default: semanticColor.accent,
      ':enabled:hover': `color-mix(in srgb, black 5%, ${semanticColor.accent} 95%)`,
      ':enabled:active': `color-mix(in srgb, black 10%, ${semanticColor.accent} 90%)`,
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
                startContent={(iconProps, { variants: _, ...buttonState }) => {
                  const state: Toggle.State = {
                    ...buttonState,
                    variants,
                    pressed: toggleState.pressed,
                  };
                  return bx.useRenderFunctionWithState(
                    startContent,
                    { ...iconProps, weight: state.pressed ? 'fill' : 'regular' },
                    state,
                  );
                }}
                endContent={(iconProps, { variants: _, ...buttonState }) => {
                  const state: Toggle.State = {
                    ...buttonState,
                    variants,
                    pressed: toggleState.pressed,
                  };
                  return bx.useRenderFunctionWithState(
                    endContent,
                    { ...iconProps, weight: state.pressed ? 'fill' : 'regular' },
                    state,
                  );
                }}
                variants={variants}
                xstyle={({ variants: _, ...buttonState }) => {
                  const state: Toggle.State = {
                    ...buttonState,
                    variants,
                    pressed: toggleState.pressed,
                  };
                  return [state.pressed && baseStyles.selected, bx.useComponentStyleWithState<Toggle.State>(state, xstyle)];
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
    startContent?: bx.RenderFunctionWithState<State, Partial<Icon.Props>>;
    endContent?: bx.RenderFunctionWithState<State, Partial<Icon.Props>>;
    defaultPressed?: boolean;
    pressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  }
}

export default Toggle;
