import { useContext } from 'react';

import { NavigationBarContext } from '@/components/layouts/navigation-bar/context';

export const useNavigationBar = () => {
  return useContext(NavigationBarContext);
};
