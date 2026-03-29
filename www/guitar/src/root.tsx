import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./global.css";
import { getClientEnvironment } from "./relay/createEntryPointRoute";
import { useContext, useMemo } from "react";
import { RelayContext } from "./relay/context";
import { RelayEnvironmentProvider } from "react-relay";

declare global {
  interface Window {
    __RELAY_DATA__: Record<string, unknown>;
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/virtual:stylex.css" />
        <link rel="stylesheet" href="https://use.typekit.net/qzy1elm.css" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const serverEnv = useContext(RelayContext);

  const environment = useMemo(() => {
      if (typeof document === "undefined") {
        if (!serverEnv) throw new Error("Server environment not found in tunnel");
        return serverEnv;
      } else {
        return getClientEnvironment((window as Window & typeof globalThis).__RELAY_DATA__);
      }
    }, [serverEnv]);

  const relayData = environment.getStore().getSource().toJSON();

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Outlet />
      {relayData && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__RELAY_DATA__ = ${JSON.stringify(relayData)};`,
          }}
        />
      )}
    </RelayEnvironmentProvider>);
}