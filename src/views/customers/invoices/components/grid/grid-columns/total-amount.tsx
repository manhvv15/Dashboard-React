import { InvoiceManagement } from '@/types/payment/invoice';
import { formatNumber } from '@/utils/common';

const TotalAmount = ({ data }: { data: InvoiceManagement }) => {
  return (
    <div className="flex items-center justify-end h-full ">
      {data?.totalAmount && (
        <p
          title={data?.totalAmount.toString() || ''}
          className=" text-sm font-normal leading-5 text-ic-ink-6s text-right"
        >
          {data ? `${formatNumber(Number(data.totalAmount))} ${data.currencyCode}` : '-'}
        </p>
      )}
    </div>
  );
};
export default TotalAmount;
