import * as stylex from '@stylexjs/stylex';
import React from 'react';

import { usePolyComponentStyles } from '../hooks';
import { textColor } from '../tokens.stylex';

import type { PolyBaseProps, PolyComponentProps, PolyComponentState, VariantDefs } from '../types';
import type { PolyRefFunction } from 'react-polymorphed';

const polyRef = React.forwardRef as PolyRefFunction;

const variants = {
  color: stylex.create({
    subtle: { color: textColor.subtle },
    onLightMedia: { color: textColor.onLightMedia },
    onDarkMedia: { color: textColor.onDarkMedia },
  }),
} as const satisfies VariantDefs;

const styles = stylex.create({
  base: {
    fontFamily: "'Open Sans', sans-serif",
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textSizeAdjust: 'none',
    fontOpticalSizing: 'auto',
    fontVariationSettings: "'wdth' 100",
    marginTop: 0,
    marginBlockEnd: 0,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0px',
    fontWeight: 'normal',
  },
  bold: {
    fontWeight: 'bold',
    letterSpacing: '-0.24px',
  },
  small: {
    fontSize: '14px',
    lineHeight: '20px',
  },
  code: {
    fontFamily: '"Noto Sans Mono", monospace',
  },
  unselectable: {
    userSelect: 'none',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecoration: 'underline',
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
});

type Default = 'span';

type OnlyAs = 'span' | 'p' | 'b' | 'strong' | 'small' | 'code' | 'i' | 'em' | 'u' | 's' | 'del';

type OwnProps = Record<never, never>;

type ExtraState = Record<never, never>;

type Props = PolyBaseProps<typeof variants, ExtraState, OwnProps, OnlyAs>;

const Text = Object.assign(
  React.memo(
    polyRef<Default, Props, OnlyAs>(function Text({ as: As = 'span', variantSelection = {}, xstyle, ...rest }, ref) {
      const state: PolyComponentState<typeof variants, ExtraState> = {
        as: As,
        variantSelection,
      };

      let elementStyle: stylex.StyleXStyles = undefined;
      switch (As) {
        case 'b':
        case 'strong':
          elementStyle = styles.bold;
          break;
        case 'small':
          elementStyle = styles.small;
          break;
        case 'code':
          elementStyle = styles.code;
          break;
        case 'i':
        case 'em':
          elementStyle = styles.italic;
          break;
        case 'u':
          elementStyle = styles.underline;
          break;
        case 's':
        case 'del':
          elementStyle = styles.strikethrough;
          break;
      }

      const userStyle = usePolyComponentStyles<typeof variants, ExtraState>(variants, state, xstyle);

      return <As ref={ref} {...rest} {...stylex.props(styles.base, elementStyle, userStyle)} />;
    }),
  ),
  {
    styles,
    variants,
  },
);

namespace Text {
  export type Props = PolyComponentProps<'span', typeof variants, ExtraState, OwnProps, OnlyAs>;
  export type State = PolyComponentState<typeof variants, ExtraState>;
  export type VariantAxis = keyof typeof variants;
  export type Variant<Axis extends VariantAxis> = keyof (typeof variants)[Axis];
}

export default Text;
