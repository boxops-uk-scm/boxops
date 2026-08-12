import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { dividerColor } from '../tokens.stylex';
import * as bx from '../types';

const variantStyles = {
  orientation: stylex.create({
    horizontal: { width: '100%', height: '1px' },
    vertical: { width: '1px', height: '100%' },
  }),
  color: stylex.create({
    subtle: { backgroundColor: dividerColor.subtle },
    strong: { backgroundColor: dividerColor.strong },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    border: 'none',
    flexShrink: 0,
    backgroundColor: dividerColor.subtle,
  },
});

const Divider = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Divider.Props>(function Divider({ xstyle, variants, ...rest }, ref) {
      const orientation = variants?.orientation ?? 'horizontal';
      const state: Divider.State = { variants };

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<Divider.Variants>(variantStyles, variants, { orientation: 'horizontal', color: 'subtle' }),
        bx.useComponentStyleWithState<Divider.State>(state, xstyle),
      ];

      return <div role="separator" aria-orientation={orientation} ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Divider {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export type Props = bx.VariantComponentPropsWithState<'div', Variants, State>;
}

export default Divider;
