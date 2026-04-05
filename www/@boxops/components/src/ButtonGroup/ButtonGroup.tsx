import * as stylex from '@stylexjs/stylex';
import React from 'react';

import Flexbox from '../Flexbox';

import { styles } from './styles';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  xstyle?: stylex.StyleXStyles;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, Props>(({ xstyle, ...props }: Props, ref) => {
  if (Array.isArray(props.children)) {
    const children = React.Children.toArray(props.children);

    switch (children.length) {
      case 0: {
        return <Flexbox ref={ref} xstyle={xstyle} />;
      }
      case 1: {
        return (
          <Flexbox ref={ref} xstyle={xstyle}>
            {children}
          </Flexbox>
        );
      }
      case 2: {
        const [start, end] = children;
        return (
          <Flexbox gap="XXS" ref={ref} xstyle={xstyle}>
            <div {...stylex.props(styles.wrapper, styles.start)} key={0}>
              {start}
            </div>
            <div {...stylex.props(styles.wrapper, styles.end)} key={1}>
              {end}
            </div>
          </Flexbox>
        );
      }
      default: {
        const start = children[0];
        const middle = children.slice(1, children.length - 1);
        const end = children[children.length - 1];
        return (
          <Flexbox gap="XXS" ref={ref} xstyle={xstyle}>
            <div {...stylex.props(styles.wrapper, styles.start)} key={0}>
              {start}
            </div>
            {middle.map((child, i) => (
              <div {...stylex.props(styles.wrapper, styles.middle)} key={i + 1}>
                {child}
              </div>
            ))}
            <div {...stylex.props(styles.wrapper, styles.end)} key={children.length - 1}>
              {end}
            </div>
          </Flexbox>
        );
      }
    }
  }

  return (
    <Flexbox ref={ref} xstyle={xstyle}>
      {props.children}
    </Flexbox>
  );
});

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
