import { createContext } from 'react';

import { NavigationGroupMenu } from '@/types/navigation';

interface NavigationBarContextProps {
  menuExpansion: boolean;
  toggleMenuExpansion: () => void;
  groups: NavigationGroupMenu[];
  isRouteMatched: (
    target?: string,
    options?: {
      exact?: boolean;
    },
  ) => boolean;
}

export const NavigationBarContext = createContext({} as NavigationBarContextProps);
