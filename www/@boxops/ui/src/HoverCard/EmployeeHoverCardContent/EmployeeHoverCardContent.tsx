import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { Avatar, AvatarIcon, AvatarImage, AvatarInitials, getVariant } from '../../Avatar';
import { Button } from '../../Button';
import { DateTime } from '../../DateTime';
import { Flexbox } from '../../Flexbox';
import { Heading } from '../../Heading';
import { Icon } from '../../Icon';
import { Link } from '../../Link';
import { MetadataList } from '../../MetadataList';
import { vars as metadataListVars } from '../../MetadataList/vars.stylex';
import { Text } from '../../Text';
import { iconColor } from '../../tokens.stylex';
import * as bx from '../../types';

import type { EmployeeHoverCardContent_fragment$key } from '@repo/relay-artifacts/src/__generated__/EmployeeHoverCardContent_fragment.graphql';

const fragment = graphql`
  fragment EmployeeHoverCardContent_fragment on EntUser {
    id
    fullName
    unixName
    initials
    email
    phoneNumber
    avatarUrl
    organization
    jobTitle
    reportsTo {
      fullName
    }
    location
    timezone
    startedAt
    status
  }
`;

const baseStyles = stylex.create({
  base: {
    maxWidth: '450px',
  },
  metadataIcon: {
    color: iconColor.secondary,
  },
  // `columns` counts label/value *pairs*; the default of two lays the card out in four columns.
  metadata: {
    [metadataListVars.columns]: 1,
  },
  grow: {
    flexGrow: 1,
  },
});

/**
 * The schema's enum is screaming-snake; `Avatar` names its statuses in lower case. Relay widens
 * every enum with `'%future added value'` so that a server adding a member cannot break the client,
 * which is exactly why this is a lookup returning `undefined` rather than an exhaustive map.
 */
const AVATAR_STATUS: Partial<Record<string, Avatar.Status>> = {
  AVAILABLE: 'available',
  AWAY: 'away',
  BUSY: 'busy',
  OFFLINE: 'offline',
};

const EmployeeHoverCardContent = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, EmployeeHoverCardContent.Props>(function EmployeeHoverCardContent(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const user = useFragment(fragment, fragmentRef);

      return (
        <Flexbox ref={ref} variants={{ direction: 'column', gap: 'S' }} xstyle={[baseStyles.base, xstyle]} {...rest}>
          <Flexbox variants={{ direction: 'rowReverse', gap: 'M' }}>
            <Avatar
              variants={{ size: 'XXXL' }}
              status={user.status ? AVATAR_STATUS[user.status] : undefined}
             
            >
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt="" />
              ) : user.initials ? (
                <AvatarInitials initials={user.initials} />
              ) : (
                <AvatarIcon icon={Phosphor.UserIcon} variant={getVariant(user.id)} />
              )}
            </Avatar>
            <Flexbox variants={{ direction: 'column', gap: 'S' }}>
              <Flexbox variants={{ direction: 'column' }}>
                <Heading as="h1">
                  <Link href={`/employee/${user.id}`}>{user.fullName}</Link>
                </Heading>
                <Text as="small" variants={{ color: 'subtle' }}>
                  {user.unixName}
                </Text>
              </Flexbox>
              <MetadataList variants={{ size: 'compact' }} xstyle={baseStyles.metadata}>
                <Icon as={Phosphor.GraphIcon} xstyle={baseStyles.metadataIcon} />
                <Text>
                  {user.jobTitle} at <Link href={`/org/${user.organization}`}>{user.organization}</Link>
                </Text>
                <Icon as={Phosphor.TreeStructureIcon} xstyle={baseStyles.metadataIcon} />
                <Flexbox variants={{ direction: 'column', gap: 'XS' }}>
                  <Text>
                    Reports to <Link href={`/employee/${user.reportsTo?.fullName}`}>{user.reportsTo?.fullName}</Link>
                  </Text>
                </Flexbox>
                <Icon as={Phosphor.MapPinIcon} xstyle={baseStyles.metadataIcon} />
                <Text>{user.location}</Text>
                <Icon as={Phosphor.SunHorizonIcon} xstyle={baseStyles.metadataIcon} />
                <Flexbox variants={{ direction: 'row', alignItems: 'baseline', gap: 'S' }}>
                  <Text>{user.timezone}</Text>
                </Flexbox>
                <Icon as={Phosphor.StarIcon} xstyle={baseStyles.metadataIcon} />
                <Text>
                  Started on{' '}
                  {user.startedAt && <DateTime instant={new Date(user.startedAt)} formatString="MMM d, yyyy" />}
                </Text>
              </MetadataList>
            </Flexbox>
          </Flexbox>
          <Flexbox variants={{ gap: 'S' }}>
            <Button label="Message" xstyle={baseStyles.grow} startContent={<Icon as={Phosphor.ChatDotsIcon} />} />
            <Button aria-label="Email" startContent={<Icon as={Phosphor.EnvelopeIcon} />} />
            <Button aria-label="Video call" startContent={<Icon as={Phosphor.VideoCameraIcon} />} />
            <Button aria-label="Schedule" startContent={<Icon as={Phosphor.CalendarIcon} />} />
          </Flexbox>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace EmployeeHoverCardContent {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    fragmentRef: EmployeeHoverCardContent_fragment$key;
  }
}

export default EmployeeHoverCardContent;
