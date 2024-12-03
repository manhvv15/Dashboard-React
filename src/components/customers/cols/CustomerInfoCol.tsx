import { GetManagementWorkspaceQueryResponse } from '@/types/user-management/workspace';
import { useNavigate } from 'react-router-dom';

interface IProps {
  workspace: GetManagementWorkspaceQueryResponse;
}

const CustomerInfoCol = ({ workspace }: IProps) => {
  const navigate = useNavigate();
  const onHandleClick = () => {
    navigate(`detail/${workspace.id}`);
  };
  return (
    <div className="flex flex-col py-2">
      <div className="text-sm text-ic-primary-6s cursor-pointer" onClick={onHandleClick}>
        {workspace.name}
      </div>
      <div className="text-sm text-ic-black-5s">{workspace.billingEmail ?? workspace.owner}</div>
      <div className="text-sm text-ic-black-5s">{workspace.phoneNumber}</div>
    </div>
  );
};

export default CustomerInfoCol;
