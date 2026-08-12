import * as React from 'react';

import { Flexbox } from '../Flexbox';

/**
 * A vertical stack. Thin wrapper over `Flexbox` with the direction fixed, which is what the v2
 * source was — kept as its own component so `List.Item` has an obvious home.
 */
const List = React.memo(
  React.forwardRef<React.ComponentRef<'div'>, List.Props>(function List({ variants, ...rest }, ref) {
    return <Flexbox ref={ref} variants={{ ...variants, direction: 'column' }} {...rest} />;
  }),
);

namespace List {
  export type Variants = Omit<Flexbox.Variants, 'direction'>;

  export type Props = Omit<Flexbox.Props, 'variants'> & {
    variants?: Variants;
  };
}

export default List;
