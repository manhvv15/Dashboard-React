import { Link } from 'react-router-dom';

import CopyToClipboard from '@/components/commons/copy-to-clip-board';
import { TransactionManagement } from '@/types/payment/transaction';
import { formatDate } from '@/utils/common';

const TransactionCode = ({ data }: { data: TransactionManagement }) => {
  return (
    <div className="px-2 flex gap-3 flex-col ">
      <div className="flex justify-start items-center gap-1">
        <div
          title={data.code}
          className="uppercase text-sm font-normal leading-5 text-ic-primary-6s flex items-center justify-between"
        >
          <Link to={`/customer/transactions/${data.id}/detail`}> {data.code ?? '-'}</Link>
        </div>
        <div>
          <CopyToClipboard code={data.code} />
        </div>
      </div>
      {data.createdAt && (
        <p title={data.code} className="text-sm font-normal leading-5 text-ic-ink-6s">
          {data.createdAt ? formatDate({ time: data.createdAt, dateFormat: 'dd/MM/yyyy hh:mm' }) : '-'}
        </p>
      )}
    </div>
  );
};
export default TransactionCode;
