import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

interface props {
  type: number;
  status: number;
}
interface Status {
  [key: string]: { bg: string; colorText: string; border: string; text: string };
}
const tagStyle: Status = {
  Payment: {
    bg: 'bg-ic-violet-1s',
    colorText: 'text-ic-violet-6s',
    border: 'border-ic-violet-6s',
    text: 'payment',
  },
  Refund: {
    bg: 'bg-ic-orange-1s',
    colorText: 'text-ic-orange-6s',
    border: 'border-ic-orange-6s',
    text: 'refund',
  },
  Deposit: {
    bg: 'bg-ic-green-1s',
    colorText: 'text-ic-green-6s',
    border: 'border-ic-green-6s',
    text: 'deposit',
  },
  Withdraw: {
    bg: 'bg-ic-blue-1s',
    colorText: 'text-ic-blue-6s',
    border: 'border-ic-blue-6s',
    text: 'withdraw',
  },
  Authorize: {
    bg: 'bg-ic-orange-1s',
    colorText: 'text-ic-orange-6s',
    border: 'border-ic-orange-6s',
    text: 'authorize',
  },
  Transfer: {
    bg: 'bg-ic-green-1s',
    colorText: 'text-ic-green-6s',
    border: 'border-ic-green-6s',
    text: 'transfer',
  },
  AutoCharge: {
    bg: 'bg-ic-red-1s',
    colorText: 'text-ic-red-6s',
    border: 'border-ic-red-6s',
    text: 'autoCharge',
  },
  Capture: {
    bg: 'bg-ic-green-1s',
    colorText: 'text-ic-green-6s',
    border: 'border-ic-green-6s',
    text: 'capture',
  },
  AutoChargeCapture: {
    bg: 'bg-ic-green-1s',
    colorText: 'text-ic-green-6s',
    border: 'border-ic-green-6s',
    text: 'autoChargeCapture',
  },
};
const TagTypeTransaction = ({ type }: props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const tagStatus = (type: number) => {
    switch (type) {
      case 0:
        return tagStyle['Payment'];
      case 1:
        return tagStyle['Refund'];
      case 2:
        return tagStyle['Deposit'];
      case 3:
        return tagStyle['Withdraw'];
      case 4:
        return tagStyle['Authorize'];
      case 5:
        return tagStyle['Transfer'];
      case 6:
        return tagStyle['AutoCharge'];
      case 7:
        return tagStyle['Capture'];
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
export default TagTypeTransaction;
