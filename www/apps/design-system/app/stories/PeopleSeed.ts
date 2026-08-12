import { seedPayload } from '@boxops/ui/testing';
import { graphql } from 'relay-runtime';

import { ADA, ALAN, CHARLES, GRACE } from './fixtures';

import type { PeopleSeedQuery } from '@repo/relay-artifacts/src/__generated__/PeopleSeedQuery.graphql';

/**
 * Every person, in full, for any story that shows one.
 *
 * A hover card fetches its manager by id, and that card fetches *their* manager, so pointing at
 * one face can reach the whole directory. A story cannot know how far somebody will walk, so it
 * seeds all of them rather than the one it happens to render — the fixtures form a cycle
 * ([[fixtures]]), which is what makes "all of them" a finite list.
 *
 * Aliased rather than four separate operations: one payload commits once, and `user(id:)` is the
 * same field the card itself queries, so these records land under exactly the keys it looks up.
 */
const query = graphql`
  query PeopleSeedQuery @raw_response_type {
    ada: user(id: "user-1") {
      ...EmployeeHoverCardContent_fragment
    }
    charles: user(id: "user-2") {
      ...EmployeeHoverCardContent_fragment
    }
    grace: user(id: "user-3") {
      ...EmployeeHoverCardContent_fragment
    }
    alan: user(id: "user-4") {
      ...EmployeeHoverCardContent_fragment
    }
  }
`;

const data: PeopleSeedQuery['rawResponse'] = {
  ada: ADA,
  charles: CHARLES,
  grace: GRACE,
  alan: ALAN,
};

export const PEOPLE = [seedPayload<PeopleSeedQuery>(query, {}, data)];
