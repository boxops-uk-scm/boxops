import { Card, EmployeeHoverCardContent } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import type { EmployeeHoverCardStoryQuery } from '@repo/relay-artifacts/src/__generated__/EmployeeHoverCardStoryQuery.graphql';

const query = graphql`
  query EmployeeHoverCardStoryQuery($id: ID!) @raw_response_type {
    user(id: $id) {
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

// Query-shaped, and typed against the generated operation — a field that drifts from the schema is
// a compile error here rather than a blank patch in the UI.
const data: EmployeeHoverCardStoryQuery['rawResponse'] = {
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
    // `id` is required because `EntUser` implements `Node`: Relay adds it to every selection
    // so the record can be normalized and shared. The harness catches its absence.
    reportsTo: { id: 'user-2', fullName: 'Charles Babbage' },
    location: 'London, UK',
    timezone: 'Europe/London',
    startedAt: '2021-03-01T09:00:00.000Z',
    status: 'AVAILABLE',
  },
};

export function EmployeeHoverCardStory() {
  return (
    <MockRelayEnvironment<EmployeeHoverCardStoryQuery> query={query} variables={{ id: 'user-1' }} data={data}>
      {({ user }) =>
        user ? (
          // Stands in for the hover card's content slot until `EmployeeAvatar`, which owns the
          // trigger and the popup, is ported.
          <Card>
            <EmployeeHoverCardContent fragmentRef={user} />
          </Card>
        ) : null
      }
    </MockRelayEnvironment>
  );
}
