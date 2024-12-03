import { TransactionManagement } from '@/types/payment/transaction';

const PaymentAccount = ({ data }: { data: TransactionManagement }) => {
  return (
    <>
      {data.receiveAccount && (
        <div className="flex items-center h-full">
          <span>{data.receiveAccount}</span>
        </div>
      )}
    </>
  );
};
export default PaymentAccount;
