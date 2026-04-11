import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Icon } from '../Icon';
import { semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

import SvgOnDarkMedia from './OnDarkMedia';
import SvgOnLightMedia from './OnLightMedia';
import { vars } from './vars.stylex';

const variantStyles = {
  color: stylex.create({
    onLightMedia: {
      [vars.fill]: semanticColor.accent,
    },
    onDarkMedia: {
      [vars.fill]: textColor.onDarkMedia,
    },
  }),
  size: Icon.variants.size,
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    fill: vars.fill,
  },
});

const Spinner = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Spinner.Props>(function Spinner({ xstyle, variants, ...rest }, ref) {
      const state: Spinner.State = { variants };

      const style = [
        Icon.styles.base,
        baseStyles.base,
        bx.useVariantStyle<Spinner.Variants>(variantStyles, variants, {
          size: 'M',
        }),
        bx.useComponentStyleWithState<Spinner.State>(state, xstyle),
      ];

      return (
        <div ref={ref} {...stylex.props(style)} {...rest}>
          {variants?.color === 'onDarkMedia' ? <SvgOnDarkMedia /> : <SvgOnLightMedia />}
        </div>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: Icon.styles,
  },
);

namespace Spinner {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export type Props = bx.VariantComponentPropsWithState<'div', Variants, State>;
}

export default Spinner;
