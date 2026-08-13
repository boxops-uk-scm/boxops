import { Card, OncallHoverCardContent } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import type { OncallHoverCardStoryQuery } from '@repo/relay-artifacts/src/__generated__/OncallHoverCardStoryQuery.graphql';

const query = graphql`
  query OncallHoverCardStoryQuery($id: ID!) @raw_response_type {
    oncall(id: $id) {
      ...OncallHoverCardContent_fragment
    }
  }
`;

const data: OncallHoverCardStoryQuery['rawResponse'] = {
  oncall: {
    id: 'oncall-1',
    name: 'Design System Platform',
    shortName: 'design-system-platform',
    products: ['@boxops/ui', 'design-system', 'gateway'],
    description:
      'Owns the component library, its tokens and the showcase app. Page us for build breakages, token regressions and anything blocking a consolidation batch.',
  },
};

export function OncallHoverCardStory() {
  return (
    <MockRelayEnvironment<OncallHoverCardStoryQuery> query={query} variables={{ id: 'oncall-1' }} data={data}>
      {({ oncall }) => (oncall ? <Card><OncallHoverCardContent fragmentRef={oncall} /></Card> : null)}
    </MockRelayEnvironment>
  );
}
