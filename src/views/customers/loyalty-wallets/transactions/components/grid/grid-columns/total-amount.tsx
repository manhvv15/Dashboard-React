import { TransactionItem } from '@/types/loyalty';
import { formatNumber } from '@/utils/common';
import clsx from 'clsx';

const TotalAmount = ({ data }: { data: TransactionItem }) => {
  return (
    <div className="flex h-full items-center justify-end">
      {data?.amount && (
        <p
          title={data?.amount.toString() || ''}
          className={clsx(
            ' text-sm font-normal leading-5  text-right',
            data.amount < 0 ? 'text-ic-red-6s' : 'text-ic-ink-6s',
          )}
        >
          {data ? `${formatNumber(Number(data.amount))} ${data.currency}` : '-'}
        </p>
      )}
    </div>
  );
};
export default TotalAmount;
