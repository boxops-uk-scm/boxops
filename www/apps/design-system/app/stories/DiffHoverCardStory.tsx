import { Card, DiffHoverCardContent } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { GRACE } from './fixtures';
import { PEOPLE } from './PeopleSeed';

import type { DiffHoverCardStoryQuery } from '@repo/relay-artifacts/src/__generated__/DiffHoverCardStoryQuery.graphql';

const query = graphql`
  query DiffHoverCardStoryQuery($number: Int!) @raw_response_type {
    diff(number: $number) {
      ...DiffHoverCardContent_fragment
    }
  }
`;

const data: DiffHoverCardStoryQuery['rawResponse'] = {
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
    <MockRelayEnvironment<DiffHoverCardStoryQuery> query={query} variables={{ number: 91724 }} data={data} seed={PEOPLE}>
      {({ diff }) => (diff ? <Card><DiffHoverCardContent fragmentRef={diff} /></Card> : null)}
    </MockRelayEnvironment>
  );
}
