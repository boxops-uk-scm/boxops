import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Card } from '../Card';
import { Divider } from '../Divider';
import { Icon } from '../Icon';
import { TextPair } from '../TextPair';
import { Toggle } from '../Toggle';
import { gap, padding } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: gap.M,
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.M,
    paddingLeft: padding.S,
    paddingRight: padding.S,
    paddingTop: padding.S,
  },
  identity: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.M,
  },
  // The face is a picture of who is signed in, not a control — clicking it should do nothing, and
  // it should not swallow a click meant for the card behind it.
  avatar: {
    pointerEvents: 'none',
  },
  grow: {
    flexGrow: 1,
  },
  // Three equal columns, so the status toggles read as one segmented control rather than three
  // buttons that happen to be adjacent.
  statuses: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: gap.XXS,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
  },
  // A menu row, not a button: the label starts where the icon leaves off instead of sitting in the
  // middle of the row. `Button` centres its content, which is right for a button and wrong for a
  // list of destinations — a column of centred labels has no common left edge to read down.
  action: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingLeft: padding.S,
    paddingRight: padding.S,
  },
  // Pushed to the trailing edge, so every chevron and every "opens elsewhere" arrow lines up
  // regardless of how long its label is. The margin has to sit on a span of our own: `Icon` wraps
  // itself in a div and applies `xstyle` to the inner `svg`, so styling the icon would put the
  // margin one level below the button's flex row, where there is no free space for it to absorb.
  actionEnd: {
    display: 'inline-flex',
    marginInlineStart: 'auto',
  },
  divider: {
    marginLeft: padding.S,
    marginRight: padding.S,
    marginTop: padding.S,
    marginBottom: padding.S,
  },
});

/** The three a person sets by hand. `offline` is observed rather than chosen, so it is not here. */
const STATUSES = ['available', 'busy', 'away'] as const;

const STATUS_LABEL = {
  available: 'Available',
  busy: 'Busy',
  away: 'Away',
} as const satisfies Record<ProfileMenu.Status, string>;

/**
 * The signed-in person: who they are, whether they are around, and where they can go next.
 *
 * The v1 original hard-coded its own menu — "Status Tool", "Intern Profile", a dark-mode row — so
 * the list of things one company's employees could do was baked into the component. They arrive as
 * `actions` now, which is the same move as `Sitemap`'s routes: the component knows how a menu
 * looks, the caller knows what is in it.
 *
 * Controlled, like every other stateful component here. `UncontrolledProfileMenu` keeps the status
 * for callers with nowhere to put it.
 */
const ProfileMenu = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, ProfileMenu.Props>(function ProfileMenu(
      { name, statusMessage, avatar, status = 'available', onStatusChange, actions = [], onEditStatus, xstyle, ...rest },
      ref,
    ) {
      const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

      return (
        <Card ref={ref} xstyle={styles} {...rest}>
          <div {...stylex.props(baseStyles.header)}>
            <div {...stylex.props(baseStyles.identity)}>
              {avatar && <span {...stylex.props(baseStyles.avatar)}>{avatar}</span>}
              <TextPair variant="h4" description={statusMessage ?? 'Add a status message'}>
                {name}
              </TextPair>
              <div {...stylex.props(baseStyles.grow)} />
              {onEditStatus && (
                <Button
                  variants={{ appearance: 'flat', size: 'compact' }}
                  onClick={onEditStatus}
                  aria-label="Edit status message"
                  startContent={<Icon as={Phosphor.PencilSimpleIcon} />}
                />
              )}
            </div>
            <ButtonGroup xstyle={[baseStyles.statuses, baseStyles.grow]}>
              {STATUSES.map((candidate) => (
                <Toggle
                  key={candidate}
                  label={STATUS_LABEL[candidate]}
                  pressed={status === candidate}
                  // Only ever sets, never clears: a person is always in some state, so pressing the
                  // one already pressed should leave it alone rather than turn it off.
                  onPressedChange={(pressed) => pressed && onStatusChange?.(candidate)}
                  xstyle={baseStyles.grow}
                />
              ))}
            </ButtonGroup>
          </div>
          <div {...stylex.props(baseStyles.actions)}>
            {actions.map((action, index) =>
              action === 'separator' ? (
                <Divider key={index} xstyle={baseStyles.divider} />
              ) : (
                <Button
                  key={action.label}
                  label={action.label}
                  variants={{ appearance: 'flat' }}
                  onClick={action.onSelect}
                  xstyle={baseStyles.action}
                  startContent={action.icon && <Icon as={action.icon} />}
                  endContent={
                    action.endIcon && (
                      <span {...stylex.props(baseStyles.actionEnd)}>
                        <Icon as={action.endIcon} />
                      </span>
                    )
                  }
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
    statuses: STATUSES,
  },
);

namespace ProfileMenu {
  /** A subset of `Avatar.Status`, so the dot on the face and the toggles here cannot disagree. */
  export type Status = (typeof STATUSES)[number];

  export interface Action {
    label: string;
    icon?: Icon.Props['as'];
    /** Drawn at the trailing edge — a chevron for a submenu, an arrow for somewhere off-site. */
    endIcon?: Icon.Props['as'];
    onSelect?: () => void;
  }

  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    name: string;
    statusMessage?: string;
    /** The person's face. Supplied rather than built from a URL, so it can be an `EmployeeAvatar`. */
    avatar?: React.ReactNode;
    status?: Status;
    onStatusChange?: (status: Status) => void;
    /** `'separator'` draws a divider between groups. */
    actions?: readonly (Action | 'separator')[];
    /** Shows the pencil beside the status message. Omitted, the pencil is not drawn at all. */
    onEditStatus?: () => void;
  }
}

export default ProfileMenu;
