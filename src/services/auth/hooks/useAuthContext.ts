import { useContext } from 'react';

import { AuthContext } from '../authContext';
import type { AuthContextType } from '../types';

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('AuthContext is not found');
  }
  return context;
}
