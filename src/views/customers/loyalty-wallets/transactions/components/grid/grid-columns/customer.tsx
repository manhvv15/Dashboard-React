import { TransactionItem } from '@/types/loyalty';

const Customer = ({ data }: { data: TransactionItem }) => {
  return (
    <div>
      {data.userName && (
        <span className="text-sm">
          {data.userName && `${data.userName}`}
          {data.userCode && ` - ${data.userCode}`}
        </span>
      )}
    </div>
  );
};
export default Customer;
