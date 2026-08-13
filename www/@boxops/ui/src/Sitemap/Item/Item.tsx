import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Flexbox } from '../../Flexbox';
import { Heading } from '../../Heading';
import { Link } from '../../Link';
import { Text } from '../../Text';
import * as bx from '../../types';

const baseStyles = stylex.create({
  base: {
    width: '250px',
  },
});

/**
 * One page in the map: its title, linked, and whatever the route says it is for.
 *
 * A real anchor, unlike the v2 original — that rendered a `Heading` wearing `Link`'s styles with a
 * click handler attached, which looks like a link but cannot be opened in a new tab, focused by
 * keyboard, or read as a link by a screen reader. The heading stays for the document outline and
 * the anchor sits inside it.
 */
const Item = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Item.Props>(function Item(
      { title, href, description, onPrefetch, onSelect, xstyle, ...rest },
      ref,
    ) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      return (
        <Flexbox ref={ref} variants={{ direction: 'column' }} xstyle={styles} {...rest}>
          <Heading as="h4">
            <Link href={href} onMouseEnter={onPrefetch} onFocus={onPrefetch} onClick={onSelect}>
              {title}
            </Link>
          </Heading>
          {description && (
            <Text as="small" variants={{ color: 'subtle' }}>
              {description}
            </Text>
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
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'title' | 'onSelect'> {
    title: React.ReactNode;
    href: string;
    description?: React.ReactNode;
    onPrefetch?: React.FocusEventHandler & React.MouseEventHandler;
    onSelect?: React.MouseEventHandler<HTMLAnchorElement>;
  }
}

export default Item;
