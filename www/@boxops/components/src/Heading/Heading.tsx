import * as stylex from '@stylexjs/stylex';
import { type ElementType, forwardRef, memo } from 'react';

import { styles } from './styles';
import { variants } from './variants';

import type { PolyRefFunction } from 'react-polymorphed';

const polyRef = forwardRef as PolyRefFunction;

export interface Props {
  isContent?: boolean;
  xstyle?: stylex.StyleXStyles;
}

const Heading = polyRef<ElementType, Props>(({ as: As = 'h1', isContent = false, xstyle, ...rest }, ref) => {
  return <As ref={ref} {...rest} {...stylex.props(styles.base, styleForElementType(As, isContent), xstyle)} />;
});

function styleForElementType(as: ElementType, isContent: boolean): stylex.StyleXStyles {
  switch (as) {
    case 'h1':
      return [isContent ? variants.title : variants.h1];
    case 'h2':
      return [isContent ? variants.section : variants.h2];
    case 'h3':
      return [isContent ? variants.content : variants.h3];
    case 'h4':
      return [isContent ? variants.group : variants.h4];
    default:
      return [];
  }
}

Heading.displayName = 'Heading';

export default memo(Heading);
