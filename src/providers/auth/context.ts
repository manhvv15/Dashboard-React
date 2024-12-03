import { createContext } from 'react';

import { RolePermissionItem } from '@/types/common';
import { AuthUserProfile } from '@/types/user-management/auth';
import { IpInfo } from '@/types/user-management/master-data';

export interface AuthContextProps {
  authUser: AuthUserProfile;
  detectedIP?: IpInfo;
  permissions: RolePermissionItem[] | null;
}

export const AuthContext = createContext({} as AuthContextProps);
