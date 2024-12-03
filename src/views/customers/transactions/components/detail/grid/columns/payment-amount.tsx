import { TransactionInvoices } from '@/types/payment/transaction';
import { formatNumberByCurrency } from '@/utils/common';

const PaymentAmount = ({ data, currency }: { data: TransactionInvoices; currency: string }) => {
  return <div>{data.totalAmount && <span>{formatNumberByCurrency(Number(data.totalAmount), currency)}</span>}</div>;
};
export default PaymentAmount;
