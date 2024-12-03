import { TransactionItem } from '@/types/loyalty';
import { Tooltip } from '@ichiba/ichiba-core-ui';

const ReferenceCode = ({ data }: { data: TransactionItem }) => {
  return (
    <>
      {data.referenceCode && (
        <div className="flex flex-1 w-[300px]">
          <Tooltip content={data.referenceCode}>
            <div className="truncate overflow-hidden max-w-[300px] items-center">{data.referenceCode}</div>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default ReferenceCode;
