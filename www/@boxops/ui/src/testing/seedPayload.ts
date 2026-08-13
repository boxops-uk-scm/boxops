import type { GraphQLTaggedNode, OperationType, PayloadData } from 'relay-runtime';

/** One payload to write into a mock store, already typed against the operation it describes. */
export interface SeedPayload {
  query: GraphQLTaggedNode;
  variables: Record<string, unknown>;
  data: PayloadData;
}

/**
 * Types one extra payload against its own operation, for `MockRelayEnvironment`'s `seed`.
 *
 * A helper rather than an inline object because the three arguments have to agree: `data` is only
 * checked against `query` if a single type parameter binds them, which an array of differently
 * typed literals cannot express. It lives here rather than beside the component because a module
 * that exports both a component and a helper cannot fast-refresh.
 */
export function seedPayload<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  variables: TQuery['variables'],
  data: TQuery['rawResponse'],
): SeedPayload {
  return { query, variables, data: data as PayloadData };
}
