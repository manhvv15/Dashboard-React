import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { ApplicationStatusEnum } from '@/types/user-management/application';

interface Props {
  status: ApplicationStatusEnum;
}

const ApplicationStatus = ({ status }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  if (status === ApplicationStatusEnum.Active)
    return (
      <>
        <div className="rounded border border-ic-green-6s text-xs leading-5 font-normal text-ic-green-6s px-2 bg-ic-green-1s inline-block">
          {common('active')}
        </div>
      </>
    );

  if (status === ApplicationStatusEnum.Deactivate)
    return (
      <>
        <div className="rounded border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal text-ic-red-6s px-2 bg-ic-red-1s inline-block">
          {common('deactive')}
        </div>
      </>
    );
  return (
    <>
      <div className="rounded border border-ic-primary-6s bg-orange-1 text-xs leading-5 font-normal text-ic-primary-6s px-2 bg-ic-primary-1s inline-block">
        {common('comingSoon')}
      </div>
    </>
  );
};

export default ApplicationStatus;
