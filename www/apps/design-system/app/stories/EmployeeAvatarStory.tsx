import { EmployeeAvatar } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ADA } from './fixtures';
import { PEOPLE } from './PeopleSeed';

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

const data: EmployeeAvatarStoryQuery['rawResponse'] = { user: ADA };

export function EmployeeAvatarStory() {
  return (
    <MockRelayEnvironment<EmployeeAvatarStoryQuery> query={query} variables={{ id: 'user-1' }} data={data} seed={PEOPLE}>
      {({ user }) => (user ? <EmployeeAvatar fragmentRef={user} variants={{ size: 'L' }} /> : null)}
    </MockRelayEnvironment>
  );
}
