import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Flexbox } from '../Flexbox';
import { Text } from '../Text';
import { borderRadius, padding, semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    paddingLeft: padding.S,
    paddingRight: padding.S,
    paddingTop: padding.XS,
    paddingBottom: padding.XS,
    borderRadius: borderRadius.button,
    backgroundColor: {
      default: 'transparent',
      // Toward the foreground ink rather than literal black, so it darkens on a light ground and
      // lightens on a dark one instead of disappearing.
      ':hover': `oklch(from ${textColor.primary} l c h / 5%)`,
    },
  },
  selected: {
    color: semanticColor.accent,
    fill: semanticColor.accent,
    backgroundColor: {
      default: semanticColor.accentSelected,
      ':hover': semanticColor.accentSelectedHover,
    },
  },
  spacer: {
    flexGrow: 1,
  },
});

const Item = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Item.Props>(function Item(
      { label, description, isSelected, startContent, endContent, xstyle, ...rest },
      ref,
    ) {
      const state: Item.State = { isSelected: !!isSelected };

      const styles = [
        baseStyles.base,
        isSelected && baseStyles.selected,
        bx.useComponentStyleWithState<Item.State>(state, xstyle),
      ];

      return (
        <Flexbox ref={ref} variants={{ alignItems: 'center', gap: 'S' }} xstyle={styles} {...rest}>
          {bx.useRenderFunction(startContent, state)}
          <Flexbox variants={{ direction: 'column' }}>
            {/* No colour variant: the label inherits the row's ink, which is the accent when
                selected and the inherited body ink otherwise. */}
            <Text xstyle={Text.styles.unselectable}>{label}</Text>
            {description && (
              <Text
                as="small"
                variants={isSelected ? undefined : { color: 'subtle' }}
                xstyle={Text.styles.unselectable}
              >
                {description}
              </Text>
            )}
          </Flexbox>
          {endContent && (
            <>
              <span {...stylex.props(baseStyles.spacer)} />
              {bx.useRenderFunction(endContent, state)}
            </>
          )}
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Item {
  export interface State {
    isSelected: boolean;
  }

  export interface Props extends Omit<bx.ComponentPropsWithState<'div', State>, 'children'> {
    label: React.ReactNode;
    description?: React.ReactNode;
    isSelected?: boolean;
    startContent?: bx.RenderFunction<State>;
    endContent?: bx.RenderFunction<State>;
  }
}

export default Item;
