import { TransactionManagement } from '@/types/payment/transaction';
import { Tooltip } from '@ichiba/ichiba-core-ui';

const WorkspaceInformation = ({ data }: { data: TransactionManagement }) => {
  return (
    <div className="flex h-full items-center">
      <div className=" overflow-hidden max-[300px] truncate text-sm font-normal leading-5 text-ic-primary-6s flex items-center justify-between">
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
