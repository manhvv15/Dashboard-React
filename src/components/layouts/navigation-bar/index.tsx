import { forwardRef, useCallback, useState } from 'react';

import { trim } from 'lodash';
import { useLocation } from 'react-router-dom';

import { NavigationComboBarProps } from '@/types/navigation';

import { NavigationBarContext } from './context';
import MenuLevel1 from './menu-level-1';

import Header from '../header';

const NavigationBar = forwardRef<unknown, NavigationComboBarProps>(({ children, groups }) => {
  const [menuExpansion, setMenuExpansion] = useState(true);
  const location = useLocation();

  const toggleMenuExpansion = () => {
    setMenuExpansion((prevState) => !prevState);
  };

  const isRouteMatched = useCallback(
    (target?: string, options?: { exact?: boolean }) => {
      if (!target || /^#/.test(target)) return false; // check is hash only

      const sourceParts = [trim(location.pathname, '/').toLowerCase()].filter(Boolean);
      const transformSource = sourceParts.length ? `/${sourceParts.join('/')}/` : '/';

      const targetParts = [trim(target, '/').toLowerCase()].filter(Boolean);
      const transformTarget = targetParts.length ? `/${targetParts.join('/')}/` : '/';

      return options?.exact ? transformSource === transformTarget : transformSource.startsWith(transformTarget);
    },
    [location.pathname],
  );

  return (
    <NavigationBarContext.Provider
      value={{
        menuExpansion,
        toggleMenuExpansion,
        groups,
        isRouteMatched,
      }}
    >
      <div className="h-screen w-screen overflow-hidden flex">
        <MenuLevel1 />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex items-stretch flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden z-0 relative">
              <div className="h-full overflow-auto scrollbar bg-ic-ink-1s">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </NavigationBarContext.Provider>
  );
});

export default NavigationBar;
