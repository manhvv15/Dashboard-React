import { InvoiceManagement } from '@/types/payment/invoice';
import { Tooltip } from '@ichiba/ichiba-core-ui';

const WorkspaceInformation = ({ data }: { data: InvoiceManagement }) => {
  return (
    <div className="flex items-center h-full text-sm leading-5 text-ic-ink-6s">
      <div className="overflow-hidden max-[300px] truncate text-sm font-normal leading-5 text-ic-primary-6s flex items-center justify-between">
        <Tooltip content={`${data.workspaceInformation?.name} - ${data.workspaceInformation?.slug}`}>
          <div className="max-w-[280px] truncate">
            {data.workspaceInformation && (
              <span>
                {`${data.workspaceInformation?.name}`}
                {data.workspaceInformation?.slug && ` - ${data.workspaceInformation?.slug}`}
              </span>
            )}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
export default WorkspaceInformation;
