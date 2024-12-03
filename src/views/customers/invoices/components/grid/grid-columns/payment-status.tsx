import { Tag } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { PaymentStatusEnum } from '@/types/enums/payment';
import { InvoiceManagement } from '@/types/payment/invoice';

const renderStatus = (status: PaymentStatusEnum) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  switch (status) {
    case PaymentStatusEnum.Paid:
      return (
        <Tag
          value={t('paid')}
          variant="success"
          className="border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded text-ic-light bg-ic-green-6s  w-max"
        />
      );
    case PaymentStatusEnum.Unpaid:
      return (
        <Tag
          value={t('notPaid')}
          variant="error"
          className="border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-red-6s text-ic-light w-max"
        />
      );
    default:
      break;
  }
};

const PaymentStatus = ({ data }: { data: InvoiceManagement }) => {
  return <div className="flex items-center h-full w-full justify-center">{renderStatus(data.paymentStatus)}</div>;
};
export default PaymentStatus;
