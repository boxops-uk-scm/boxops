import { PreviewCard } from '@base-ui/react';
import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment, useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { Card } from '../../Card';
import { EmployeeHoverCardContent } from '../../HoverCard';
import { usePortalContainer } from '../../PortalContainer';
import { Spinner } from '../../Spinner';
import Avatar from '../Avatar';
import AvatarIcon from '../Icon/Icon';
import AvatarImage from '../Image/Image';
import AvatarInitials from '../Initials/Initials';
import { getVariant } from '../variants';

import type { EmployeeAvatar_fragment$key } from '@repo/relay-artifacts/src/__generated__/EmployeeAvatar_fragment.graphql';
import type { EmployeeAvatarHoverCardQuery } from '@repo/relay-artifacts/src/__generated__/EmployeeAvatarHoverCardQuery.graphql';

const fragment = graphql`
  fragment EmployeeAvatar_fragment on EntUser {
    id
    initials
    avatarUrl
  }
`;

/**
 * The hover card's data is deliberately not part of the avatar's fragment.
 *
 * An avatar is cheap and appears in bulk — a list of a hundred shows a hundred of them — while the
 * hover card needs a dozen more fields that are only ever read if someone points at one. Keeping it
 * as its own query means that cost is paid per hover rather than per avatar, at the price of the
 * component owning a query rather than taking a fragment.
 */
const hoverCardQuery = graphql`
  query EmployeeAvatarHoverCardQuery($id: ID!) @raw_response_type {
    user(id: $id) {
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

const baseStyles = stylex.create({
  base: {
    verticalAlign: 'top',
  },
  trigger: {
    display: 'inline-flex',
  },
  positioner: {
    zIndex: 100,
  },
  fallback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '120px',
    minHeight: '80px',
  },
});

/** Suspends until the hover card's query resolves, which is what defers the cost to the hover. */
function HoverCardContent({ employeeId }: { employeeId: string }) {
  const { user } = useLazyLoadQuery<EmployeeAvatarHoverCardQuery>(hoverCardQuery, { id: employeeId });

  return user ? <EmployeeHoverCardContent fragmentRef={user} /> : null;
}

const EmployeeAvatar = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, EmployeeAvatar.Props>(function EmployeeAvatar(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const user = useFragment(fragment, fragmentRef);
      const portalContainer = usePortalContainer();

      // `Avatar`'s `xstyle` may itself be a function of state, so the caller's value is resolved
      // rather than spread into an array alongside ours.
      const composedStyle = React.useCallback(
        (state: Avatar.State) => [baseStyles.base, typeof xstyle === 'function' ? xstyle(state) : xstyle],
        [xstyle],
      );

      return (
        <PreviewCard.Root>
          <PreviewCard.Trigger render={<span {...stylex.props(baseStyles.trigger)} />}>
            <Avatar ref={ref} hasVignette={user.avatarUrl != null} xstyle={composedStyle} {...rest}>
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt="" />
              ) : user.initials ? (
                <AvatarInitials initials={user.initials} />
              ) : (
                <AvatarIcon icon={Phosphor.UserIcon} variant={getVariant(user.id)} />
              )}
            </Avatar>
          </PreviewCard.Trigger>
          <PreviewCard.Portal container={portalContainer}>
            <PreviewCard.Positioner side="top" sideOffset={5} {...stylex.props(baseStyles.positioner)}>
              <PreviewCard.Popup>
                <Card>
                  <React.Suspense
                    fallback={
                      <div {...stylex.props(baseStyles.fallback)}>
                        <Spinner variants={{ color: 'onLightMedia' }} />
                      </div>
                    }
                  >
                    <HoverCardContent employeeId={user.id} />
                  </React.Suspense>
                </Card>
              </PreviewCard.Popup>
            </PreviewCard.Positioner>
          </PreviewCard.Portal>
        </PreviewCard.Root>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace EmployeeAvatar {
  export interface Props extends Omit<Avatar.Props, 'children' | 'status'> {
    fragmentRef: EmployeeAvatar_fragment$key;
  }
}

export default EmployeeAvatar;
