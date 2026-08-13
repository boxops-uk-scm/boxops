import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { fontFamily, textColor } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    // Declared rather than inherited: a `Link` outside a `Text` has nothing to inherit from and
    // would otherwise render in the UA's serif default. Size and weight stay inherited, so a link
    // nested inside a `Text` still matches the surrounding copy.
    fontFamily: fontFamily.body,
    color: textColor.link,
    cursor: 'pointer',
    textDecoration: {
      default: 'none',
      ':hover': 'underline',
    },
    textUnderlineOffset: '0.2em',
    textDecorationColor: 'currentColor',
  },
});

const Link = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'a'>, Link.Props>(function Link({ xstyle, ...rest }, ref) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      return <a ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Link {
  export interface Props extends bx.ComponentProps<'a'> {
    href: string;
  }
}

export default Link;
