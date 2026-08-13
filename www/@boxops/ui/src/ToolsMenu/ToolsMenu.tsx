import { SSR as Phosphor, type IconProps } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';
import { Card } from '../Card';
import { Divider } from '../Divider';
import { Heading } from '../Heading';
import { Icon } from '../Icon';
import { gap, padding } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    width: '200px',
    padding: 0,
    gap: gap.XS,
  },
  header: {
    marginTop: padding.S,
    marginLeft: padding.S,
    marginRight: padding.S,
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
  },
  // Menu rows read as a list, so they align left instead of centring like a standalone button.
  // Same treatment `SplitButtonMenuItem` uses.
  item: {
    justifyContent: 'flex-start',
    paddingLeft: padding.S,
    paddingRight: padding.S,
  },
  divider: {
    marginTop: padding.XS,
    marginBottom: padding.XS,
  },
});

const ToolsMenu = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, ToolsMenu.Props>(function ToolsMenu({ items, xstyle, ...rest }, ref) {
      return (
        <Card ref={ref} xstyle={[baseStyles.base, xstyle]} {...rest}>
          <div {...stylex.props(baseStyles.header)}>
            <Heading as="h3">Tools</Heading>
          </div>
          <div {...stylex.props(baseStyles.items)}>
            {items.map((item, index) =>
              item.type === 'divider' ? (
                <Divider key={index} xstyle={baseStyles.divider} />
              ) : (
                <Button
                  key={index}
                  label={item.label}
                  onClick={item.onSelect}
                  variants={{ appearance: 'flat' }}
                  xstyle={baseStyles.item}
                  startContent={<Icon as={item.icon} />}
                  endContent={item.hasSubmenu ? <Icon as={Phosphor.CaretRightIcon} variants={{ size: 'S' }} /> : undefined}
                />
              ),
            )}
          </div>
        </Card>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace ToolsMenu {
  export interface ToolItem {
    type?: 'item';
    label: string;
    icon: React.FC<IconProps>;
    /** Shows a trailing caret, for rows that open a further menu. */
    hasSubmenu?: boolean;
    onSelect?: () => void;
  }

  export interface DividerItem {
    type: 'divider';
  }

  export type Item = ToolItem | DividerItem;

  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    /** Driven by props rather than hardcoded, so the menu is not tied to one app's tool list. */
    items: readonly Item[];
  }
}

export default ToolsMenu;
