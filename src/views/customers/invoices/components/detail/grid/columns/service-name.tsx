import { ItemInvoice } from '@/types/payment/invoice';

const ServiceName = ({ data }: { data: ItemInvoice }) => {
  return (
    <div className="flex gap-1">
      <span>{data.referenceCode}</span>
    </div>
  );
};
export default ServiceName;
