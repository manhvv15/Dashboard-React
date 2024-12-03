import { Link } from 'react-router-dom';

import CopyToClipboard from '@/components/commons/copy-to-clip-board';
import { TransactionManagement } from '@/types/payment/transaction';
import { formatDate } from '@/utils/common';
import { Tooltip } from '@ichiba/ichiba-core-ui';

const TransactionCode = ({ data }: { data: TransactionManagement }) => {
  return (
    <div className="px-2 flex gap-3 flex-col ">
      <div className="flex gap-1 items-center">
        <div className="uppercase overflow-hidden max-[300px] truncate text-sm font-normal leading-5 text-ic-primary-6s flex items-center justify-between">
          <Tooltip content={data.code}>
            <div className="max-w-[150px] truncate">
              <Link to={`/customer/transactions/${data.id}/detail`}> {data.code ?? '-'}</Link>
            </div>
          </Tooltip>
        </div>
        <div>
          <CopyToClipboard code={data.code} />
        </div>
      </div>
      {data.completionDate && (
        <p title={data.code} className="text-sm font-normal leading-5 text-ic-ink-6s">
          {data.completionDate ? formatDate({ time: data.completionDate, dateFormat: 'dd/MM/yyyy hh:mm' }) : '-'}
        </p>
      )}
    </div>
  );
};
export default TransactionCode;
