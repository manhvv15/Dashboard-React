import CopyToClipboard from '@/components/commons/copy-to-clip-board';
import { TransactionManagement } from '@/types/payment/transaction';
import { Tooltip } from '@ichiba/ichiba-core-ui';

const ReferenceCode = ({ data }: { data: TransactionManagement }) => {
  return (
    <>
      {data.referenceCode && (
        <div className="flex h-full items-center">
          <div className="flex flex-row items-center gap-1">
            <div className=" flex flex-1">
              <Tooltip content={data.referenceCode}>
                <div className="truncate overflow-hidden max-w-[190px]">{data.referenceCode}</div>
              </Tooltip>
            </div>
            <CopyToClipboard code={data.referenceCode} />
          </div>
        </div>
      )}
    </>
  );
};

export default ReferenceCode;
