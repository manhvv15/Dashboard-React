import { Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { configs } from '@/constants/variables/environment';
import { useAuth } from '@/hooks/use-auth';
import SettingsIcon from '@/public/static/icons/settings.svg';
import { auth } from '@/services/user-management/endpoints';

const AuthUserMenu = () => {
  const { t } = useTranslation(LocaleNamespace.Menu);
  const { authUser } = useAuth();

  const navigateToAccountSettings = () => {
    window.location.href = `${configs.ORG_BASE_URL}/account-management/profile`;
  };

  const handleLogout = () => {
    window.location.href = auth.logout;
  };

  return (
    <Menu>
      <MenuHandler>
        <button>
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={authUser.avatarUrl ?? '/static/svg/profile.svg'}
            alt=""
          />
        </button>
      </MenuHandler>
      <MenuList>
        <MenuItem onClick={navigateToAccountSettings}>
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="whitespace-nowrap">{t('accountSettings')}</span>
              <span className="whitespace-nowrap text-xs text-ic-ink-5s">{t('manageYourAccount')}</span>
            </div>
            <SettingsIcon />
          </div>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span>{t('logout')}</span>
            </div>
          </div>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AuthUserMenu;
