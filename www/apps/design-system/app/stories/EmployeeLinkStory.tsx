import { EmployeeLink } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ADA } from './fixtures';
import { PEOPLE } from './PeopleSeed';

import type { EmployeeLinkStoryQuery } from '@repo/relay-artifacts/src/__generated__/EmployeeLinkStoryQuery.graphql';

// Spreads the hover card's fragment as well, so the avatar's own lazy query resolves from the store
// rather than reaching the mock network, which throws.
const query = graphql`
  query EmployeeLinkStoryQuery($id: ID!) @raw_response_type {
    user(id: $id) {
      ...EmployeeLink_fragment
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

const data: EmployeeLinkStoryQuery['rawResponse'] = { user: ADA };

export function EmployeeLinkStory() {
  return (
    <MockRelayEnvironment<EmployeeLinkStoryQuery> query={query} variables={{ id: 'user-1' }} data={data} seed={PEOPLE}>
      {({ user }) => (user ? <EmployeeLink fragmentRef={user} /> : null)}
    </MockRelayEnvironment>
  );
}
