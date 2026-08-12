import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { EmployeeAvatar } from '../../Avatar';
import { Flexbox } from '../../Flexbox';
import { Text } from '../../Text';
import Link from '../Link';

import type { EmployeeLink_fragment$key } from '@repo/relay-artifacts/src/__generated__/EmployeeLink_fragment.graphql';

/**
 * Deliberately does not spread `EmployeeHoverCardContent_fragment`, which the v2 source did.
 *
 * `EmployeeAvatar` fetches the hover card's fields through its own query when someone actually
 * hovers. Spreading them here would pull all of it eagerly for every link on the page, which is
 * the cost that design exists to avoid.
 */
const fragment = graphql`
  fragment EmployeeLink_fragment on EntUser {
    id
    fullName
    ...EmployeeAvatar_fragment
  }
`;

const EmployeeLink = React.memo(
  React.forwardRef<React.ComponentRef<'div'>, EmployeeLink.Props>(function EmployeeLink(
    { fragmentRef, xstyle, ...rest },
    ref,
  ) {
    const user = useFragment(fragment, fragmentRef);

    return (
      <Flexbox ref={ref} variants={{ gap: 'XS', alignItems: 'center' }} xstyle={xstyle} {...rest}>
        <EmployeeAvatar fragmentRef={user} darkenOnHover />
        <Text>
          <Link href={`/employee/${user.id}`}>{user.fullName}</Link>
        </Text>
      </Flexbox>
    );
  }),
);

namespace EmployeeLink {
  export interface Props extends Omit<React.ComponentProps<typeof Flexbox>, 'children' | 'variants'> {
    fragmentRef: EmployeeLink_fragment$key;
  }
}

export default EmployeeLink;
