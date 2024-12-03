import { Tag } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { PaymentTransactionStatusEnum } from '@/types/enums/transaction';
import { TransactionManagement } from '@/types/payment/transaction';

const Status = ({ data }: { data: TransactionManagement }) => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const renderStatus = (status?: PaymentTransactionStatusEnum) => {
    switch (status) {
      case PaymentTransactionStatusEnum.Completed:
        return (
          <Tag
            value={t('completed')}
            variant="success"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded text-ic-light bg-ic-green-6s"
          />
        );
      case PaymentTransactionStatusEnum.Canceled:
        return (
          <Tag
            value={t('canceled')}
            variant="error"
            className="border min-w-[90px] justify-center flex-1 border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-red-6s text-ic-light "
          />
        );
      case PaymentTransactionStatusEnum.Created:
        return (
          <Tag
            value={t('created')}
            variant="blue"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-blue-6s text-ic-light "
          />
        );
      case PaymentTransactionStatusEnum.Failed:
        return (
          <Tag
            value={t('failed')}
            variant="error"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-red-6s text-ic-light "
          />
        );
      case PaymentTransactionStatusEnum.Refunded:
        return (
          <Tag
            value={t('refunded')}
            variant="warning"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-orange-6s text-ic-light "
          />
        );
      default:
        return (
          <Tag
            value={t('completed')}
            variant="success"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded text-ic-light bg-ic-green-6s"
          />
        );
    }
  };
  return (
    <>
      <div className="flex h-full items-center">
        {data?.status === PaymentTransactionStatusEnum.Completed ? (
          <Tag
            value={t('completed')}
            variant="success"
            className="min-w-[90px] justify-center border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded text-ic-light bg-ic-green-6s"
          />
        ) : (
          renderStatus(data?.status)
        )}
      </div>
    </>
  );
};
export default Status;
