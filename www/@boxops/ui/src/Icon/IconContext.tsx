import * as Phosphor from '@phosphor-icons/react';
import * as React from 'react';

export type IconContextType = {
  weight?: Phosphor.IconWeight;
};

export const IconContext = React.createContext<IconContextType>({
  weight: 'regular',
});
