import { useContext } from 'react';

import { AppContext } from '@/providers/app/context';

export const useApp = () => {
  return useContext(AppContext);
};
