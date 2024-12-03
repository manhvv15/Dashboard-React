import { Badge } from '@ichiba/ichiba-core-ui';

import NotificationIcon from '@/public/static/icons/bell-notifications.svg';
import QuestionIcon from '@/public/static/icons/question.svg';
import { cn } from '@/utils/common';

import AuthUserMenu from './auth-user-menu';
import LanguageToogle from './language-toogle';

const Header = () => {
  return (
    <div className="h-12 relative flex items-center justify-between py-1 pl-4 pr-5 gap-4">
      <div className="flex items-center gap-2">
        <img src="/public/static/svg/logo.svg" className="w-auto h-8" alt="" />
      </div>
      <div className={cn('flex items-center gap-4')}>
        <LanguageToogle />
        <div className="border-r border-ic-ink-2s h-6" />
        <div className="flex items-center gap-6">
          <Badge>
            <NotificationIcon />
          </Badge>
          <QuestionIcon />
        </div>
        <div className="border-r border-ic-ink-2s h-6" />
        <AuthUserMenu />
      </div>
      <fieldset className="absolute bottom-0 border-b border-ic-ink-2s inset-x-0" />
    </div>
  );
};

export default Header;
