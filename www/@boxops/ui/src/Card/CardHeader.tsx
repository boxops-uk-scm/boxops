import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { ButtonGroup } from '../ButtonGroup';
import { Heading } from '../Heading';
import { Text } from '../Text';
import { gap } from '../tokens.stylex';
import * as bx from '../types';

import type { Icon } from '../Icon';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: gap.XS,
  },
  title: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttons: {
    justifySelf: 'flex-end',
  },
});

const CardHeader = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, CardHeader.Props>(function CardHeader(
      { icon: iconRenderProp, title, subtitle, buttons, xstyle, ...rest },
      ref,
    ) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      const renderPros: Partial<Icon.Props> = {
        weight: 'regular',
        variants: { size: 'L' },
      };

      return (
        <div ref={ref} {...stylex.props(styles)} {...rest}>
          {iconRenderProp && bx.useRenderFunction(iconRenderProp, renderPros)}
          <div {...stylex.props(baseStyles.title)}>
            <Heading as="h3">{title}</Heading>
            {subtitle && (
              <Text as="small" variants={{ color: 'subtle' }}>
                {subtitle}
              </Text>
            )}
          </div>
          {buttons && (
            <div {...stylex.props(baseStyles.buttons)}>
              <ButtonGroup>{buttons}</ButtonGroup>
            </div>
          )}
        </div>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace CardHeader {
  export interface Props extends bx.ComponentProps<'div'> {
    title: string;
    subtitle?: string;
    icon?: bx.RenderFunction<Partial<Icon.Props>>;
    buttons?: React.ReactNode;
  }
}

export default CardHeader;
