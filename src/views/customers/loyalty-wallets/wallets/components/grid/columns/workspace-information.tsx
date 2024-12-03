import { dateFormat } from '@/constants/variables/common';
import { WalletItem } from '@/types/loyalty';
import { formatDate } from '@/utils/common';
import { Tooltip } from '@ichiba/ichiba-core-ui';

const InformationWorkspace = ({ data }: { data: WalletItem }) => {
  return (
    <div className="flex h-full gap-1 items-start flex-col justify-start">
      <div className=" overflow-hidden max-[400px] truncate text-sm font-normal leading-5 text-ic-primary-6s flex items-center justify-between">
        <Tooltip content={`${data.workspaceInformation?.name} - ${data.workspaceInformation?.slug}`}>
          <div className="max-w-[380px] truncate">
            {data.workspaceInformation && (
              <span>
                {`${data.workspaceInformation?.name}`}
                {data.workspaceInformation?.slug && ` - ${data.workspaceInformation?.slug}`}
              </span>
            )}
          </div>
        </Tooltip>
      </div>
      <span className="text-sm leading-5 text-ic-ink-6s">
        {`${formatDate({
          time: data.createAt,
          dateFormat: dateFormat.MM_DD_YYYY,
        })}`}
        {data.currency && ` - ${data.currency}`}
      </span>
    </div>
  );
};
export default InformationWorkspace;
