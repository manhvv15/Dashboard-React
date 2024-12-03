import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { StatusEnum } from '@/types/user-management/workspace';

interface Props {
  status: StatusEnum | undefined;
}

const WorkspaceStatus = ({ status }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  if (status === StatusEnum.Active)
    return (
      <>
        <div className="rounded-3xl border border-ic-green-6s text-xs leading-5 font-normal text-ic-green-6s px-2 bg-ic-green-1s inline-block h-full w-[75px] text-center">
          {common('active')}
        </div>
      </>
    );
  return (
    <>
      <div className="rounded-3xl border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal text-ic-red-6s px-2 bg-ic-red-1s inline-block w-[75px] text-center">
        {common('deactive')}
      </div>
    </>
  );
};

export default WorkspaceStatus;
