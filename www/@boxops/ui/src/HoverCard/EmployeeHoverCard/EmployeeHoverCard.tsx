import { PreviewCard } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment, useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { vars as avatarVars } from '../../Avatar/vars.stylex';
import { Card } from '../../Card';
import { usePortalContainer } from '../../PortalContainer';
import { Spinner } from '../../Spinner';
import { backgroundColor } from '../../tokens.stylex';
import EmployeeHoverCardContent from '../EmployeeHoverCardContent/EmployeeHoverCardContent';

import type { EmployeeHoverCard_fragment$key } from '@repo/relay-artifacts/src/__generated__/EmployeeHoverCard_fragment.graphql';
import type { EmployeeHoverCardQuery } from '@repo/relay-artifacts/src/__generated__/EmployeeHoverCardQuery.graphql';

/**
 * Wraps whatever should reveal a person's card on hover.
 *
 * Split out of `EmployeeAvatar` so the trigger is not tied to the avatar: `EmployeeLink` shows a
 * face *and* a name, and hovering either should do the same thing. Taking the trigger as children
 * puts that choice with the caller, and keeps a single popup rather than one nested inside another.
 */
const fragment = graphql`
  fragment EmployeeHoverCard_fragment on EntUser {
    id
  }
`;

/**
 * The card's fields are deliberately a query of their own rather than part of the trigger's
 * fragment. A person's name or face appears in bulk — a list of a hundred renders a hundred — while
 * these dozen fields are only read if someone actually points at one.
 */
const hoverCardQuery = graphql`
  query EmployeeHoverCardQuery($id: ID!) @raw_response_type {
    user(id: $id) {
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

const baseStyles = stylex.create({
  trigger: {
    display: 'inline-flex',
    // Anything that reveals a card is pointing at a person, so it reads as clickable.
    cursor: 'pointer',
    // Set on the trigger rather than on the avatar's own `:hover`, so the whole trigger drives it:
    // in a link, brushing the name dims the face too. The token flips with the scheme, so it
    // darkens on a light ground and lightens on a dark one.
    [avatarVars.overlayColor]: {
      default: null,
      ':hover': backgroundColor.overlay,
    },
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

/** Suspends until the query resolves, which is what defers the cost to the hover. */
function Content({ employeeId }: { employeeId: string }) {
  const { user } = useLazyLoadQuery<EmployeeHoverCardQuery>(hoverCardQuery, { id: employeeId });

  return user ? <EmployeeHoverCardContent fragmentRef={user} /> : null;
}

const EmployeeHoverCard = Object.assign(
  React.memo(function EmployeeHoverCard({ fragmentRef, side = 'top', children }: EmployeeHoverCard.Props) {
    const user = useFragment(fragment, fragmentRef);
    const portalContainer = usePortalContainer();

    return (
      <PreviewCard.Root>
        <PreviewCard.Trigger render={<span {...stylex.props(baseStyles.trigger)} />}>{children}</PreviewCard.Trigger>
        <PreviewCard.Portal container={portalContainer}>
          <PreviewCard.Positioner side={side} sideOffset={8} {...stylex.props(baseStyles.positioner)}>
            <PreviewCard.Popup>
              <Card>
                <React.Suspense
                  fallback={
                    <div {...stylex.props(baseStyles.fallback)}>
                      <Spinner variants={{ color: 'onLightMedia' }} />
                    </div>
                  }
                >
                  <Content employeeId={user.id} />
                </React.Suspense>
              </Card>
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>
    );
  }),
  {
    styles: baseStyles,
  },
);

namespace EmployeeHoverCard {
  export interface Props {
    fragmentRef: EmployeeHoverCard_fragment$key;
    /** Everything that should reveal the card. */
    children?: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
  }
}

export default EmployeeHoverCard;
