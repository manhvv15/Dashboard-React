import { ReactNode } from 'react';

import { OBJECTS, ACTIONS } from '@/constants/variables/common';
import { isGrantPermission } from '@/utils/common';

interface Props {
  children: ReactNode;
  object: OBJECTS;
  action: ACTIONS;
}

const AccessibleComponent = ({ children, object, action }: Props) => {
  return isGrantPermission(object, action) ? <>{children}</> : null;
};
export default AccessibleComponent;
