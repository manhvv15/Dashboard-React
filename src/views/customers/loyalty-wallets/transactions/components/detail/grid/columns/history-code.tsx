import { TransactionHistoryItem } from '@/types/loyalty';
import { Tooltip } from '@ichiba/ichiba-core-ui';

const HistoryCode = ({ data }: { data: TransactionHistoryItem }) => {
  return (
    <div>
      {data.code && (
        <div className="flex flex-1 w-[300px]">
          <Tooltip content={data.code}>
            <div className="text-ic-primary-6s truncate overflow-hidden max-w-[130px] text-sm">{data.code}</div>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
export default HistoryCode;
