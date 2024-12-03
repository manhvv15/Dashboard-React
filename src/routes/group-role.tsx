import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import GroupRoleManagement from '@/views/group-roles';
import DetailGroupRole from '@/views/group-roles/detail';

const GroupRoleRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.GROUP_ROLE} action={ACTIONS.VIEW} />}>
        <Route index element={<GroupRoleManagement />} />
        <Route path="detail/:id" element={<DetailGroupRole />} />
      </Route>
    </Routes>
  );
};

export default GroupRoleRoutes;
