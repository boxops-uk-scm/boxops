import express from "express";
import http from "http";
import { createRequestHandler } from "@react-router/express";
import { ServerBuild } from "react-router";
import { Environment, FetchFunction, Network, RecordSource, Store } from "relay-runtime";

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

export function getServerEnvironment() {
  return new Environment({
    network: createNetwork(),
    store: new Store(new RecordSource()),
    isServer: true
  });
}

const app = express();
const server = http.createServer(app);

const vite = await import("vite").then((v) =>
  v.createServer({
    server: {
      middlewareMode: true,
      cors: { origin: "*" },
      allowedHosts: true,
      hmr: {
        server,
      },
    },
    appType: "custom",
  }),
);

app.use(vite.middlewares);

app.all(
  /.*/,
  createRequestHandler({
    build: async () => {
      return (await vite.ssrLoadModule(
        "virtual:react-router/server-build",
      )) as ServerBuild;
    },
    getLoadContext() {
      return {
        relayEnvironment: getServerEnvironment(), 
      };
    },
  }),
);

app.listen(3020, "0.0.0.0", () => {
  console.log("🚀 Server listening on http://localhost:3020");
});