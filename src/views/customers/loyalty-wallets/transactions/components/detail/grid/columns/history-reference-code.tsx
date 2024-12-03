import { TransactionHistoryItem } from '@/types/loyalty';
import { Tooltip } from '@ichiba/ichiba-core-ui';

const HistoryReferenceCode = ({ data }: { data: TransactionHistoryItem }) => {
  return (
    <div>
      {data.referenceCode && (
        <div className="flex flex-1 w-[300px]">
          <Tooltip content={data.referenceCode}>
            <div className="text-ic-primary-6s truncate overflow-hidden max-w-[180px] text-sm">
              {data.referenceCode}
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
export default HistoryReferenceCode;
