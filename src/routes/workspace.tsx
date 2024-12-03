import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import WorkspaceManagement from '@/views/workspaces';
import DetailWorkspace from '@/views/workspaces/detail';

const WorkspaceRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.WORKSPACES} action={ACTIONS.VIEW} />}>
        <Route index element={<WorkspaceManagement />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.WORKSPACES} action={ACTIONS.VIEW} />}>
        <Route path=":id/detail" element={<DetailWorkspace />} />
      </Route>
    </Routes>
  );
};

export default WorkspaceRoutes;
