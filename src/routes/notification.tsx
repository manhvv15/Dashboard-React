import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import NotificationManagement from '@/views/notifications';
import CreateNotification from '@/views/notifications/create';
import UpdateNotification from '@/views/notifications/edit';
import NoptificationTypeTemplate from '@/views/notifications/notification-type-templete';

const NotificationRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.NOTIFICATIONS} action={ACTIONS.VIEW} />}>
        <Route index element={<NotificationManagement />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.NOTIFICATIONS} action={ACTIONS.CREATE} />}>
        <Route path="create" element={<CreateNotification />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.NOTIFICATIONS} action={ACTIONS.EDIT} />}>
        <Route path="edit/:id" element={<UpdateNotification />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.NOTIFICATIONS} action={ACTIONS.EDIT} />}>
        <Route path="templates/:id" element={<NoptificationTypeTemplate />} />
      </Route>
    </Routes>
  );
};

export default NotificationRoutes;
