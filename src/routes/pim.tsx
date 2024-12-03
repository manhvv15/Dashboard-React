import { Route, Routes } from 'react-router-dom';

import ManageProxy from '@/pages/configurations/proxy-settings/manage-proxy';
import ProxyConfiguration from '@/pages/configurations/proxy-settings/proxy-configuration';

export const PimRoutes = () => {
  return (
    <Routes>
      <Route path="manage-proxy" element={<ManageProxy />} />
      <Route path="proxy-configuration" element={<ProxyConfiguration />} />
    </Routes>
  );
};
