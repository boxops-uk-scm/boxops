import { Card, SEVHoverCardContent } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ALAN } from './fixtures';

import type { SEVHoverCardStoryQuery } from '@repo/relay-artifacts/src/__generated__/SEVHoverCardStoryQuery.graphql';

const query = graphql`
  query SEVHoverCardStoryQuery($number: Int!, $personId: ID!) @raw_response_type {
    sev(number: $number) {
      ...SEVHoverCardContent_fragment
    }
    # Seeds the lazy query the person's link issues on hover. In a real client that is a request;
    # here it must already be in the store, or the mock network throws.
    user(id: $personId) {
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

const data: SEVHoverCardStoryQuery['rawResponse'] = {
  user: ALAN,
  sev: {
    id: 'sev-1',
    number: 208,
    title: 'Design system demo page renders but never hydrates',
    stack: 'Web',
    severity: 'HIGH',
    tags: ['web', 'build', 'vite'],
    description:
      'Vite discovered new dependencies mid-load, aborted the in-flight module scripts and issued a reload. The page came back with the server-rendered markup intact but React never attached, so every control was inert while looking entirely correct.',
    createdAt: '2026-08-12T08:15:00.000Z',
    coordinator: ALAN,
    comments: [{ id: 'comment-4' }, { id: 'comment-5' }],
  },
};

export function SEVHoverCardStory() {
  return (
    <MockRelayEnvironment<SEVHoverCardStoryQuery> query={query} variables={{ number: 208, personId: ALAN.id }} data={data}>
      {({ sev }) => (sev ? <Card><SEVHoverCardContent fragmentRef={sev} /></Card> : null)}
    </MockRelayEnvironment>
  );
}
