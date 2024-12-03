import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { MerchantAccountTypeEnum } from '@/types/enums/transaction';
import { TransactionManagement } from '@/types/payment/transaction';

const Method = ({ data }: { data: TransactionManagement }) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const method = (method: MerchantAccountTypeEnum) => {
    switch (method) {
      case MerchantAccountTypeEnum.BIDV:
        return <span>{common('bidv')}</span>;
      case MerchantAccountTypeEnum.BankTransfer:
        return <span>{common('bankTransfer')}</span>;
      case MerchantAccountTypeEnum.COD:
        return <span>{common('cod')}</span>;
      case MerchantAccountTypeEnum.Cash:
        return <span>{common('cash')}</span>;
      case MerchantAccountTypeEnum.Payme:
        return <span>{common('payme')}</span>;
      case MerchantAccountTypeEnum.PaymeDirect:
        return <span>{common('paymeDirect')}</span>;
      case MerchantAccountTypeEnum.PaymeWallet:
        return <span>{common('paymeWallet')}</span>;
      case MerchantAccountTypeEnum.Paypal:
        return <span>{common('paypal')}</span>;
      case MerchantAccountTypeEnum.Point:
        return <span>{common('point')}</span>;
      case MerchantAccountTypeEnum.VietQR:
        return <span>{common('vietQR')}</span>;
      default:
        break;
    }
  };
  return (
    <>
      <div className="flex h-full items-center text-sm">{method(data.paymentMethod)}</div>
    </>
  );
};
export default Method;
