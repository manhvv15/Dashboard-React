import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import UserManagement from '@/views/users';
import DetailUser from '@/views/users/detail';
import InviteUsers from '@/views/users/invite-users';

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.USERS} action={ACTIONS.VIEW} />}>
        <Route index element={<UserManagement />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.USERS} action={ACTIONS.INVITE_USERS} />}>
        <Route path="invite-users" element={<InviteUsers />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.USERS} action={ACTIONS.VIEW} />}>
        <Route path="detail/:id" element={<DetailUser />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
