import * as React from 'react';

import { PortalContainerContext } from './PortalContainerContext';

export function PortalContainerProvider({
  value,
  children,
}: React.PropsWithChildren<{
  /** Element to portal overlays into. `null` falls back to `document.body`. */
  value: HTMLElement | null;
}>) {
  return <PortalContainerContext.Provider value={value}>{children}</PortalContainerContext.Provider>;
}
