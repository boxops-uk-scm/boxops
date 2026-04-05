import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';

import { styles } from './styles';
import { variants } from './variants';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  gap?: keyof typeof variants.gap;
  direction?: keyof typeof variants.direction;
  alignItems?: keyof typeof variants.alignItems;
  justifyContent?: keyof typeof variants.justifyContent;
  xstyle?: stylex.StyleXStyles;
}

const Flexbox = forwardRef<HTMLDivElement, Props>(
  ({ direction = 'row', alignItems = 'stretch', justifyContent = 'start', gap, children, xstyle, ...props }, ref) => (
    <div
      ref={ref}
      {...stylex.props(
        styles.base,
        direction && variants.direction[direction],
        alignItems && variants.alignItems[alignItems],
        justifyContent && variants.justifyContent[justifyContent],
        gap && variants.gap[gap],
        xstyle,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Flexbox.displayName = 'Flexbox';

export default Flexbox;
