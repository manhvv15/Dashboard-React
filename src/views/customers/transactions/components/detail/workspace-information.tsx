import { CountryFlag } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { TransactionDetail } from '@/types/payment/transaction';
import { convertPhoneNumber } from '@/utils/common';

interface props {
  dataDetailTransaction: TransactionDetail;
}
const WorkspaceInformation = ({ dataDetailTransaction }: props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  return (
    <div className="flex gap-3 p-3 flex-col bg-ic-light rounded-lg flex-1">
      <div className="font-medium text-sm leading-5">
        <span> {common('workspaceInformation')}</span>
      </div>
      {dataDetailTransaction.workspaceInformation ? (
        <div className="p-3 flex flex-1 flex-col gap-1 bg-white border border-dashed border-ic-ink-3s max-h-[122px] overflow-y-auto scrollbar rounded-lg">
          <div className="text-ic-primary-6s font-medium leading-5 text-sm">
            <span>
              {dataDetailTransaction.workspaceInformation?.name}
              {dataDetailTransaction.workspaceInformation?.slug &&
                ` - ${dataDetailTransaction.workspaceInformation?.slug}`}
            </span>
          </div>
          <span className="leading-5 text-sm text-ic-black-6s">
            {convertPhoneNumber(
              dataDetailTransaction.workspaceInformation?.phoneNumber || '',
              dataDetailTransaction.workspaceInformation?.prefixPhoneNumber || '',
            )}
          </span>
          <div className="flex gap-2 items-center">
            <div>
              {dataDetailTransaction.workspaceInformation?.countryCode && (
                <CountryFlag code={dataDetailTransaction.workspaceInformation?.countryCode || ''} />
              )}
            </div>
            <span className="text-sm leading-5">{dataDetailTransaction.workspaceInformation?.countryName}</span>
          </div>
          <span className="text-ic-ink-5s leading-5 text-sm">
            {dataDetailTransaction.workspaceInformation?.companyAddress}
          </span>
        </div>
      ) : (
        <div className="p-3 flex flex-col items-center gap-1 bg-white border border-dashed border-ic-ink-3s max-h-[125px] overflow-y-auto scrollbar rounded-lg">
          <SvgIcon icon="empty" width={95} height={95} className="flex items-center" />
        </div>
      )}
    </div>
  );
};
export default WorkspaceInformation;
