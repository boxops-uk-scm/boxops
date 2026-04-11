import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { vars as buttonVars } from '../Button/vars.stylex';
import { gap } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'row',
    gap: gap.XXS,
  },
  wrapper: {
    display: 'contents',
  },
  start: {
    [buttonVars.borderRadiusRight]: '0px',
  },
  middle: {
    [buttonVars.borderRadiusRight]: '0px',
    [buttonVars.borderRadiusLeft]: '0px',
  },
  end: {
    [buttonVars.borderRadiusLeft]: '0px',
  },
});

const Component = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Component.Props>(function Component({ xstyle, children, ...rest }, ref) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      if (Array.isArray(children)) {
        const childrenArray = React.Children.toArray(children);

        switch (childrenArray.length) {
          case 0: {
            return <div {...stylex.props(styles)} ref={ref} />;
          }
          case 1: {
            return (
              <div {...stylex.props(styles)} ref={ref}>
                {childrenArray}
              </div>
            );
          }
          case 2: {
            const [start, end] = childrenArray;
            return (
              <div {...stylex.props(styles)} ref={ref}>
                <div {...stylex.props(baseStyles.wrapper, baseStyles.start)} key={0}>
                  {start}
                </div>
                <div {...stylex.props(baseStyles.wrapper, baseStyles.end)} key={1}>
                  {end}
                </div>
              </div>
            );
          }
          default: {
            const start = childrenArray[0];
            const middle = childrenArray.slice(1, childrenArray.length - 1);
            const end = childrenArray[childrenArray.length - 1];
            return (
              <div {...stylex.props(styles)} ref={ref}>
                <div {...stylex.props(baseStyles.wrapper, baseStyles.start)} key={0}>
                  {start}
                </div>
                {middle.map((child, i) => (
                  <div {...stylex.props(baseStyles.wrapper, baseStyles.middle)} key={i + 1}>
                    {child}
                  </div>
                ))}
                <div {...stylex.props(baseStyles.wrapper, baseStyles.end)} key={childrenArray.length - 1}>
                  {end}
                </div>
              </div>
            );
          }
        }
      }

      return <div ref={ref} {...stylex.props(styles)} {...rest}></div>;
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Component {
  export type Props = bx.ComponentProps<'div'>;
}

export default Component;
