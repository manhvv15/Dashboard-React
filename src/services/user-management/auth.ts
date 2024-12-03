import { AuthUser, AuthUserProfile } from '@/types/user-management/auth';

import { userManagement } from './endpoints';

import { instance } from '../xhr';

export const getAuthUser = () => {
  return instance.get<AuthUser>(userManagement.userInfo);
};

export const getAuthUserProfile = () => {
  return instance.get<AuthUserProfile>(userManagement.profile);
};
