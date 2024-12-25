import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { OBJECTS, ACTIONS } from '@/constants/variables/common';
import ManagementPermissions from '@/views/management-permissions';
import CreateMultiplePermission from '@/views/permissions/create';

const PermissionRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.PERMISSIONS} action={ACTIONS.VIEW} />}>
        <Route index element={<ManagementPermissions />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.PERMISSIONS} action={ACTIONS.CREATE} />}>
        <Route path="create" element={<CreateMultiplePermission />} />
      </Route>
    </Routes>
  );
};

export default PermissionRoutes;
