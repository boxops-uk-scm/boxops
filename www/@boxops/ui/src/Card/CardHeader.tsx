import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Heading } from '../Heading';
import { Text } from '../Text';
import { gap } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: gap.S,
  },
  title: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  startContent: {
    justifySelf: 'flex-start',
  },
  endContent: {
    justifySelf: 'flex-end',
  },
});

const CardHeader = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, CardHeader.Props>(function CardHeader(
      { startContent, title, subtitle, endContent, xstyle, ...rest },
      ref,
    ) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      return (
        <div ref={ref} {...stylex.props(styles)} {...rest}>
          <div aria-hidden {...stylex.props(baseStyles.startContent)}>
            {startContent}
          </div>
          <div aria-hidden {...stylex.props(baseStyles.title)}>
            <Heading as="h3">{title}</Heading>
            {subtitle && (
              <Text as="small" variants={{ color: 'subtle' }}>
                {subtitle}
              </Text>
            )}
          </div>
          <div aria-hidden {...stylex.props(baseStyles.endContent)}>
            {endContent}
          </div>
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
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
  }
}

export default CardHeader;
