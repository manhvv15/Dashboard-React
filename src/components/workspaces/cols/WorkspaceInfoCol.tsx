import { GetManagementWorkspaceQueryResponse, StatusEnum } from '@/types/user-management/workspace';
import { useNavigate } from 'react-router-dom';

interface IProps {
  workspace: GetManagementWorkspaceQueryResponse;
}

const WorkspaceInfoCol = ({ workspace }: IProps) => {
  const navigate = useNavigate();

  const onHandleClick = () => {
    navigate(`${workspace.id}/detail`);
  };
  const workspaceStatus = () => {
    if (workspace.status == StatusEnum.Active)
      return (
        <>
          <div className="rounded-full border border-ic-green-6s text-xs leading-5 font-normal px-2 bg-ic-green-5s inline-block">
            <div className="h-4"></div>
          </div>
        </>
      );
    return (
      <>
        <div className="rounded-full border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal px-2 bg-ic-red-5s inline-block">
          <div className="h-4"></div>
        </div>
      </>
    );
  };
  return (
    <div className="flex flex-row py-2">
      <div className="mt-1">{workspaceStatus()}</div>
      <div className="ml-2">
        <div className="text-sm text-ic-primary-6s cursor-pointer" onClick={onHandleClick}>
          <p>{workspace.slug}</p>
          <p>{workspace.name}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceInfoCol;
