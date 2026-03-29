import { createContext } from 'react';
import type { Environment } from 'relay-runtime';

export const RelayContext = createContext<Environment | null>(null);