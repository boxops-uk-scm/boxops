import { PreviewCard } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Flexbox } from '../Flexbox';
import { Heading } from '../Heading';
import { usePortalContainer } from '../PortalContainer';
import { Text } from '../Text';
import { backgroundColor, gap, padding } from '../tokens.stylex';
import * as bx from '../types';

import Item from './Item';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.XL,
    backgroundColor: backgroundColor.card,
    borderWidth: '0px',
    borderRightWidth: '2px',
    borderStyle: 'solid',
    borderColor: backgroundColor.secondary,
    position: 'sticky',
    top: 0,
    paddingLeft: padding.S,
    paddingRight: padding.S,
  },
  header: {
    paddingTop: padding.L,
  },
  trigger: {
    display: 'inline-flex',
  },
  unselectable: {
    userSelect: 'none',
  },
  // Stacking belongs on the Positioner — the Popup is `position: static`, so a z-index there is inert.
  positioner: {
    zIndex: 100,
  },
  routes: {
    overflowY: 'auto',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  group: {
    listStyle: 'none',
    paddingTop: padding.M,
    paddingBottom: padding.M,
  },
  groupRoutes: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  heading: {
    paddingBottom: padding.S,
  },
});

const SideNav = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'nav'>, SideNav.Props>(function SideNav(
      { routes, selectedPath, heading, subheading, media, overview, onRoutePrefetch, onRouteSelect, xstyle, ...rest },
      ref,
    ) {
      const portalContainer = usePortalContainer();

      const renderItem = (route: SideNav.PageRoute, key: React.Key) => (
        <Item
          key={key}
          label={route.title}
          isSelected={route.path === selectedPath}
          onPrefetch={onRoutePrefetch && (() => onRoutePrefetch(route.path))}
          onSelect={onRouteSelect && (() => onRouteSelect(route.path))}
        />
      );

      return (
        <nav ref={ref} {...stylex.props(baseStyles.base, xstyle)} {...rest}>
          {(media || heading || subheading) && (
            <Flexbox variants={{ direction: 'column', alignItems: 'center' }} xstyle={baseStyles.header}>
              {media &&
                (overview ? (
                  <PreviewCard.Root>
                    <PreviewCard.Trigger render={<span {...stylex.props(baseStyles.trigger)} />}>{media}</PreviewCard.Trigger>
                    <PreviewCard.Portal container={portalContainer}>
                      <PreviewCard.Positioner side="top" sideOffset={5} {...stylex.props(baseStyles.positioner)}>
                        <PreviewCard.Popup>{overview}</PreviewCard.Popup>
                      </PreviewCard.Positioner>
                    </PreviewCard.Portal>
                  </PreviewCard.Root>
                ) : (
                  media
                ))}
              {heading && (
                <Heading as="h1" xstyle={baseStyles.unselectable}>
                  {heading}
                </Heading>
              )}
              {subheading && (
                <Text as="small" variants={{ color: 'subtle' }} xstyle={baseStyles.unselectable}>
                  {subheading}
                </Text>
              )}
            </Flexbox>
          )}
          <ul {...stylex.props(baseStyles.routes)}>
            {routes
              .filter((route) => !route.hideFromNav)
              .map((route, index) => {
                if (route.type === 'group') {
                  return (
                    <li key={index} {...stylex.props(baseStyles.group)}>
                      <Heading xstyle={[baseStyles.heading, baseStyles.unselectable]}>{route.label}</Heading>
                      <ul {...stylex.props(baseStyles.groupRoutes)}>
                        {route.children.map((subRoute, subIndex) => renderItem(subRoute, subIndex))}
                      </ul>
                    </li>
                  );
                }

                return renderItem(route, index);
              })}
          </ul>
        </nav>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace SideNav {
  export interface PageRoute {
    type: 'page';
    /** Identifies the route. Compared against `selectedPath` to mark the item as current. */
    path: string;
    title: React.ReactNode;
    hideFromNav?: boolean;
  }

  export interface GroupRoute {
    type: 'group';
    label: React.ReactNode;
    children: readonly PageRoute[];
    hideFromNav?: boolean;
  }

  export type Route = PageRoute | GroupRoute;

  export interface Props extends Omit<bx.ComponentProps<'nav'>, 'children' | 'title'> {
    routes: readonly Route[];
    /** Path of the route to mark as current. Callers owning pattern matching pass the resolved path. */
    selectedPath?: string;
    heading?: React.ReactNode;
    subheading?: React.ReactNode;
    /** Rendered above the heading. Supply an interactive node if it should be clickable. */
    media?: React.ReactNode;
    /** Revealed on hover over `media`. Ignored when `media` is absent. */
    overview?: React.ReactNode;
    onRoutePrefetch?: (path: string) => void;
    onRouteSelect?: (path: string) => void;
  }
}

export default SideNav;
