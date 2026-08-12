import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Heading } from '../Heading';
import { Text } from '../Text';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
});

const TextPair = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, TextPair.Props>(function TextPair(
      { variant = 'body', description, children, xstyle, ...rest },
      ref,
    ) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      const title =
        variant === 'body' ? <Text as="small">{children}</Text> : <Heading as={variant}>{children}</Heading>;

      const descriptionVariants = variant === 'h2' || variant === 'h3' ? undefined : ({ color: 'subtle' } as const);

      return (
        <div ref={ref} {...stylex.props(styles)} {...rest}>
          {title}
          <Text as="small" variants={descriptionVariants} xstyle={baseStyles.description}>
            {description}
          </Text>
        </div>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace TextPair {
  export type Variant = 'body' | 'h2' | 'h3' | 'h4';

  export interface Props extends bx.ComponentProps<'div'> {
    variant?: Variant;
    description?: string;
  }
}

export default TextPair;
