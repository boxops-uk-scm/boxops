import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Card } from '../Card';
import { Flexbox } from '../Flexbox';
import { padding } from '../tokens.stylex';
import * as bx from '../types';

import Section from './Section/Section';

const baseStyles = stylex.create({
  base: {
    padding: padding.M,
    overflow: 'auto',
  },
  container: {
    minWidth: 'fit-content',
  },
});

/**
 * Every page in the app, grouped.
 *
 * The routes arrive as props. Both earlier versions read them from `@boxops/router` through a hook,
 * which tied the component to one router: it could not be rendered in a story, a test, or an app
 * that routes differently, and the *shape* it needed was buried in an import rather than stated in
 * its own types. A caller that has a router hands over what the hook used to return; a caller that
 * does not writes the array out. `SideNav` already takes its routes this way, and the two render
 * the same tree, so they describe it with the same words.
 */
const Sitemap = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Sitemap.Props>(function Sitemap(
      { routes, uncategorizedLabel = 'Uncategorized', onRoutePrefetch, onRouteSelect, xstyle, ...rest },
      ref,
    ) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      const visible = routes.filter((route) => !route.hideFromNav);
      const groups = visible.filter((route): route is Sitemap.GroupRoute => route.type === 'group');
      const loose = visible.filter((route): route is Sitemap.PageRoute => route.type === 'page');

      const handlers = { onRoutePrefetch, onRouteSelect };

      return (
        <Card ref={ref} xstyle={styles} {...rest}>
          <Flexbox variants={{ gap: 'M' }} xstyle={baseStyles.container}>
            {groups.map((group, index) => (
              <Section key={index} label={group.label} pages={group.children.filter((page) => !page.hideFromNav)} {...handlers} />
            ))}
            {/* Pages belonging to no group get one of their own, so the map is a row of sections
                whichever way the routes are arranged. */}
            {loose.length > 0 && <Section label={uncategorizedLabel} pages={loose} {...handlers} />}
          </Flexbox>
        </Card>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Sitemap {
  export type PageRoute = Section.PageRoute;

  export interface GroupRoute {
    type: 'group';
    label: React.ReactNode;
    children: readonly PageRoute[];
    hideFromNav?: boolean;
  }

  export type Route = PageRoute | GroupRoute;

  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    routes: readonly Route[];
    /** Heading for pages that belong to no group. */
    uncategorizedLabel?: React.ReactNode;
    /** Called on hover and focus, for a router that wants to warm a route before it is opened. */
    onRoutePrefetch?: (href: string) => void;
    /** Called on click. Take the event to `preventDefault` and route in-app. */
    onRouteSelect?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  }
}

export default Sitemap;
