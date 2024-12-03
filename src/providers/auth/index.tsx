import { LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { APP_CODE, DEFAULT_COUNTRY, DEFAULT_CURRENCY, DEFAULT_LANGUAGE } from '@/constants/variables/common';
import { getAuthUser, getAuthUserProfile } from '@/services/user-management/auth';
import { getPermissionByCurrentUser } from '@/services/user-management/permission';
import { RolePermissionRequest } from '@/types/common';
import { AuthUserProfile } from '@/types/user-management/auth';

import { AuthContext } from './context';

const AuthProvider = () => {
  const authUserQuery = useQuery({
    queryKey: [getAuthUser],
    queryFn: getAuthUser,
  });

  const setWindowGlobal = (user: AuthUserProfile) => {
    window.region = user.sessionCountryCode;
    window.currency = user.sessionCurrencyCode;
    window.language = user.sessionLanguageCode;

    window.dateFormat = user.sessionDateFormat;
    window.timeFormat = user.sessionTimeFormat;
    window.timeZone = user.sessionTimeZone;
  };

  const { data } = useQuery({
    queryKey: [getAuthUserProfile.name],
    queryFn: getAuthUserProfile,
    enabled: !!authUserQuery.isSuccess,
    onSuccess: (data) => {
      const user = {
        ...data.data,
        sessionCurrencyCode: data.data?.sessionCurrencyCode || DEFAULT_CURRENCY,
        sessionCountryCode: data.data?.sessionCountryCode || DEFAULT_COUNTRY,
        sessionLanguageCode: data.data?.sessionLanguageCode || DEFAULT_LANGUAGE,
        avatarUrl: data.data?.avatarUrl || '/static/svg/profile.svg',
        sessionDateFormat: data.data.sessionDateFormat || 'dd/MM/yyyy',
        sessionTimeFormat: data.data.sessionTimeFormat || 'hh:mm tt',
        sessionTimeZone: data.data.sessionTimeZone || 'Asia/Bangkok',
      };

      setWindowGlobal(user);
    },
  });

  const permissions = useQuery({
    queryKey: [getPermissionByCurrentUser.name],
    queryFn: () =>
      getPermissionByCurrentUser({
        applicationCode: APP_CODE,
        workspaceId: null,
      } as RolePermissionRequest),
    enabled: !!authUserQuery.isSuccess,
  }).data?.data;

  if (!data || !permissions) return <LoadingOverlay isLoading className="w-screen h-screen" />;

  return (
    <AuthContext.Provider value={{ authUser: data.data, permissions: permissions ?? [] }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
