import * as Phosphor from '@phosphor-icons/react';
import * as React from 'react';

import { IconContext } from './IconContext';

export function IconContextProvider({ children, weight }: React.PropsWithChildren<{ weight: Phosphor.IconWeight }>) {
  return <IconContext.Provider value={{ weight }}>{children}</IconContext.Provider>;
}
