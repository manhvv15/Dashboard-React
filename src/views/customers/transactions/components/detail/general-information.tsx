import { useTranslation } from 'react-i18next';

import TagTypeTransaction from '@/components/commons/tag-type-transaction';
import { LocaleNamespace } from '@/constants/enums/common';
import { dateFormat } from '@/constants/variables/common';
import { TransactionDetail } from '@/types/payment/transaction';
import { formatDate, methodTransaction } from '@/utils/common';

interface props {
  dataDetailTransaction: TransactionDetail;
}
const GeneralInformation = ({ dataDetailTransaction }: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const { t: common } = useTranslation(LocaleNamespace.Common);
  return (
    <div className="flex gap-3 p-3 flex-col bg-ic-light rounded-lg w-[630px]">
      <div className="font-medium text-sm leading-5">
        <span> {customer('customer.transaction.generationInfo')}</span>
      </div>
      <div className="p-3 flex flex-col gap-1 bg-white border border-dashed border-ic-ink-3s rounded-lg overflow-y-auto scrollbar max-h-[122px]">
        <div className="flex gap-1 flex-col ">
          <div className="flex items-center justify-between w-full">
            <span>{common('createdTime')}</span>
            <span>
              {formatDate({
                time: dataDetailTransaction.createdAt,
                dateFormat: dateFormat.MM_DD_YYYY_HH_mm,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span>{customer('customer.transaction.table.header.type')}</span>
            <TagTypeTransaction status={dataDetailTransaction.status} type={dataDetailTransaction.type} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>{common('paymentMethod')}</span>
          <span>{methodTransaction(dataDetailTransaction?.paymentMethod, common)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="h-full">{customer('customer.transaction.table.header.paymentAccount')}</span>
          <span className="text-right flex flex-1">{dataDetailTransaction?.receiveAccount}</span>
        </div>
      </div>
    </div>
  );
};
export default GeneralInformation;
