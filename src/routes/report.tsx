import { Route, Routes } from 'react-router-dom';
import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import ReportManagement from '@/views/reports';
import CreateReport from '@/views/reports/create';
import UpdateReport from '@/views/reports/edit';

const ReportRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.REPORTS} action={ACTIONS.VIEW} />}>
        <Route index element={<ReportManagement />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.REPORTS} action={ACTIONS.CREATE} />}>
        <Route path="create" element={<CreateReport />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.REPORTS} action={ACTIONS.CREATE} />}>
        <Route path="edit/:id" element={<UpdateReport />} />
      </Route>
    </Routes>
  );
};

export default ReportRoutes;
