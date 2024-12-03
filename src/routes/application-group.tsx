import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import ApplicationGroupManagement from '@/views/application-groups';

const ApplicationGroupRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.APPLICATION_GROUPS} action={ACTIONS.VIEW} />}>
        <Route index element={<ApplicationGroupManagement />} />
      </Route>
    </Routes>
  );
};

export default ApplicationGroupRoutes;
