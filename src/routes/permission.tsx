import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { OBJECTS, ACTIONS } from '@/constants/variables/common';
import ManagementPermissions from '@/views/management-permissions';

const PermissionRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.PERMISSIONS} action={ACTIONS.VIEW} />}>
        <Route index element={<ManagementPermissions />} />
      </Route>
    </Routes>
  );
};

export default PermissionRoutes;
