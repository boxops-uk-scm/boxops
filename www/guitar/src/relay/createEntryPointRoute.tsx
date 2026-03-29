import { loadQuery, fetchQuery as fetchRelay, type GraphQLTaggedNode, type PreloadedQuery } from 'react-relay';
import { useLocation, useParams, type AppLoadContext, type LoaderFunctionArgs } from 'react-router';
import type RelayModernEnvironment from 'relay-runtime/lib/store/RelayModernEnvironment';
import { Environment, Network, RecordSource, Store, type FetchFunction } from 'relay-runtime';
import { useContext } from 'react';
import { RelayContext } from './context';

declare module 'react-router' {
  interface AppLoadContext {
    relayEnvironment: RelayModernEnvironment;
  }
}

const fetchQuery: FetchFunction = async (params, variables) => {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  const json = await response.json();

  if (Array.isArray(json.errors)) {
    console.error(json.errors);
    throw new Error(
      `Error fetching GraphQL query '${params.name}' with variables '${JSON.stringify(variables)}'`
    );
  }

  return json;
};

export const createNetwork = () => Network.create(fetchQuery);

export interface EntryPointRouteConfig {
  queries: Record<string, GraphQLTaggedNode>;
  getQueryVariables: (
    params: Record<string, string | undefined>,
    searchParams: URLSearchParams,
  ) => Record<string, any>;
  Component: React.ComponentType<any>;
}

let clientEnv: RelayModernEnvironment | null = null;

export function getClientEnvironment(initialRecords?: Record<string, any>) {
  if (!clientEnv) {
    const source = new RecordSource(initialRecords || {});
    clientEnv = new Environment({
      network: createNetwork(),
      store: new Store(source),
    });
  }

  return clientEnv;
}

export function createEntryPointRoute(config: EntryPointRouteConfig) {
  const loader = async ({ request,  params, context }: LoaderFunctionArgs<AppLoadContext>) => {
    const env = context.relayEnvironment;
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const vars = config.getQueryVariables(params, searchParams);

    const fetchPromises = Object.values(config.queries).map((query) => {
      return fetchRelay(env, query, vars).toPromise();
    });

    await Promise.all(fetchPromises);
  }

  const Component = () => {
    const serverEnv = useContext(RelayContext);
    const env = (typeof document === "undefined")
      ? serverEnv
      : getClientEnvironment();

    const location = useLocation();
    const params = useParams();
    const vars = config.getQueryVariables(params, new URLSearchParams(location.search));

    const fetchPolicy = 'store-only';
    const queryRefs: Record<string, PreloadedQuery<any>> = {};
    for (const [key, query] of Object.entries(config.queries)) {
      queryRefs[key] = loadQuery(env as RelayModernEnvironment, query, vars, { fetchPolicy });
    }

    return <config.Component {...queryRefs} />;
  };

  return { loader, Component };
}