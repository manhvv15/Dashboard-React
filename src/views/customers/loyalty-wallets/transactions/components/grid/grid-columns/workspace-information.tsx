import { dateFormat } from '@/constants/variables/common';
import { TransactionItem } from '@/types/loyalty';
import { formatDate } from '@/utils/common';

const WorkspaceInformation = ({ data }: { data: TransactionItem }) => {
  return (
    <div className="flex h-full items-start flex-col">
      {data.workspaceInformation && (
        <span className="text-ic-primary-6s text-sm">
          {data.workspaceInformation?.slug}
          {data.workspaceInformation?.name && ` - ${data.workspaceInformation?.name}`}
        </span>
      )}
      {data.completionDate && (
        <span>
          {formatDate({
            time: data.completionDate ?? '',
            dateFormat: dateFormat.HH_mm_MM_DD_YYYY,
          })}
        </span>
      )}
    </div>
  );
};
export default WorkspaceInformation;
