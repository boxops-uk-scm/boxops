import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Card } from '../Card';
import { backgroundColor, semanticColor } from '../tokens.stylex';
import * as bx from '../types';

const variantStyles = {
  status: stylex.create({
    success: { backgroundColor: semanticColor.positive },
    warning: { backgroundColor: semanticColor.warning },
    error: { backgroundColor: semanticColor.negative },
    info: { backgroundColor: semanticColor.accent },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    width: '300px',
    height: '150px',
    padding: '0px',
  },
  content: {
    backgroundColor: backgroundColor.card,
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    marginLeft: '12px',
    height: '100%',
  },
});

const Toast = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Toast.Props>(function Toast({ xstyle, variants, children, ...rest }, ref) {
      const state: Toast.State = { variants };

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<Toast.Variants>(variantStyles, variants),
        bx.useComponentStyleWithState<Toast.State>(state, xstyle),
      ];

      return (
        <Card role="status" aria-live="polite" ref={ref} xstyle={styles} {...rest}>
          <div {...stylex.props(baseStyles.content)}>{children}</div>
        </Card>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Toast {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export type Props = bx.VariantComponentPropsWithState<'div', Variants, State>;
}

export default Toast;
