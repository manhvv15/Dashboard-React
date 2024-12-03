import { CountryFlag } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { InvoiceDetail } from '@/types/payment/invoice';
import { convertPhoneNumber } from '@/utils/common';

interface props {
  dataDetailInvoice?: InvoiceDetail;
}
const WorkspaceInformation = ({ dataDetailInvoice }: props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  return (
    <div className="p-3 flex gap-3 bg-ic-light  rounded-lg flex-col">
      <div className="font-medium text-sm leading-5 text-ic-ink-6s">
        <span>{common('workspaceInformation')}</span>
      </div>
      {dataDetailInvoice?.workspaceInformation ? (
        <div className="p-3 flex gap-1 flex-1 rounded-lg border bg-white scrollbar overflow-y-auto max-h-[122px] border-ic-ink-2s border-dashed flex-col">
          <div className="text-ic-primary-6s font-medium leading-5 text-sm">
            <span>
              {dataDetailInvoice?.workspaceInformation?.name}
              {dataDetailInvoice?.workspaceInformation?.slug && ` - ${dataDetailInvoice?.workspaceInformation?.slug}`}
            </span>
          </div>
          <span className="leading-5 text-sm text-ic-black-6s">
            {convertPhoneNumber(
              dataDetailInvoice?.workspaceInformation?.phoneNumber || '',
              dataDetailInvoice?.workspaceInformation?.prefixPhoneNumber || '',
            )}
          </span>
          <div className="flex gap-2 items-center">
            <div>
              {dataDetailInvoice?.workspaceInformation?.countryCode && (
                <CountryFlag code={dataDetailInvoice?.workspaceInformation?.countryCode || ''} />
              )}
            </div>
            <span className="text-sm leading-5">{dataDetailInvoice?.workspaceInformation?.countryName}</span>
          </div>
          <span className="text-ic-ink-5s leading-5 text-sm">
            {dataDetailInvoice?.workspaceInformation?.companyAddress}
          </span>
        </div>
      ) : (
        <div className="p-3 flex flex-1 items-center rounded-lg border bg-white scrollbar overflow-y-auto  border-ic-ink-2s border-dashed flex-col">
          <SvgIcon icon="empty" width={90} height={90} className="flex items-center" />
        </div>
      )}
    </div>
  );
};
export default WorkspaceInformation;
