import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { gap } from '../tokens.stylex';
import * as bx from '../types';

const variantStyles = {
  direction: stylex.create({
    row: { flexDirection: 'row' },
    column: { flexDirection: 'column' },
    rowReverse: { flexDirection: 'row-reverse' },
    columnReverse: { flexDirection: 'column-reverse' },
  }),
  alignItems: stylex.create({
    start: { alignItems: 'flex-start' },
    center: { alignItems: 'center' },
    end: { alignItems: 'flex-end' },
    baseline: { alignItems: 'baseline' },
    stretch: { alignItems: 'stretch' },
  }),
  justifyContent: stylex.create({
    start: { justifyContent: 'flex-start' },
    center: { justifyContent: 'center' },
    end: { justifyContent: 'flex-end' },
    spaceBetween: { justifyContent: 'space-between' },
    spaceEvenly: { justifyContent: 'space-evenly' },
    spaceAround: { justifyContent: 'space-around' },
  }),
  gap: stylex.create({
    XXS: { gap: gap.XXS },
    XS: { gap: gap.XS },
    S: { gap: gap.S },
    M: { gap: gap.M },
    L: { gap: gap.L },
    XL: { gap: gap.XL },
    XXL: { gap: gap.XXL },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    display: 'flex',
  },
});

const Flexbox = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Flexbox.Props>(function Flexbox({ xstyle, variants, ...rest }, ref) {
      const state: Flexbox.State = { variants };

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<Flexbox.Variants>(variantStyles, variants, {
          direction: 'row',
          alignItems: 'stretch',
          justifyContent: 'start',
        }),
        bx.useComponentStyleWithState<Flexbox.State>(state, xstyle),
      ];

      return <div ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Flexbox {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export type Props = bx.VariantComponentPropsWithState<'div', Variants, State>;
}

export default Flexbox;
