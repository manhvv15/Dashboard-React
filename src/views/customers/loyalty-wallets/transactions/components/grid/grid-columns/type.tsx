import TagTypeTransactionLoyalty from '@/components/commons/tag-type-transaction-loyalty';
import { TransactionItem } from '@/types/loyalty';

const Type = ({ data }: { data: TransactionItem }) => {
  return (
    <>
      <div className="flex h-full items-center">
        <TagTypeTransactionLoyalty status={data.status} type={data.type} />
      </div>
    </>
  );
};
export default Type;
