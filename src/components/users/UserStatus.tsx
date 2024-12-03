import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { UserStatusEnum } from '@/types/user-management/user';

interface Props {
  status: UserStatusEnum | null;
}

const UserStatus = ({ status }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  if (status === UserStatusEnum.Active)
    return (
      <>
        <div className="rounded border border-ic-green-6s text-xs leading-5 font-normal text-ic-green-6s px-2 bg-ic-green-1s inline-block">
          {common('active')}
        </div>
      </>
    );
  if (status === UserStatusEnum.Invited)
    return (
      <>
        <div className="rounded border border-ic-blue-6s text-xs leading-5 font-normal text-ic-blue-6s px-2 bg-ic-blue-1s inline-block">
          {common('invited')}
        </div>
      </>
    );
  return (
    <>
      <div className="rounded border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal text-ic-red-6s px-2 bg-ic-red-1s inline-block">
        {common('deactive')}
      </div>
    </>
  );
};

export default UserStatus;
