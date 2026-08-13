import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { nonsemanticBackgroundColor } from '../tokens.stylex';
import * as bx from '../types';

const shimmer = stylex.keyframes({
  to: {
    backgroundPositionX: '-300%',
  },
});

// StyleX drops the `background` and `animation` shorthands, so both are spelled out as longhands —
// the shorthand form compiles away silently and leaves the glimmer invisible and unanimated.
const baseStyles = stylex.create({
  base: {
    backgroundImage: `linear-gradient(to right, ${nonsemanticBackgroundColor.blue} 0%, ${nonsemanticBackgroundColor.pink} 48%, ${nonsemanticBackgroundColor.pink} 52%, ${nonsemanticBackgroundColor.blue} 100%)`,
    backgroundSize: '300%',
    backgroundPositionX: '300%',
    animationName: shimmer,
    animationDuration: '4s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
});

const Glimmer = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'span'>, Glimmer.Props>(function Glimmer({ xstyle, ...rest }, ref) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      return <span aria-hidden ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Glimmer {
  export type Props = bx.ComponentProps<'span'>;
}

export default Glimmer;
