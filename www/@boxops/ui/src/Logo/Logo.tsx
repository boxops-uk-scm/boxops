import * as Phosphor from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Icon } from '../Icon';
import { vars as iconVars } from '../Icon/vars.stylex';
import { iconColor, semanticColor } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: {
      default: semanticColor.accent,
      ':hover': `color-mix(in srgb, black 5%, ${semanticColor.accent} 95%)`,
    },
    [iconVars.fill]: {
      default: iconColor.onDarkMedia,
      ':hover': `color-mix(in srgb, black 5%, ${iconColor.onDarkMedia} 95%)`,
    },
  },
});

const Logo = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Logo.Props>(function Logo({ icon, xstyle, ...rest }, ref) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      return (
        <div ref={ref} {...stylex.props(styles)} {...rest}>
          <Icon as={icon} weight="fill" />
        </div>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Logo {
  export interface Props extends bx.ComponentProps<'div'> {
    icon: React.FC<Phosphor.IconProps>;
  }
}

export default Logo;
