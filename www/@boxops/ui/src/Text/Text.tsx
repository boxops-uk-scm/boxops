import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { textColor } from '../tokens.stylex';
import * as bx from '../types';

import type { PolyRefFunction } from 'react-polymorphed';

const forwardRef = React.forwardRef as PolyRefFunction;

const variantStyles = {
  color: stylex.create({
    subtle: { color: textColor.subtle },
    onLightMedia: { color: textColor.onLightMedia },
    onDarkMedia: { color: textColor.onDarkMedia },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
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

const Text = Object.assign(
  React.memo(
    forwardRef<Text.Default, Text.BaseProps, Text.OnlyAs>(function Text({ as: As = 'span', xstyle, variants, ...rest }, ref) {
      const state: Text.State = { variants, as: As };

      const styles = [
        bx.usePolyComponentStyle<Text.Default, Text.State, Text.OnlyAs>(state, baseStyles.base, xstyle, (as) => {
          switch (as) {
            case 'b':
            case 'strong':
              return baseStyles.bold;
            case 'small':
              return baseStyles.small;
            case 'code':
              return baseStyles.code;
            case 'i':
            case 'em':
              return baseStyles.italic;
            case 'u':
              return baseStyles.underline;
            case 's':
            case 'del':
              return baseStyles.strikethrough;
            default:
              return undefined;
          }
        }),
        bx.useVariantStyle(variantStyles, variants),
      ];

      return <As ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Text {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantPolyComponentState<Variants>;

  export type BaseProps = bx.BaseVariantPolyComponentProps<Variants, State>;

  export type Default = 'span';

  export type OnlyAs = 'span' | 'p' | 'b' | 'strong' | 'small' | 'code' | 'i' | 'em' | 'u' | 's' | 'del';

  export type Props<E extends React.ElementType = Default> = bx.VariantPolyComponentProps<E, Variants, State, BaseProps>;
}

export default Text;
