import { Tooltip } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { useNavigationBar } from '@/hooks/use-navigation-bar';
import { GroupMenuLevel2Type } from '@/types/navigation';
import { cn } from '@/utils/common';

interface MenuLevel2ItemProps {
  menu: GroupMenuLevel2Type;
  active: boolean;
}

const MenuLevel2Item = ({ menu, active }: MenuLevel2ItemProps) => {
  const { menuExpansion } = useNavigationBar();
  const { t } = useTranslation(LocaleNamespace.Menu);
  const { label, icon, disabled } = menu;

  const onClickMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (menu.disabled || !menu.href) {
      e.preventDefault();
    }
    if (menu.disabled) return;
  };

  return (
    <Tooltip
      content={disabled ? t('comingSoon') : label}
      placement="right"
      open={menuExpansion && !disabled ? false : undefined}
    >
      <Link
        to={menu.href ?? '#'}
        className={cn(
          'flex items-center cursor-pointer justify-between w-full relative hover:bg-ic-white-1s text-ic-white-5s text-sm px-4 py-2.5',
          "before:content-[''] before:absolute before:inset-y-0 before:left-0 before:bg-ic-brand-a",
          {
            'text-ic-white-3s cursor-default': menu.disabled,
            'bg-ic-black-7s font-medium text-ic-brand-a before:w-[3px]': active && !menu.disabled,
          },
        )}
        target={menu.target}
        onClick={onClickMenu}
      >
        <div className={cn('flex items-center w-full gap-2')}>
          <div className="h-6 w-6 flex items-center justify-center">{icon}</div>
          <span className={cn('transition-opacity duration-500 flex-1 line-clamp-2')}>{label}</span>
        </div>
      </Link>
    </Tooltip>
  );
};

export default MenuLevel2Item;
