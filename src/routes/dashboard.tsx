import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import Dashboard from '@/pages/dashboard';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.ANALYTICS} action={ACTIONS.VIEW} />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
