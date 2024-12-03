import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import BrandingManagement from '@/views/branding';

const NotificationRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.BRANDING} action={ACTIONS.VIEW} />}>
        <Route index element={<BrandingManagement />} />
      </Route>
    </Routes>
  );
};

export default NotificationRoutes;
