import { Card, SEVHoverCardContent } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ALAN } from './fixtures';

import type { SEVHoverCardStoryQuery } from '@repo/relay-artifacts/src/__generated__/SEVHoverCardStoryQuery.graphql';

const query = graphql`
  query SEVHoverCardStoryQuery($number: Int!) @raw_response_type {
    sev(number: $number) {
      ...SEVHoverCardContent_fragment
    }
  }
`;

const data: SEVHoverCardStoryQuery['rawResponse'] = {
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
    <MockRelayEnvironment<SEVHoverCardStoryQuery> query={query} variables={{ number: 208 }} data={data}>
      {({ sev }) => (sev ? <Card><SEVHoverCardContent fragmentRef={sev} /></Card> : null)}
    </MockRelayEnvironment>
  );
}
