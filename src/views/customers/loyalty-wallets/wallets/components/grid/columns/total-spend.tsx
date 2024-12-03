import { WalletItem } from '@/types/loyalty';
import { formatNumberByCurrency } from '@/utils/common';

const TotalSpend = ({ data }: { data: WalletItem }) => {
  return (
    <div className="flex h-full items-center">
      {<span>{formatNumberByCurrency(data.totalSpend, data.currency)}</span>}
    </div>
  );
};
export default TotalSpend;
