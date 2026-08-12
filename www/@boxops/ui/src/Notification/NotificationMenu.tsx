import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';
import { Card } from '../Card';
import { Heading } from '../Heading';
import { Icon } from '../Icon';
import { SplitButtonMenuItem, UncontrolledSplitButton } from '../SplitButton';
import { gap } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: gap.S,
  },
  notifications: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.S,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  spacer: {
    flexGrow: 1,
  },
});

const NotificationMenu = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, NotificationMenu.Props>(function NotificationMenu(
      { children, filterLabel = 'Unread', filters, onSnooze, onViewAll, xstyle, ...rest },
      ref,
    ) {
      return (
        <Card ref={ref} xstyle={xstyle} {...rest}>
          <div {...stylex.props(baseStyles.header)}>
            <Heading as="h3">Notifications</Heading>
            <UncontrolledSplitButton label={filterLabel} variants={{ appearance: 'flat', size: 'compact' }}>
              {filters?.map((filter) => (
                <SplitButtonMenuItem key={filter.label} label={filter.label} onClick={filter.onSelect} />
              ))}
            </UncontrolledSplitButton>
            <span {...stylex.props(baseStyles.spacer)} />
            <Button
              aria-label="Snooze notifications"
              onClick={onSnooze}
              variants={{ appearance: 'flat' }}
              startContent={<Icon as={Phosphor.MoonIcon} />}
            />
          </div>
          <div {...stylex.props(baseStyles.notifications)}>{children}</div>
          <div {...stylex.props(baseStyles.footer)}>
            <Button
              label="View all"
              onClick={onViewAll}
              variants={{ appearance: 'flat', size: 'compact' }}
              startContent={<Icon as={Phosphor.TrayIcon} />}
              endContent={<Icon as={Phosphor.ArrowRightIcon} variants={{ size: 'S' }} />}
            />
          </div>
        </Card>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace NotificationMenu {
  export interface Filter {
    label: string;
    onSelect?: () => void;
  }

  export interface Props extends bx.ComponentProps<'div'> {
    /** Label on the filter split-button. */
    filterLabel?: string;
    filters?: readonly Filter[];
    onSnooze?: () => void;
    onViewAll?: () => void;
  }
}

export default NotificationMenu;
