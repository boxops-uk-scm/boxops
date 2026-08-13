import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Flexbox } from '../../Flexbox';
import { Heading } from '../../Heading';
import { gap } from '../../tokens.stylex';
import * as bx from '../../types';
import Item from '../Item/Item';

const baseStyles = stylex.create({
  // Columns fill top-to-bottom to a fixed height, then wrap — so a section of thirty pages becomes
  // four readable columns rather than one long ribbon.
  items: {
    display: 'grid',
    gridTemplateRows: 'repeat(8, auto)',
    gridAutoFlow: 'column',
    gap: gap.M,
  },
});

const Section = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Section.Props>(function Section(
      { label, pages, onRoutePrefetch, onRouteSelect, xstyle, ...rest },
      ref,
    ) {
      return (
        <Flexbox ref={ref} variants={{ direction: 'column', gap: 'S' }} xstyle={xstyle} {...rest}>
          {/* `h2`, where v1 and v2 both used `h1`. A sitemap sits inside a page that already has a
              title, so a heading per group made every section claim to be the page's own. */}
          <Heading as="h2">{label}</Heading>
          <div {...stylex.props(baseStyles.items)}>
            {pages.map((page) => (
              <Item
                key={page.href}
                title={page.title}
                href={page.href}
                description={page.description}
                onPrefetch={onRoutePrefetch && (() => onRoutePrefetch(page.href))}
                onSelect={onRouteSelect && ((event) => onRouteSelect(page.href, event))}
              />
            ))}
          </div>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Section {
  export interface PageRoute {
    type: 'page';
    /** Where the entry points. A string, so the map has no opinion about routing. */
    href: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    hideFromNav?: boolean;
  }

  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    label: React.ReactNode;
    pages: readonly PageRoute[];
    onRoutePrefetch?: (href: string) => void;
    onRouteSelect?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  }
}

export default Section;
