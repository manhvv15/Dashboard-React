import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { CustomerPagingResponse } from '@/types/user-management/customer';

interface Props {
  data: CustomerPagingResponse;
}

const AuthenticationStatus = ({ data }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  if (data.emailConfirmed || data.phoneNumberConfirmed)
    return (
      <>
        <div className="rounded border border-ic-green-5s text-xs leading-5 font-normal text-ic-green-5s px-2 bg-ic-green-1s inline-block h-full">
          {common('verified')}
        </div>
      </>
    );
  return (
    <>
      <div className="rounded border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal text-ic-red-6s px-2 bg-ic-red-1s inline-block h-full">
        {common('unverified')}
      </div>
    </>
  );
};

export default AuthenticationStatus;
