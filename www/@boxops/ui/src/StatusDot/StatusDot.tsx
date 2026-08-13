import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { backgroundColor, iconColor, semanticColor } from '../tokens.stylex';
import * as bx from '../types';

const variantStyles = {
  status: stylex.create({
    neutral: { backgroundColor: iconColor.secondary },
    info: { backgroundColor: semanticColor.accent },
    success: { backgroundColor: semanticColor.positive },
    error: { backgroundColor: semanticColor.negative },
    warning: { backgroundColor: semanticColor.warning },
  }),
  size: stylex.create({
    S: { width: '8px', height: '8px', borderWidth: '2px' },
    M: { width: '12px', height: '12px', borderWidth: '2px' },
    L: { width: '16px', height: '16px', borderWidth: '3px' },
    XL: { width: '28px', height: '28px', borderWidth: '4px' },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    backgroundColor: iconColor.secondary,
    borderRadius: '50%',
    borderColor: backgroundColor.input,
    borderStyle: 'solid',
  },
});

const StatusDot = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, StatusDot.Props>(function StatusDot({ xstyle, variants, ...rest }, ref) {
      const state: StatusDot.State = { variants };

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<StatusDot.Variants>(variantStyles, variants, { size: 'M', status: 'neutral' }),
        bx.useComponentStyleWithState<StatusDot.State>(state, xstyle),
      ];

      return <div aria-hidden ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace StatusDot {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export type Props = bx.VariantComponentPropsWithState<'div', Variants, State>;
}

export default StatusDot;
