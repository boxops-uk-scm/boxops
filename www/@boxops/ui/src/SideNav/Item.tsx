import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { PageRoute, useMatch, usePrefetchLinkHandlers } from '@boxops/router';
import { matchPath } from 'react-router';

import { List } from '../List';

const baseStyles = stylex.create({
  item: {
    cursor: 'pointer',
  },
});

const Item = React.memo(function Item({ route }: Item.Props) {
  const currentLocation = useMatch();
  const match = matchPath({ path: route.path!, end: true }, currentLocation.path!);
  const isSelected = !!match;

  const [onMouseEnter, onClick] = usePrefetchLinkHandlers(route.path!);

  return (
    <List.Item
      onMouseEnter={onMouseEnter}
      onFocus={onMouseEnter}
      onMouseDown={onClick}
      isSelected={isSelected}
      xstyle={baseStyles.item}
      label={route.title}
    />
  );
});

namespace Item {
  export interface Props {
    route: PageRoute;
  }
}

export default Item;
