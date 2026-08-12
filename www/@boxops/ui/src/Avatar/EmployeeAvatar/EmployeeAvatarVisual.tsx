import { SSR as Phosphor } from '@phosphor-icons/react';
import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import Avatar from '../Avatar';
import AvatarIcon from '../Icon/Icon';
import AvatarImage from '../Image/Image';
import AvatarInitials from '../Initials/Initials';
import { getVariant } from '../variants';

import type { EmployeeAvatarVisual_fragment$key } from '@repo/relay-artifacts/src/__generated__/EmployeeAvatarVisual_fragment.graphql';

/**
 * A person's avatar and nothing else — no hover card.
 *
 * `EmployeeAvatar` pairs this with one; `EmployeeLink` puts it inside a trigger that also covers
 * the name, so it needs the face on its own. Keeping the two apart is what stops the link nesting
 * a hover card inside a hover card.
 */
const fragment = graphql`
  fragment EmployeeAvatarVisual_fragment on EntUser {
    id
    initials
    avatarUrl
  }
`;

const EmployeeAvatarVisual = React.memo(
  React.forwardRef<React.ComponentRef<'div'>, EmployeeAvatarVisual.Props>(function EmployeeAvatarVisual(
    { fragmentRef, ...rest },
    ref,
  ) {
    const user = useFragment(fragment, fragmentRef);

    return (
      <Avatar ref={ref} {...rest}>
        {user.avatarUrl ? (
          <AvatarImage src={user.avatarUrl} alt="" />
        ) : user.initials ? (
          <AvatarInitials initials={user.initials} />
        ) : (
          <AvatarIcon icon={Phosphor.UserIcon} variant={getVariant(user.id)} />
        )}
      </Avatar>
    );
  }),
);

namespace EmployeeAvatarVisual {
  export interface Props extends Omit<Avatar.Props, 'children' | 'status'> {
    fragmentRef: EmployeeAvatarVisual_fragment$key;
  }
}

export default EmployeeAvatarVisual;
