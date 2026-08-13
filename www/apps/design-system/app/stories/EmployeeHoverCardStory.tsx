import { Card, EmployeeHoverCardContent } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ADA } from './fixtures';
import { PEOPLE } from './PeopleSeed';

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
const data: EmployeeHoverCardStoryQuery['rawResponse'] = { user: ADA };

export function EmployeeHoverCardStory() {
  return (
    <MockRelayEnvironment<EmployeeHoverCardStoryQuery> query={query} variables={{ id: 'user-1' }} data={data} seed={PEOPLE}>
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
