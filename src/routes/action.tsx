import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { OBJECTS, ACTIONS } from '@/constants/variables/common';
import ActionManagement from '@/views/actions';

const ActionRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.PERMISSIONS} action={ACTIONS.VIEW} />}>
        <Route index element={<ActionManagement />} />
      </Route>
    </Routes>
  );
};

export default ActionRoutes;
