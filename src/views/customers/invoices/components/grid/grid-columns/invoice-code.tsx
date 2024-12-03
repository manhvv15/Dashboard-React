import { Link } from 'react-router-dom';

import CopyToClipboard from '@/components/commons/copy-to-clip-board';
import { InvoiceManagement } from '@/types/payment/invoice';
import { formatDate } from '@/utils/common';
import { Tooltip } from '@ichiba/ichiba-core-ui';

export default function InvoiceCode({ data }: { data: InvoiceManagement }) {
  return (
    <div className="px-2 flex gap-3 flex-col ">
      <div className="flex justify-start items-center gap-1">
        <div className=" overflow-hidden max-[300px] truncate text-sm font-normal leading-5 text-ic-primary-6s flex items-center justify-between">
          <Tooltip content={data.code}>
            <div className="max-w-[290px] truncate">
              <Link to={`/customer/invoices/${data.id}/detail`}> {data.code ?? '-'}</Link>
            </div>
          </Tooltip>
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
}
