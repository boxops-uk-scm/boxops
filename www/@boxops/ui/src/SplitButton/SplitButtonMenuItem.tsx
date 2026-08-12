import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';

const baseStyles = stylex.create({
  menuItem: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

const SplitButtonMenuItem = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'button'>, SplitButtonMenuItem.Props>(function SplitButtonMenuItem(
      { xstyle, ...props },
      ref,
    ) {
      return (
        <Button
          ref={ref}
          variants={{ appearance: 'flat' }}
          xstyle={xstyle ? [baseStyles.menuItem, xstyle] : baseStyles.menuItem}
          {...props}
        />
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace SplitButtonMenuItem {
  export interface Props extends Omit<Button.Props, 'variants' | 'xstyle'> {
    xstyle?: stylex.StyleXStyles;
  }
}

export default SplitButtonMenuItem;
