import { Route, Routes } from 'react-router-dom';
import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import ReportGroupManagement from '@/views/report-groups';
import CreateReportGroup from '@/views/report-groups/create';
import UpdateReportGroup from '@/views/report-groups/edit';

const ReportGroupRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.REPORT_GROUPS} action={ACTIONS.VIEW} />}>
        <Route index element={<ReportGroupManagement />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.REPORT_GROUPS} action={ACTIONS.CREATE} />}>
        <Route path="create" element={<CreateReportGroup />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.REPORT_GROUPS} action={ACTIONS.CREATE} />}>
        <Route path="edit/:id" element={<UpdateReportGroup />} />
      </Route>
    </Routes>
  );
};

export default ReportGroupRoutes;
