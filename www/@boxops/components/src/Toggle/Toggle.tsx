import { Toggle as ToggleBase, type ToggleState } from '@base-ui/react';
import { forwardRef } from 'react';

import Button from '../Button';

import { styles } from './styles';
import { variants } from './variants';

import type Icon from '../Icon';

export interface StateProps {
  defaultPressed?: boolean;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export interface ButtonProps extends Button.Props {
  label?: string;
  variant?: keyof typeof variants;
  value: string;
}

export interface Props extends ButtonProps, StateProps {
  overrideRenderProps?: (
    props: Props,
    state: ToggleState,
    defaultRenderProps: (state: ToggleState) => Partial<Button.Props>,
  ) => Partial<Button.Props>;
  overrideIconRenderProps?: (
    props: Props,
    state: ToggleState,
    defaultIconRenderProps: (state: ToggleState) => Partial<Icon.Props>,
  ) => Icon.Props;
}

export const Toggle = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    label,
    'aria-label': ariaLabel,
    disabled,
    loading,
    variant = 'default',
    compact,
    xstyle,
    startContent,
    value,
    defaultPressed,
    endContent,
    overrideRenderProps,
    overrideIconRenderProps,
    ...rest
  } = props;

  const onLightMedia = variant === 'default' || variant === 'flat';

  return (
    <ToggleBase
      defaultPressed={defaultPressed}
      value={value}
      aria-label={ariaLabel ?? label}
      ref={ref}
      disabled={disabled || loading}
      render={(renderProps, state) => {
        function defaultIconRenderProps(renderState: ToggleState): Partial<Icon.Props> {
          return {
            variant: renderState.pressed ? 'solid' : 'outline',
          };
        }

        const iconRenderProps = overrideIconRenderProps
          ? overrideIconRenderProps(props, state, defaultIconRenderProps)
          : defaultIconRenderProps(state);

        const baseProps = {
          ...renderProps,
          ...rest,
        };

        function defaultRenderProps(renderState: ToggleState): Partial<Button.Props> {
          return {
            label: label,
            startContent: typeof startContent === 'function' ? startContent(iconRenderProps) : startContent,
            endContent: typeof endContent === 'function' ? endContent(iconRenderProps) : endContent,
            loading,
            xstyle: [
              styles.base,
              variants[variant],
              onLightMedia && styles.onLightMedia,
              compact && styles.compact,
              renderState.pressed && styles.selected,
              xstyle,
            ],
          };
        }

        const combinedButtonProps = {
          ...baseProps,
          ...(overrideRenderProps?.(props, state, defaultRenderProps) ?? defaultRenderProps(state)),
        };

        return <Button {...combinedButtonProps} />;
      }}
    />
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;
