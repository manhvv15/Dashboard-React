import { Suspense } from 'react';

import { LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { Outlet } from 'react-router-dom';

import NavigationBar from '@/components/layouts/navigation-bar';
import { useMenu } from '@/hooks/use-menu';

const MainLayout = () => {
  const menu = useMenu();

  return (
    <NavigationBar groups={menu}>
      <Suspense fallback={<LoadingOverlay className="w-full h-full" isLoading />}>
        <Outlet />
      </Suspense>
    </NavigationBar>
  );
};

export default MainLayout;
