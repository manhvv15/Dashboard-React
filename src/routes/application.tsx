import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import ApplicationManagement from '@/views/applications';
import CreateApplication from '@/views/applications/create';
import EditApplication from '@/views/applications/edit';

const ApplicationRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.APPLICATIONS} action={ACTIONS.VIEW} />}>
        <Route index element={<ApplicationManagement />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.APPLICATIONS} action={ACTIONS.CREATE} />}>
        <Route path="create" element={<CreateApplication />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.APPLICATIONS} action={ACTIONS.EDIT} />}>
        <Route path="edit/:id" element={<EditApplication />} />
      </Route>
    </Routes>
  );
};

export default ApplicationRoutes;
