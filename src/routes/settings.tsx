import { Route, Routes } from 'react-router-dom';

import SettingUsers from '@/pages/settings/users';

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="users" element={<SettingUsers />} />
    </Routes>
  );
};

export default SettingsRoutes;
