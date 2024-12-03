import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import ManagermentInvoices from '@/views/customers/invoices';
import InvoiceDetail from '@/views/customers/invoices/detail';

export const InvoiceRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.INVOICES} action={ACTIONS.VIEW} />}>
        <Route index element={<ManagermentInvoices />} />
        <Route path=":id/detail" element={<InvoiceDetail />} />
      </Route>
    </Routes>
  );
};
