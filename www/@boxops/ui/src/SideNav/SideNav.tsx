import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { useRouterConfig, usePrefetchLinkHandlers } from '@boxops/router';
import * as HoverCard from '@radix-ui/react-hover-card';

import { Avatar } from '../Avatar';
import { Flexbox } from '../Flexbox';
import { Heading } from '../Heading';
import { Icon } from '../Icon';
import { List } from '../List';
import { Sitemap } from '../Sitemap';
import { Text } from '../Text';
import { backgroundColor, padding } from '../tokens.stylex';
import * as bx from '../types';

import Item from './Item';

const baseStyles = stylex.create({
  base: {
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
  unselectable: {
    userSelect: 'none',
  },
  popover: {
    zIndex: 100,
  },
  routes: {
    overflowY: 'auto',
  },
  groupHeading: {
    paddingTop: padding.M,
    paddingBottom: padding.M,
  },
  heading: {
    paddingBottom: padding.S,
  },
});

const SideNav = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, SideNav.Props>(function SideNav({ xstyle, ...rest }, ref) {
      const { routes } = useRouterConfig();
      const [onMouseEnter, onClick] = usePrefetchLinkHandlers('/design-system');

      return (
        <Flexbox variants={{ direction: 'column', gap: 'XL' }} xstyle={[baseStyles.base, xstyle]} {...rest}>
          <Flexbox variants={{ direction: 'column', alignItems: 'center' }} xstyle={baseStyles.header}>
            <HoverCard.Root openDelay={800}>
              <HoverCard.Trigger onClick={onClick} onMouseEnter={onMouseEnter}>
                <Avatar size="XXL" darkenOnHover>
                  <Avatar.Icon src={Icon.Package} />
                </Avatar>
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content side="top" sideOffset={5} {...stylex.props(baseStyles.popover)}>
                  <Sitemap />
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
            <Heading as="h1" xstyle={baseStyles.unselectable}>
              Boxops
            </Heading>
            <Text as="small" variants={{ color: 'subtle' }} xstyle={baseStyles.unselectable}>
              Design System
            </Text>
          </Flexbox>
          <List ref={ref} xstyle={baseStyles.routes}>
            {routes
              .filter((route) => !('hideFromNav' in route && route.hideFromNav))
              .map((route, index) => {
                switch (route.type) {
                  case 'group':
                    return (
                      <div key={index} {...stylex.props(baseStyles.groupHeading)}>
                        <Heading xstyle={[baseStyles.heading, baseStyles.unselectable]}>{route.label}</Heading>
                        {route.children.map((subRoute, subIndex) => (
                          <Item key={subIndex} route={subRoute} />
                        ))}
                      </div>
                    );
                  case 'page':
                    return <Item key={index} route={route} />;
                }
              })}
          </List>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace SideNav {
  export type Props = bx.ComponentProps<'div'>;
}

export default SideNav;
