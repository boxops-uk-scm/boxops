import { EmployeeAvatar } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import type { EmployeeAvatarStoryQuery } from '@repo/relay-artifacts/src/__generated__/EmployeeAvatarStoryQuery.graphql';

/**
 * Spreads the hover card's fragment as well as the avatar's.
 *
 * The avatar only needs three fields, but its hover card issues a *separate* query on hover. Seeding
 * both here puts the `user(id:)` root field and every field that query selects into the store, so
 * when it runs it resolves from the store and never reaches the network — which is exactly the
 * lazy path a real client takes on a warm cache.
 */
const query = graphql`
  query EmployeeAvatarStoryQuery($id: ID!) @raw_response_type {
    user(id: $id) {
      ...EmployeeAvatar_fragment
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

const data: EmployeeAvatarStoryQuery['rawResponse'] = {
  user: {
    id: 'user-1',
    fullName: 'Ada Lovelace',
    unixName: 'alovelace',
    initials: 'AL',
    email: 'alovelace@boxops.co.uk',
    phoneNumber: '+44 20 7946 0958',
    avatarUrl: '/avatar-1.jpg',
    organization: 'Analytical Engines',
    jobTitle: 'Principal Engineer',
    reportsTo: { id: 'user-2', fullName: 'Charles Babbage' },
    location: 'London, UK',
    timezone: 'Europe/London',
    startedAt: '2021-03-01T09:00:00.000Z',
    status: 'AVAILABLE',
  },
};

export function EmployeeAvatarStory() {
  return (
    <MockRelayEnvironment<EmployeeAvatarStoryQuery> query={query} variables={{ id: 'user-1' }} data={data}>
      {({ user }) => (user ? <EmployeeAvatar fragmentRef={user} variants={{ size: 'L' }} /> : null)}
    </MockRelayEnvironment>
  );
}
