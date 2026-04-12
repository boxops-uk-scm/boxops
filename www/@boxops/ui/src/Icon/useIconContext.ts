import * as React from 'react';

import { IconContext } from './IconContext';

export function useIconContext() {
  return React.useContext(IconContext);
}
