import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import EmployeeHoverCard from '../../HoverCard/EmployeeHoverCard/EmployeeHoverCard';
import Avatar from '../Avatar';

import EmployeeAvatarVisual from './EmployeeAvatarVisual';

import type { EmployeeAvatar_fragment$key } from '@repo/relay-artifacts/src/__generated__/EmployeeAvatar_fragment.graphql';

const fragment = graphql`
  fragment EmployeeAvatar_fragment on EntUser {
    ...EmployeeAvatarVisual_fragment
    ...EmployeeHoverCard_fragment
  }
`;

const baseStyles = stylex.create({
  base: {
    verticalAlign: 'top',
  },
});

const EmployeeAvatar = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, EmployeeAvatar.Props>(function EmployeeAvatar(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const user = useFragment(fragment, fragmentRef);

      // `Avatar`'s `xstyle` may itself be a function of state, so the caller's value is resolved
      // rather than spread into an array alongside ours.
      const composedStyle = React.useCallback(
        (state: Avatar.State) => [baseStyles.base, typeof xstyle === 'function' ? xstyle(state) : xstyle],
        [xstyle],
      );

      return (
        <EmployeeHoverCard fragmentRef={user}>
          <EmployeeAvatarVisual ref={ref} fragmentRef={user} xstyle={composedStyle} {...rest} />
        </EmployeeHoverCard>
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
