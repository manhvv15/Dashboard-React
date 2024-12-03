import { GetManagementWorkspaceQueryResponse } from '@/types/user-management/workspace';
import { formatDate } from '@/utils/common';

interface IProps {
  workspace: GetManagementWorkspaceQueryResponse;
}

const CreatedByInforCol = ({ workspace }: IProps) => {
  return (
    <div className="flex flex-row py-2">
      <div className="ml-2">
        <div className="text-sm text-ic-black-5s">{workspace.createBy}</div>
        <div className="text-sm text-ic-black-5s">
          {formatDate({ time: workspace.createdAt, dateFormat: ' hh:mm MM/dd/yyyy' })}
        </div>
      </div>
    </div>
  );
};

export default CreatedByInforCol;
