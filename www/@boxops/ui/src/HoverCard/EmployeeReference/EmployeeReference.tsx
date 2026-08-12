import { PreviewCard } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { Avatar, AvatarImage, AvatarInitials } from '../../Avatar';
import { Card } from '../../Card';
import { Flexbox } from '../../Flexbox';
import { Link } from '../../Link';
import { usePortalContainer } from '../../PortalContainer';
import { Text } from '../../Text';
import EmployeeHoverCardContent from '../EmployeeHoverCardContent/EmployeeHoverCardContent';

import type { EmployeeReference_fragment$key } from '@repo/relay-artifacts/src/__generated__/EmployeeReference_fragment.graphql';

/**
 * A person named inside another card — a task's owner, a diff's author, a SEV's coordinator.
 *
 * Declares its own data needs rather than having each parent list `fullName`, `avatarUrl` and the
 * hover card's spread separately, which is what the v2 sources did three times over.
 *
 * The hover card's fields come through this fragment rather than a query of its own, unlike
 * `EmployeeAvatar`. The parent is already fetching this person to name them, so the extra fields
 * ride along on a request that was happening anyway — there is no second round trip to defer.
 */
const fragment = graphql`
  fragment EmployeeReference_fragment on EntUser {
    id
    fullName
    avatarUrl
    initials
    ...EmployeeHoverCardContent_fragment
  }
`;

const baseStyles = stylex.create({
  positioner: {
    zIndex: 100,
  },
  trigger: {
    display: 'inline-flex',
  },
});

const EmployeeReference = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, EmployeeReference.Props>(function EmployeeReference(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const user = useFragment(fragment, fragmentRef);
      const portalContainer = usePortalContainer();

      return (
        <Flexbox ref={ref} variants={{ gap: 'S', alignItems: 'center' }} xstyle={xstyle} {...rest}>
          <Avatar variants={{ size: 'XS' }}>
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt="" />
            ) : (
              <AvatarInitials initials={user.initials ?? '?'} />
            )}
          </Avatar>
          <PreviewCard.Root>
            <PreviewCard.Trigger render={<span {...stylex.props(baseStyles.trigger)} />}>
              <Text>
                <Link href={`/employee/${user.id}`}>{user.fullName}</Link>
              </Text>
            </PreviewCard.Trigger>
            <PreviewCard.Portal container={portalContainer}>
              <PreviewCard.Positioner side="top" sideOffset={8} {...stylex.props(baseStyles.positioner)}>
                <PreviewCard.Popup>
                  <Card>
                    <EmployeeHoverCardContent fragmentRef={user} />
                  </Card>
                </PreviewCard.Popup>
              </PreviewCard.Positioner>
            </PreviewCard.Portal>
          </PreviewCard.Root>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace EmployeeReference {
  export interface Props extends Omit<React.ComponentProps<typeof Flexbox>, 'children' | 'variants'> {
    fragmentRef: EmployeeReference_fragment$key;
  }
}

export default EmployeeReference;
