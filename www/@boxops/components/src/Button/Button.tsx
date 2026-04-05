import * as stylex from '@stylexjs/stylex';
import { forwardRef, type ReactNode } from 'react';
import React from 'react';

import Text from '../Text';

import { styles } from './styles';
import { variants } from './variants';

export interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label?: ReactNode;
  loading?: boolean;
  compact?: boolean;
  variant?: keyof typeof variants;
  xstyle?: stylex.StyleXStyles;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ label, disabled, loading, variant = 'default', compact, xstyle, ...rest }, ref) => {
    const onLightMedia = variant === 'default' || variant === 'flat';
    const labelStyle = loading ? styles.placeholder : styles.label;

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
        {(loading || label) &&
          (onLightMedia ? (
            <Text data-text={label} xstyle={labelStyle}>
              {label}
            </Text>
          ) : (
            <Text>
              <Text as="b" data-text={label} xstyle={labelStyle}>
                {label}
              </Text>
            </Text>
          ))}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
