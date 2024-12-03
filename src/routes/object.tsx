import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { OBJECTS, ACTIONS } from '@/constants/variables/common';
import ObjectManagement from '@/views/object';

const ObjectRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.PERMISSIONS} action={ACTIONS.VIEW} />}>
        <Route index element={<ObjectManagement />} />
      </Route>
    </Routes>
  );
};

export default ObjectRoutes;
