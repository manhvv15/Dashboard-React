import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import CustomerManagement from '@/views/customer';
import DetailUser from '@/views/users/detail';
import InviteUsers from '@/views/users/invite-users';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.CUSTOMERS} action={ACTIONS.VIEW} />}>
        <Route index element={<CustomerManagement />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.CUSTOMERS} action={ACTIONS.CREATE} />}>
        <Route path="invite-users" element={<InviteUsers />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.CUSTOMERS} action={ACTIONS.VIEW} />}>
        <Route path="detail/:id" element={<DetailUser />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
