import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';

import { styles } from './styles';
import { variants } from './variants';

import type React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof variants.size;
  variant?: Variant;
  xstyle?: stylex.StyleXStyles;
}

interface InternalProps {
  outline: React.FC<React.SVGProps<SVGSVGElement>>;
  solid: React.FC<React.SVGProps<SVGSVGElement>>;
}

const Icon = forwardRef<HTMLDivElement, Props & InternalProps>(
  ({ variant = 'outline', size = 'M', xstyle, outline: Outline, solid: Solid, ...props }, ref) => {
    switch (variant) {
      case 'outline':
        return (
          <div ref={ref} {...props} {...stylex.props(styles.container)}>
            <Outline {...stylex.props(styles.base, size && variants.size[size], xstyle)} />
          </div>
        );
      case 'solid':
        return (
          <div ref={ref} {...props} {...stylex.props(styles.container)}>
            <Solid {...stylex.props(styles.base, size && variants.size[size], xstyle)} />
          </div>
        );
    }
  },
);

Icon.displayName = 'Icon';

export default Icon;

export type Size = keyof typeof variants.size;
export type Variant = 'outline' | 'solid';
