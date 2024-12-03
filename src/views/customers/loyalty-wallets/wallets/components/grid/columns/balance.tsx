import { WalletItem } from '@/types/loyalty';
import { formatNumberByCurrency } from '@/utils/common';

const Balance = ({ data }: { data: WalletItem }) => {
  return (
    <div className="flex h-full items-center">{<span>{formatNumberByCurrency(data.balance, data.currency)}</span>}</div>
  );
};
export default Balance;
