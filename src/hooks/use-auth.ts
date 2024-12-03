import { useContext } from 'react';

import { AuthContext } from '@/providers/auth/context';

export const useAuth = () => {
  return useContext(AuthContext);
};
