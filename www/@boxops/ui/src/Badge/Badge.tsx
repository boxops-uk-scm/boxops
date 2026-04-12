import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Text } from '../Text';
import { gap, nonsemanticBackgroundColor, nonsemanticTextColor } from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

const variantStyles = {
  color: stylex.create({
    gray: {
      [vars.color]: nonsemanticTextColor.gray,
      [vars.backgroundColor]: nonsemanticBackgroundColor.gray,
    },
    blue: {
      [vars.color]: nonsemanticTextColor.blue,
      [vars.backgroundColor]: nonsemanticBackgroundColor.blue,
    },
    green: {
      [vars.color]: nonsemanticTextColor.green,
      [vars.backgroundColor]: nonsemanticBackgroundColor.green,
    },
    yellow: {
      [vars.color]: nonsemanticTextColor.yellow,
      [vars.backgroundColor]: nonsemanticBackgroundColor.yellow,
    },
    orange: {
      [vars.color]: nonsemanticTextColor.orange,
      [vars.backgroundColor]: nonsemanticBackgroundColor.orange,
    },
    red: {
      [vars.color]: nonsemanticTextColor.red,
      [vars.backgroundColor]: nonsemanticBackgroundColor.red,
    },
    magenta: {
      [vars.color]: nonsemanticTextColor.pink,
      [vars.backgroundColor]: nonsemanticBackgroundColor.pink,
    },
    purple: {
      [vars.color]: nonsemanticTextColor.purple,
      [vars.backgroundColor]: nonsemanticBackgroundColor.purple,
    },
    teal: {
      [vars.color]: nonsemanticTextColor.teal,
      [vars.backgroundColor]: nonsemanticBackgroundColor.teal,
    },
    cyan: {
      [vars.color]: nonsemanticTextColor.cyan,
      [vars.backgroundColor]: nonsemanticBackgroundColor.cyan,
    },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: gap.XS,
    height: '20px',
    borderRadius: '10px',
    padding: `0 8px 0 8px`,
    minWidth: 'fit-content',
    flexGrow: 0,
    backgroundColor: vars.backgroundColor,
    fill: vars.fill,
  },
  label: {
    textBox: 'trim-both cap alphabetic',
    leadingTrim: 'both',
    textEdge: 'cap alphabetic',
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: -0.24,
    color: vars.color,
  },
  colored: {
    [vars.fill]: `oklch(from ${vars.backgroundColor} l c h / 100%)`,
  },
});

const Badge = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Badge.Props>(function Badge(
      { label, startContent: startContentRenderFunction, xstyle, variants, ...rest },
      ref,
    ) {
      const state: Badge.State = { variants };

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<Badge.Variants>(variantStyles, variants),
        variants?.color && baseStyles.colored,
        bx.useComponentStyleWithState<Badge.State>(state, xstyle),
      ];

      const startContent = bx.useRenderFunction(startContentRenderFunction, state);

      return (
        <div ref={ref} {...stylex.props(styles)} {...rest}>
          {startContent}
          <Text as="small" xstyle={[Text.styles.unselectable, baseStyles.label]}>
            {label}
          </Text>
        </div>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Badge {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export interface Props extends bx.VariantComponentPropsWithState<'div', Variants, State> {
    label?: string;
    startContent?: bx.RenderFunction<State>;
  }
}

export default Badge;
