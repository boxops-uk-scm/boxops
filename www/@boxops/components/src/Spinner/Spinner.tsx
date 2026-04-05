import * as stylex from '@stylexjs/stylex';
import { forwardRef, type HTMLAttributes } from 'react';

import Icon from '../Icon';

import OnDarkMedia from './OnDarkMedia';
import OnLightMedia from './OnLightMedia';
import { styles } from './styles';
import { variants } from './variants';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: Icon.Size;
  variant?: 'on-light-media' | 'on-dark-media' | 'accent';
  xstyle?: stylex.StyleXStyles;
}

const Spinner = forwardRef<HTMLDivElement, Props>(
  ({ size = 'M', xstyle, variant = 'on-light-media', ...props }: Props, ref) => {
    switch (variant) {
      case 'on-light-media':
      case 'accent':
        return (
          <Icon
            ref={ref}
            solid={OnLightMedia}
            outline={OnLightMedia}
            size={size}
            xstyle={[styles.base, variant === 'accent' && variants.accent, xstyle]}
            {...props}
          />
        );
      case 'on-dark-media':
        return (
          <Icon
            ref={ref}
            solid={OnDarkMedia}
            outline={OnDarkMedia}
            size={size}
            xstyle={[styles.base, xstyle]}
            {...props}
          />
        );
    }
  },
);

Spinner.displayName = 'Spinner';

export default Spinner;
