import TagTypeTransaction from '@/components/commons/tag-type-transaction';
import { TransactionManagement } from '@/types/payment/transaction';

const Type = ({ data }: { data: TransactionManagement }) => {
  return (
    <>
      <div className="flex h-full items-center">
        <TagTypeTransaction status={data.status} type={data.type} />
      </div>
    </>
  );
};
export default Type;
