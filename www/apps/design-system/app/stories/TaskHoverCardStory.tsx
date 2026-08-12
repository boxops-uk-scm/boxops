import { Card, TaskHoverCardContent } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ADA } from './fixtures';

import type { TaskHoverCardStoryQuery } from '@repo/relay-artifacts/src/__generated__/TaskHoverCardStoryQuery.graphql';

const query = graphql`
  query TaskHoverCardStoryQuery($number: Int!, $personId: ID!) @raw_response_type {
    task(number: $number) {
      ...TaskHoverCardContent_fragment
    }
    # Seeds the lazy query the person's link issues on hover. In a real client that is a request;
    # here it must already be in the store, or the mock network throws.
    user(id: $personId) {
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

const data: TaskHoverCardStoryQuery['rawResponse'] = {
  user: ADA,
  task: {
    id: 'task-1',
    number: 4821,
    title: 'Consolidate the v1 and v2 component libraries',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    tags: ['design-system', 'consolidation', 'tooling'],
    owner: ADA,
  },
};

export function TaskHoverCardStory() {
  return (
    <MockRelayEnvironment<TaskHoverCardStoryQuery> query={query} variables={{ number: 4821, personId: ADA.id }} data={data}>
      {({ task }) => (task ? <Card><TaskHoverCardContent fragmentRef={task} /></Card> : null)}
    </MockRelayEnvironment>
  );
}
