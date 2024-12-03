import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { OBJECTS, ACTIONS } from '@/constants/variables/common';
import RoleManagement from '@/views/roles';
import CreateRole from '@/views/roles/create';
import DuplicateRole from '@/views/roles/duplicate';
import EditRole from '@/views/roles/edit';

const OrganizationRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.ROLES} action={ACTIONS.VIEW} />}>
        <Route index element={<RoleManagement />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.ROLES} action={ACTIONS.CREATE} />}>
        <Route path="create" element={<CreateRole />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.ROLES} action={ACTIONS.EDIT} />}>
        <Route path="edit/:id" element={<EditRole />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.ROLES} action={ACTIONS.CREATE} />}>
        <Route path="duplicate/:id" element={<DuplicateRole />} />
      </Route>
    </Routes>
  );
};

export default OrganizationRoutes;
