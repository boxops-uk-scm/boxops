import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  clamp: (lines: number) => ({
    WebkitLineClamp: lines,
  }),
});

const LineClamp = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, LineClamp.Props>(function LineClamp({ xstyle, lines = 1, ...rest }, ref) {
      const state: LineClamp.State = { lines };

      const styles = [
        baseStyles.base,
        baseStyles.clamp(lines),
        bx.useComponentStyleWithState<LineClamp.State>(state, xstyle),
      ];

      return <div ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace LineClamp {
  export interface State {
    lines: number;
  }

  export interface Props extends bx.ComponentPropsWithState<'div', State> {
    /** Maximum number of lines to display before truncating with an ellipsis. */
    lines?: number;
  }
}

export default LineClamp;
