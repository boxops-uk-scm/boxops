import { AvatarGroup, EmployeeAvatar, MeetingMenu, MeetingMenuItem } from '@boxops/ui';
import { MockRelayEnvironment } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ADA, ALAN, CHARLES, GRACE } from './fixtures';
import { PEOPLE } from './PeopleSeed';

import type { MeetingMenuStoryQuery } from '@repo/relay-artifacts/src/__generated__/MeetingMenuStoryQuery.graphql';

/** Fixed instants, so the "starts in" copy is the same on the server as in the browser. */
const NOW = new Date('2026-08-12T09:30:00Z');
const IN_PROGRESS = { start: new Date('2026-08-12T09:00:00Z'), end: new Date('2026-08-12T10:00:00Z') };
const UPCOMING = { start: new Date('2026-08-12T11:00:00Z'), end: new Date('2026-08-12T11:30:00Z') };

const query = graphql`
  query MeetingMenuStoryQuery @raw_response_type {
    ada: user(id: "user-1") {
      ...EmployeeAvatar_fragment
    }
    charles: user(id: "user-2") {
      ...EmployeeAvatar_fragment
    }
    grace: user(id: "user-3") {
      ...EmployeeAvatar_fragment
    }
    alan: user(id: "user-4") {
      ...EmployeeAvatar_fragment
    }
  }
`;

const data: MeetingMenuStoryQuery['rawResponse'] = {
  ada: ADA,
  charles: CHARLES,
  grace: GRACE,
  alan: ALAN,
};

export function MeetingMenuStory() {
  return (
    <MockRelayEnvironment<MeetingMenuStoryQuery> query={query} variables={{}} data={data} seed={PEOPLE}>
      {({ ada, charles, grace, alan }) => (
        <MeetingMenu
          date={NOW}
          inProgress={
            <MeetingMenuItem
              now={NOW}
              meetingName="Design system review"
              meetingRoom="Kensington 3"
              startTime={IN_PROGRESS.start}
              endTime={IN_PROGRESS.end}
              // A meeting is a group of people, so the room shows the group. Each face is a real
              // person here rather than a decoration: pointing at one opens their card.
              participants={
                <AvatarGroup variants={{ size: 'XS' }} max={3}>
                  {[ada, grace, alan, charles].map((user, index) =>
                    user ? <EmployeeAvatar key={index} fragmentRef={user} /> : null,
                  )}
                </AvatarGroup>
              }
            />
          }
          upcoming={
            <MeetingMenuItem
              now={NOW}
              meetingName="Consolidation standup"
              meetingRoom="Zoom"
              startTime={UPCOMING.start}
              endTime={UPCOMING.end}
              participants={
                <AvatarGroup variants={{ size: 'XS' }}>
                  {[grace, charles].map((user, index) => (user ? <EmployeeAvatar key={index} fragmentRef={user} /> : null))}
                </AvatarGroup>
              }
            />
          }
        />
      )}
    </MockRelayEnvironment>
  );
}
