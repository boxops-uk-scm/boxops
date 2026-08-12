import * as React from 'react';

import { PortalContainerContext } from './PortalContainerContext';

export function usePortalContainer(): HTMLElement | null {
  return React.useContext(PortalContainerContext);
}
