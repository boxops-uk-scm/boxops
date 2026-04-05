import { Button as ButtonBase } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';
import React from 'react';

import Spinner from '../Spinner';
import Text from '../Text';

import { styles } from './styles';
import { variants } from './variants';

import type Icon from '../Icon';

export interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label?: string;
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
  (
    {
      label,
      'aria-label': ariaLabel,
      disabled,
      loading,
      variant = 'default',
      compact,
      xstyle,
      startContent,
      endContent,
      ...rest
    },
    ref,
  ) => {
    const onLightMedia = variant === 'default' || variant === 'flat';
    const labelStyle = loading ? styles.placeholder : styles.label;
    const iconProps: Partial<Icon.Props> = {
      variant: onLightMedia ? 'outline' : 'solid',
    };

    return (
      <ButtonBase
        aria-label={ariaLabel ?? label}
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
        {(loading || label) && (
          <>
            {!loading && (
              <Text data-text={label} xstyle={labelStyle}>
                {onLightMedia ? label : <Text as="b">{label}</Text>}
              </Text>
            )}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text data-text={label} xstyle={labelStyle} />
                <Spinner />
              </div>
            )}
          </>
        )}
        {typeof endContent === 'function' ? endContent({ iconProps }) : endContent}
      </ButtonBase>
    );
  },
);

Button.displayName = 'Button';

export default Button;
