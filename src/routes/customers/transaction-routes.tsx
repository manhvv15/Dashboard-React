import { Route, Routes } from 'react-router-dom';

import RequirePermission from '@/components/commons/RequirePermission';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import Transactions from '@/pages/cutomers/transactions';
import DetailTransaction from '@/views/customers/transactions/detail';

const RouteTransactions = () => {
  return (
    <Routes>
      <Route element={<RequirePermission object={OBJECTS.TRANSACTIONS} action={ACTIONS.VIEW} />}>
        <Route index element={<Transactions />} />
        <Route path=":id/detail" element={<DetailTransaction />} />
      </Route>
    </Routes>
  );
};
export default RouteTransactions;
