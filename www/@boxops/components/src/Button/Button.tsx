import * as stylex from '@stylexjs/stylex';
import { forwardRef, type ReactNode } from 'react';
import React from 'react';

import Spinner from '../Spinner';
import Text from '../Text';

import { styles } from './styles';
import { variants } from './variants';

import type Icon from '../Icon';

export interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label?: ReactNode;
  loading?: boolean;
  compact?: boolean;
  variant?: keyof typeof variants;
  xstyle?: stylex.StyleXStyles;
  startContent?: React.ReactNode | ((props: RenderProps) => React.ReactNode);
  endContent?: React.ReactNode | ((props: RenderProps) => React.ReactNode);
}

export interface RenderProps {
  iconProps: Partial<Icon.Props>;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ label, disabled, loading, variant = 'default', compact, xstyle, startContent, endContent, ...rest }, ref) => {
    const onLightMedia = variant === 'default' || variant === 'flat';
    const labelStyle = loading ? styles.placeholder : styles.label;
    const iconProps: Partial<Icon.Props> = {
      variant: onLightMedia ? 'outline' : 'solid',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        {...rest}
        {...stylex.props(
          styles.base,
          variants[variant],
          onLightMedia && styles.onLightMedia,
          compact && styles.compact,
          xstyle,
        )}
      >
        {typeof startContent === 'function' ? startContent({ iconProps }) : startContent}
        {(loading || label) &&
          (onLightMedia ? (
            <Text data-text={label} xstyle={labelStyle}>
              {loading ? <Spinner /> : label}
            </Text>
          ) : (
            <Text>
              <Text as="b" data-text={label} xstyle={labelStyle}>
                {loading ? <Spinner /> : label}
              </Text>
            </Text>
          ))}
        {typeof endContent === 'function' ? endContent({ iconProps }) : endContent}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
