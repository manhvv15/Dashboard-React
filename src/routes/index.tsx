import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/main';
import AuthProvider from '@/providers/auth';
import Status403 from '@/views/403';
import EmailConfirm from '@/views/users/email-confirm';

import ActionRoutes from './action';
import ApplicationRoutes from './application';
import ApplicationGroupRoutes from './application-group';
import ReportRoutes from './report';
import BrandingRoutes from './branding';
import ConfigurationRouters from './configuration';
import CustomerRoutes from './customer';
import { CustomersRoutes } from './customers/customer';
import DashboardRoutes from './dashboard';
import GroupRoleRoutes from './group-role';
import NotificationRoutes from './notification';
import ObjectRoutes from './object';
import PermissionRoutes from './permission';
import RoleRoutes from './role';
import UserRoutes from './user';
import WorkspaceRoutes from './workspace';

const RouterView = () => {
  return (
    <ErrorBoundary FallbackComponent={() => <></>}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthProvider />}>
            <Route element={<MainLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard/*" element={<DashboardRoutes />} />
              <Route path="customer/*" element={<CustomersRoutes />} />
              <Route path="customers/*" element={<CustomerRoutes />} />
              <Route path="user-and-roles/group-roles/*" element={<GroupRoleRoutes />} />
              <Route path="user-and-roles/roles/*" element={<RoleRoutes />} />
              <Route path="user-and-roles/users/*" element={<UserRoutes />} />
              <Route path="user-and-roles/actions/*" element={<ActionRoutes />} />
              <Route path="user-and-roles/permissions/*" element={<PermissionRoutes />} />
              <Route path="user-and-roles/objects/*" element={<ObjectRoutes />} />
              <Route path="configuration/*" element={<ConfigurationRouters />} />
              <Route path="environment-settings/applications/*" element={<ApplicationRoutes />} />
              <Route path="environment-settings/application-groups/*" element={<ApplicationGroupRoutes />} />
              <Route path="environment-settings/notification/*" element={<NotificationRoutes />} />
              <Route path="environment-settings/branding/*" element={<BrandingRoutes />} />
              <Route path="workspaces/*" element={<WorkspaceRoutes />} />
              <Route path="environment-settings/reports/*" element={<ReportRoutes />} />
              <Route path="*" element={<div>Not Found</div>} />
            </Route>
            <Route path="email-confirm/*" element={<EmailConfirm />} />
            <Route path="forbidden" element={<Status403 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default RouterView;
