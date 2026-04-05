import * as stylex from '@stylexjs/stylex';
import { type ElementType, forwardRef, memo } from 'react';

import { styles } from './styles';
import { variants } from './variants';

import type { PolyRefFunction } from 'react-polymorphed';

const polyRef = forwardRef as PolyRefFunction;

export interface Props {
  xstyle?: stylex.StyleXStyles;
  variant?: keyof typeof variants;
}

const Text = polyRef<ElementType, Props>(({ as: As = 'span', variant, xstyle, ...rest }, ref) => {
  return (
    <As
      ref={ref}
      {...rest}
      {...stylex.props(styles.base, styleForElementType(As), variant && variants[variant], xstyle)}
    />
  );
});

function styleForElementType(as: ElementType): stylex.StyleXStyles {
  switch (as) {
    case 'b':
    case 'strong':
      return styles.bold;
    case 'small':
      return styles.small;
    case 'code':
      return styles.code;
    case 'i':
    case 'em':
      return styles.italic;
    case 'u':
      return styles.underline;
    case 's':
    case 'del':
      return styles.strikethrough;
    default:
      return styles.body;
  }
}

Text.displayName = 'Text';

export default memo(Text);
