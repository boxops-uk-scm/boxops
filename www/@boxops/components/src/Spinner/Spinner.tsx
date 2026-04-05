import * as stylex from '@stylexjs/stylex';
import { forwardRef, type SVGProps } from 'react';

import Icon from '../Icon';

import OnDarkMedia from './OnDarkMedia';
import OnLightMedia from './OnLightMedia';
import { styles } from './styles';
import { variants } from './variants';

export interface Props extends SVGProps<SVGSVGElement> {
  size?: Icon.Size;
  variant?: 'on-light-media' | 'on-dark-media' | 'accent';
  xstyle?: stylex.StyleXStyles;
}

const Spinner = forwardRef<SVGSVGElement, Props>(
  ({ size = 'M', xstyle, variant = 'on-light-media', ...props }: Props, ref) => {
    switch (variant) {
      case 'on-light-media':
      case 'accent':
        return (
          <OnLightMedia
            ref={ref}
            {...stylex.props(
              Icon.styles.base,
              Icon.variants.size[size],
              styles.base,
              variant === 'accent' && variants.accent,
              xstyle,
            )}
            {...props}
          />
        );
      case 'on-dark-media':
        return (
          <OnDarkMedia
            ref={ref}
            {...stylex.props(Icon.styles.base, Icon.variants.size[size], styles.base, xstyle)}
            {...props}
          />
        );
    }
  },
);

Spinner.displayName = 'Spinner';

export default Spinner;
