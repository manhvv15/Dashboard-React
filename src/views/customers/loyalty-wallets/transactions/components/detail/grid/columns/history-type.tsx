import TagTypeTransactionLoyalty from '@/components/commons/tag-type-transaction-loyalty';
import { TransactionHistoryItem } from '@/types/loyalty';

const HistoryType = ({ data }: { data: TransactionHistoryItem }) => {
  return (
    <>
      <div className="flex h-full items-center">
        <TagTypeTransactionLoyalty status={data.status} type={data.type} />
      </div>
    </>
  );
};
export default HistoryType;
