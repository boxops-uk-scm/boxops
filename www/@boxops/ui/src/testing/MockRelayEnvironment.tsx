import * as React from 'react';
import { RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import {
  Environment,
  Network,
  RecordSource,
  Store,
  createOperationDescriptor,
  getRequest,
  type GraphQLTaggedNode,
  type OperationType,
  type PayloadData,
} from 'relay-runtime';

import { type SeedPayload } from './seedPayload';

/**
 * Renders a component tree against a Relay store built by hand, with no network and no server.
 *
 * The store is seeded through `commitPayload`, which is Relay's own normalizer: it takes the plain
 * response an operation would have produced and writes the records exactly as a real fetch would.
 * That means the fixtures are ordinary query-shaped JSON, checked against the generated operation
 * type — so a fixture that drifts from the schema fails to typecheck rather than failing to render.
 *
 * Each instance gets its own `Environment`, so two of these on one page cannot see each other's
 * records. That isolation is what makes it usable per story or per test case.
 *
 * The network deliberately throws. Anything the component asks for that the fixture did not seed
 * surfaces immediately as a loud error, instead of hanging in Suspense or quietly rendering null.
 */
function createMockEnvironment(): Environment {
  return new Environment({
    network: Network.create((params) => {
      throw new Error(
        `MockRelayEnvironment: '${params.name}' tried to reach the network. ` +
          `Seed it by adding the operation's response to the fixture.`,
      );
    }),
    store: new Store(new RecordSource()),
    // Fixtures are the whole truth here; missing fields should be visible, not filled in.
    missingFieldHandlers: [],
  });
}

export function MockRelayEnvironment<TQuery extends OperationType>({
  query,
  variables,
  data,
  seed,
  children,
}: MockRelayEnvironment.Props<TQuery>) {
  const environment = React.useMemo(() => {
    const env = createMockEnvironment();

    // Seeded first: these are records the story's own query never asks for, so nothing yet depends
    // on them. Committing them up front means the store is whole before anything reads it.
    for (const extra of seed ?? []) {
      env.commitPayload(createOperationDescriptor(getRequest(extra.query), extra.variables), extra.data);
    }

    // `PayloadData` is Relay's untyped record bag; the generated response type is a narrowing
    // of it, and the cast is the only place that looseness is allowed in.
    env.commitPayload(createOperationDescriptor(getRequest(query), variables), data as PayloadData);
    return env;
  }, [query, variables, data, seed]);

  return (
    <RelayEnvironmentProvider environment={environment}>
      <MockQueryResult query={query} variables={variables}>
        {children}
      </MockQueryResult>
    </RelayEnvironmentProvider>
  );
}

/**
 * Reads the seeded operation back out, so children receive real fragment refs rather than fixtures
 * pretending to be them. `store-only` keeps it honest: the data either came from the store or the
 * render fails.
 */
function MockQueryResult<TQuery extends OperationType>({
  query,
  variables,
  children,
}: Omit<MockRelayEnvironment.Props<TQuery>, 'data'>) {
  const data = useLazyLoadQuery<TQuery>(query, variables, { fetchPolicy: 'store-only' });

  return <>{children(data)}</>;
}

namespace MockRelayEnvironment {
  export interface Props<TQuery extends OperationType> {
    /** The operation the fixture describes. */
    query: GraphQLTaggedNode;
    variables: TQuery['variables'];
    /**
     * The records to seed, typed against the operation's `rawResponse` — the full normalized shape
     * including every field its fragments select. Requires `@raw_response_type` on the query;
     * without it the operation's `response` type only exposes fragment spreads, which cannot
     * describe the underlying data at all.
     */
    data: TQuery['rawResponse'];
    /**
     * Further payloads to write before the story's own, for records it reaches only by interaction
     * — a hover card that queries by id, say. The network throws, so anything not seeded here
     * fails loudly the moment somebody points at it.
     */
    seed?: readonly SeedPayload[];
    children: (data: TQuery['response']) => React.ReactNode;
  }
}

export default MockRelayEnvironment;
