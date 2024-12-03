import { Navigate, Outlet } from 'react-router-dom';

import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { isGrantPermission } from '@/utils/common';

interface IProps {
  object: OBJECTS;
  action: ACTIONS;
}

const RequirePermission = ({ object, action }: IProps) => {
  return isGrantPermission(object, action) ? <Outlet /> : <Navigate to="/forbidden" />;
};

export default RequirePermission;
