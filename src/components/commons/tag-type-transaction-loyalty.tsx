import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { TransactionTypeLoyaltyEnum } from '@/types/enums/transaction';

interface props {
  type: TransactionTypeLoyaltyEnum;
  status: number;
}
interface Status {
  [key: string]: { bg: string; colorText: string; border: string; text: string };
}
const tagStyle: Status = {
  Add: {
    bg: 'bg-ic-violet-1s',
    colorText: 'text-ic-violet-6s',
    border: 'border-ic-violet-6s',
    text: 'topUp',
  },
  Cashback: {
    bg: 'bg-ic-orange-1s',
    colorText: 'text-ic-orange-6s',
    border: 'border-ic-orange-6s',
    text: 'cashback',
  },
  Spend: {
    bg: 'bg-ic-green-1s',
    colorText: 'text-ic-green-6s',
    border: 'border-ic-green-6s',
    text: 'pay',
  },
  Withdraw: {
    bg: 'bg-ic-blue-1s',
    colorText: 'text-ic-blue-6s',
    border: 'border-ic-blue-6s',
    text: 'withdraw',
  },
};
const TagTypeTransactionLoyalty = ({ type }: props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const tagStatus = (type: TransactionTypeLoyaltyEnum) => {
    switch (type) {
      case TransactionTypeLoyaltyEnum.Add:
        return tagStyle['Add'];
      case TransactionTypeLoyaltyEnum.Spend:
        return tagStyle['Spend'];
      // case 2:
      //   return tagStyle['Reward'];
      // case 3:
      //   return tagStyle['Gift'];
      case TransactionTypeLoyaltyEnum.WithDraw:
        return tagStyle['WithDraw'];
      case TransactionTypeLoyaltyEnum.Cashback:
        return tagStyle['Cashback'];
      // case 6:
      //   return tagStyle['AutoCharge'];
      case 7:
        return tagStyle['Refund'];
      default:
        return {} as Status;
    }
  };
  return (
    <>
      <div className={clsx('flex items-center  max-w-max px-2 py-1  h-6 min-w-max')}>
        <span className=" text-sm leading-4">{common(`${tagStatus(type)?.text}`)}</span>
      </div>
    </>
  );
};
export default TagTypeTransactionLoyalty;
