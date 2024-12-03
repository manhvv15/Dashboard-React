import { Route, Routes } from 'react-router-dom';

import ManagermentLoyaltyWallet from '@/pages/cutomers/loyalty-wallets';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { InvoiceRoutes } from './invoice-routes';
import RouteTransactions from './transaction-routes';

export const CustomersRoutes = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.INVOICES} action={ACTIONS.VIEW} />}>
        <Route path="invoices/*" element={<InvoiceRoutes />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.TRANSACTIONS} action={ACTIONS.VIEW} />}>
        <Route path="transactions/*" element={<RouteTransactions />} />
      </Route>
      <Route element={<RequirePermission object={OBJECTS.LOYALTY_WALLET} action={ACTIONS.VIEW} />}>
        <Route path="loyalty-wallet/*" element={<ManagermentLoyaltyWallet />} />
      </Route>
    </Routes>
  );
};
