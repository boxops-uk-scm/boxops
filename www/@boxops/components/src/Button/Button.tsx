import { forwardRef } from 'react';
import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './styles';

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  xstyle?: stylex.StyleXStyles;
}

export const Button = forwardRef<HTMLButtonElement, Props>(({ children, xstyle, ...rest }, ref) => {
  return (
    <button ref={ref} {...rest} {...stylex.props(styles.base, xstyle)}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
