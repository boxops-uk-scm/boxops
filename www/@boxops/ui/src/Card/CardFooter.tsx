import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';
import { gap } from '../tokens.stylex';
import * as bx from '../types';

const variantStyles = {
  layout: stylex.create({
    default: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    stretch: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      ':not(#__unused__) > :only-child': {
        gridColumn: '1 / -1',
      },
    },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: gap.XS,
  },
  startContent: {
    marginRight: 'auto',
  },
});

const CardFooter = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, CardFooter.Props>(function CardFooter(
      {
        xstyle,
        variants,
        startContent: startContentRenderProp,
        primaryButton: primaryButtonRenderProp,
        secondaryButton: secondaryButtonRenderProp,
        ...rest
      },
      ref,
    ) {
      const state: CardFooter.State = { variants };

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<CardFooter.Variants>(variantStyles, variants, {
          layout: 'default',
        }),
        bx.useComponentStyleWithState<CardFooter.State>(state, xstyle),
      ];

      const startContent = bx.useRenderFunction(startContentRenderProp, state);

      const primaryButton = bx.useRenderFunction(primaryButtonRenderProp, {
        state,
        buttonProps: { variants: { appearance: 'primary', size: 'compact' } },
      });

      const secondaryButton = bx.useRenderFunction(secondaryButtonRenderProp, {
        state,
        buttonProps: { variants: { appearance: 'default', size: 'compact' } },
      });

      return (
        <div ref={ref} {...stylex.props(baseStyles.base)} {...rest}>
          {startContent && <div {...stylex.props(baseStyles.startContent)}>{startContent}</div>}
          <div {...stylex.props(styles)}>
            {secondaryButton}
            {primaryButton}
          </div>
        </div>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace CardFooter {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export interface Props extends bx.VariantComponentPropsWithState<'div', Variants, State> {
    primaryButton?: bx.RenderFunction<{ state: State; buttonProps: Partial<Button.Props> }>;
    secondaryButton?: bx.RenderFunction<{ state: State; buttonProps: Partial<Button.Props> }>;
    startContent?: bx.RenderFunction<State>;
  }
}

export default CardFooter;
