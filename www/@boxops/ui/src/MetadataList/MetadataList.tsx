import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Heading } from '../Heading';
import { Text } from '../Text';
import { gap } from '../tokens.stylex';
import * as bx from '../types';

const variantStyles = {
  size: stylex.create({
    default: {
      columnGap: gap.XL,
    },
    compact: {
      columnGap: gap.S,
    },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.S,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  grid: (columns: number) => ({
    display: 'grid',
    gridTemplateColumns: Array.from({ length: columns }, () => 'auto 1fr').join(' '),
    rowGap: gap.S,
    justifyItems: 'start',
  }),
});

const MetadataList = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, MetadataList.Props>(function MetadataList(
      { title, subtitle, xstyle, variants, children, columns = 2, ...rest },
      ref,
    ) {
      const state: MetadataList.State = { variants: { size: 'default', ...variants } };

      const styles = [baseStyles.base, bx.useComponentStyleWithState<MetadataList.State>(state, xstyle)];

      return (
        <div ref={ref} {...stylex.props(styles)} {...rest}>
          <div {...stylex.props(baseStyles.header)}>
            {title && (
              <Heading as="h4" isContent>
                {title}
              </Heading>
            )}
            {subtitle && (
              <Text as="small" variants={{ color: 'subtle' }}>
                {subtitle}
              </Text>
            )}
          </div>
          <div
            {...stylex.props(baseStyles.grid(columns), bx.useVariantStyle<MetadataList.Variants>(variantStyles, state.variants))}
          >
            {children}
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

namespace MetadataList {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export interface Props extends Omit<bx.VariantComponentPropsWithState<'div', Variants, State>, 'title'> {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    columns?: number;
  }
}

export default MetadataList;
