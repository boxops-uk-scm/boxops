import { EmployeeAvatar, Notification, NotificationMenu, Text } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ALAN, GRACE } from './fixtures';
import { PEOPLE } from './PeopleSeed';

import type { NotificationStoryQuery } from '@repo/relay-artifacts/src/__generated__/NotificationStoryQuery.graphql';

const query = graphql`
  query NotificationStoryQuery @raw_response_type {
    grace: user(id: "user-3") {
      ...EmployeeAvatar_fragment
    }
    alan: user(id: "user-4") {
      ...EmployeeAvatar_fragment
    }
  }
`;

const data: NotificationStoryQuery['rawResponse'] = {
  grace: GRACE,
  alan: ALAN,
};

/**
 * A notification is always *from* somebody, so the face beside it is that person — with their card,
 * like every other mention of them. The demo previously drew initials from names that belonged to
 * nobody in the schema, which looked right and led nowhere.
 */
export function NotificationStory() {
  return (
    <MockRelayEnvironment<NotificationStoryQuery> query={query} variables={{}} data={data} seed={PEOPLE}>
      {({ grace, alan }) => (
        <NotificationMenu filterLabel="Unread" filters={[{ label: 'Urgent' }, { label: 'Read' }]}>
          <Notification avatar={grace ? <EmployeeAvatar fragmentRef={grace} variants={{ size: 'S' }} /> : null}>
            <Text as="small">Grace requested review on a diff you own.</Text>
          </Notification>
          <Notification isSeen avatar={alan ? <EmployeeAvatar fragmentRef={alan} variants={{ size: 'S' }} /> : null}>
            <Text as="small">Alan commented on your task.</Text>
          </Notification>
        </NotificationMenu>
      )}
    </MockRelayEnvironment>
  );
}
