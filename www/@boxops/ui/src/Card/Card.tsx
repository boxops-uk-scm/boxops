import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { backgroundColor, gap, padding } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: backgroundColor.card,
    borderRadius: '12px',
    boxShadow: 'oklch(0% 0 0 / 20%) 0px 1px 6px 0px;',
    padding: padding.S,
    gap: gap.S,
  },
});

const Card = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Card.Props>(function Card({ xstyle, ...rest }, ref) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      return <div ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Card {
  export type Props = bx.ComponentProps<'div'>;
}

export default Card;
