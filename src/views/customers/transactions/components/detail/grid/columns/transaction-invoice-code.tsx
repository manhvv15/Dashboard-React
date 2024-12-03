import { TransactionInvoices } from '@/types/payment/transaction';

const TransactionInvoiceCode = ({ data }: { data: TransactionInvoices }) => {
  return <div className="text-ic-primary-6s text-sm leading-5">{data.code && <span>{data.code}</span>}</div>;
};
export default TransactionInvoiceCode;
