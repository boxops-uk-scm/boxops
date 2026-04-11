import * as Phosphor from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { iconColor } from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

const variantStyles = {
  size: stylex.create({
    inline: {
      width: '0.8em',
      height: '0.8em',
    },
    S: {
      width: '16px',
      height: '16px',
    },
    M: {
      width: '20px',
      height: '20px',
    },
    L: {
      width: '24px',
      height: '24px',
    },
    XL: {
      width: '32px',
      height: '32px',
    },
    XXL: {
      width: '48px',
      height: '48px',
    },
  }),
  color: stylex.create({
    onLightMedia: { color: iconColor.onLightMedia },
    onDarkMedia: { color: iconColor.onDarkMedia },
    secondary: { color: iconColor.secondary },
    disabled: { color: iconColor.disabled },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    color: vars.fill,
    display: 'flex',
    width: 'fit-content',
    height: 'fit-content',
    alignSelf: 'center',
    justifySelf: 'center',
  },
});

const Icon = Object.assign(
  React.memo(
    React.forwardRef<SVGSVGElement, Icon.Props>(function Icon({ as: As, alt, weight = 'light', xstyle, variants, ...rest }, ref) {
      const state: Icon.State = { variants, weight };

      const styles = [
        bx.useVariantStyle<Icon.Variants>(variantStyles, variants, {
          size: 'M',
        }),
        bx.useComponentStyleWithState<Icon.State>(state, xstyle),
      ];

      return (
        <div aria-hidden {...stylex.props(baseStyles.base)}>
          <As alt={alt} ref={ref} weight={weight} {...stylex.props(styles)} {...rest} />
        </div>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Icon {
  export type Variants = bx.Variants<typeof variantStyles>;

  export interface State extends bx.VariantComponentState<Variants> {
    weight: Phosphor.IconWeight;
  }

  export interface Props extends bx.VariantComponentPropsWithState<'svg', Variants, State> {
    as: React.FC<Phosphor.IconProps>;
    weight?: Phosphor.IconWeight;
    alt?: string;
  }
}

export default Icon;
