import { Route, Routes } from 'react-router-dom';

import BidHistory from '@/pages/configurations/bid/manage-bid/bid-history';
import ManageBidding from '@/pages/configurations/bid/manage-bid/bidding';
import LoseBidding from '@/pages/configurations/bid/manage-bid/lose';
import WonBidding from '@/pages/configurations/bid/manage-bid/won';
import ManageSniperBid from '@/pages/configurations/bid/manage-sniper-bid';
import AddNick from '@/views/configuration/bid-and-offer/setting/add-nick';
import BidConfig from '@/views/configuration/bid-and-offer/setting/bid-config';
import ManageNick from '@/views/configuration/bid-and-offer/setting/manage-nick';

export const BidRoutes = () => {
  return (
    <Routes>
      <Route path="manage-bid">
        <Route path="bidding" element={<ManageBidding />} />
        <Route path="won" element={<WonBidding />} />
        <Route path="lose" element={<LoseBidding />} />
        <Route path="bid-history" element={<BidHistory />} />
      </Route>

      <Route path="manage-sniper-bid">
        <Route index element={<ManageSniperBid />} />
      </Route>

      <Route path="setting">
        <Route path="manage-nick" element={<ManageNick />} />
        <Route path="manage-nick/add-nick" element={<AddNick />} />
        <Route path="bid-config" element={<BidConfig />} />
      </Route>
    </Routes>
  );
};
