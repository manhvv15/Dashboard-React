import { WalletItem } from '@/types/loyalty';
import { formatNumberByCurrency } from '@/utils/common';

const PeriodDeposit = ({ data }: { data: WalletItem }) => {
  return (
    <div className="flex h-full items-center">
      {<span>{formatNumberByCurrency(data.priodDeposit, data.currency)}</span>}
    </div>
  );
};
export default PeriodDeposit;
