import { Card, DiffHoverCardContent } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { GRACE } from './fixtures';

import type { DiffHoverCardStoryQuery } from '@repo/relay-artifacts/src/__generated__/DiffHoverCardStoryQuery.graphql';

const query = graphql`
  query DiffHoverCardStoryQuery($number: Int!, $personId: ID!) @raw_response_type {
    diff(number: $number) {
      ...DiffHoverCardContent_fragment
    }
    # Seeds the lazy query the person's link issues on hover. In a real client that is a request;
    # here it must already be in the store, or the mock network throws.
    user(id: $personId) {
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

const data: DiffHoverCardStoryQuery['rawResponse'] = {
  user: GRACE,
  diff: {
    id: 'diff-1',
    number: 91724,
    title: 'Derive the dark-mode ramp from the light tokens',
    status: 'MERGED',
    tags: ['tokens', 'dark-mode', 'colour'],
    significantLines: 412,
    projects: ['boxops-ui', 'design-system'],
    author: GRACE,
    comments: [{ id: 'comment-1' }, { id: 'comment-2' }, { id: 'comment-3' }],
  },
};

export function DiffHoverCardStory() {
  return (
    <MockRelayEnvironment<DiffHoverCardStoryQuery> query={query} variables={{ number: 91724, personId: GRACE.id }} data={data}>
      {({ diff }) => (diff ? <Card><DiffHoverCardContent fragmentRef={diff} /></Card> : null)}
    </MockRelayEnvironment>
  );
}
