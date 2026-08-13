import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import EmployeeAvatarVisual from '../../Avatar/EmployeeAvatar/EmployeeAvatarVisual';
import { Flexbox } from '../../Flexbox';
import EmployeeHoverCard from '../../HoverCard/EmployeeHoverCard/EmployeeHoverCard';
import { Text } from '../../Text';
import Link from '../Link';

import type { EmployeeLink_fragment$key } from '@repo/relay-artifacts/src/__generated__/EmployeeLink_fragment.graphql';

/**
 * Spreads the avatar's *visual* fragment rather than `EmployeeAvatar_fragment`, and owns the hover
 * card itself, so the trigger covers the face and the name together — hovering either reveals the
 * same card. Using `EmployeeAvatar` here would bring its own trigger and nest one card inside
 * another, with only the face opening it.
 *
 * The card's fields are still fetched on hover, by `EmployeeHoverCard`; nothing is pulled eagerly
 * for a page full of links.
 */
const fragment = graphql`
  fragment EmployeeLink_fragment on EntUser {
    id
    fullName
    ...EmployeeAvatarVisual_fragment
    ...EmployeeHoverCard_fragment
  }
`;

const baseStyles = stylex.create({
  row: {
    display: 'inline-flex',
    alignItems: 'center',
  },
});

const EmployeeLink = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, EmployeeLink.Props>(function EmployeeLink(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const user = useFragment(fragment, fragmentRef);

      // `Flexbox`'s `xstyle` may itself be a function of state, so the caller's value is resolved
      // rather than spread into an array alongside ours.
      const composedStyle = React.useCallback(
        (state: Flexbox.State) => [baseStyles.row, typeof xstyle === 'function' ? xstyle(state) : xstyle],
        [xstyle],
      );

      return (
        <EmployeeHoverCard fragmentRef={user}>
          <Flexbox
            ref={ref}
            variants={{ gap: 'XS', alignItems: 'center' }}
            xstyle={composedStyle}
            {...rest}
          >
            <EmployeeAvatarVisual fragmentRef={user} />
            <Text>
              <Link href={`/employee/${user.id}`}>{user.fullName}</Link>
            </Text>
          </Flexbox>
        </EmployeeHoverCard>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace EmployeeLink {
  export interface Props extends Omit<React.ComponentProps<typeof Flexbox>, 'children' | 'variants'> {
    fragmentRef: EmployeeLink_fragment$key;
  }
}

export default EmployeeLink;
