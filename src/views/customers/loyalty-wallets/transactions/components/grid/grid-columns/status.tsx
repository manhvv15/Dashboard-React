import { Tag } from '@ichiba/ichiba-core-ui';
import { t } from 'i18next';

import { TransactionStatusEnum } from '@/types/enums/payment';
import { TransactionItem } from '@/types/loyalty';

const TransactionStatus = ({ data }: { data: TransactionItem }) => {
  const generatedStatus = (status: TransactionStatusEnum) => {
    switch (status) {
      case TransactionStatusEnum.Completed:
        return (
          <Tag
            value={t('completed')}
            variant="success"
            className="border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded text-ic-light bg-ic-green-6s  w-max"
          />
        );
      case TransactionStatusEnum.Canceled:
        return (
          <Tag
            value={t('canceled')}
            variant="error"
            className="border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-red-6s text-ic-light w-max"
          />
        );
      case TransactionStatusEnum.OnHold:
        return (
          <Tag
            value={t('onHold')}
            variant="warning"
            className="border border-current text-xs px-2 py-0.5 h-6 flex items-center rounded bg-ic-orange-6s text-ic-light w-max"
          />
        );
      default:
        break;
    }
  };
  return (
    <>
      <div className="flex h-full items-center">{generatedStatus(data.status)}</div>
    </>
  );
};
export default TransactionStatus;
