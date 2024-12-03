import React, { useMemo, useState } from 'react';

import { Collapse, Tooltip } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUpdateEffect } from 'usehooks-ts';

import { LocaleNamespace } from '@/constants/enums/common';
import { useNavigationBar } from '@/hooks/use-navigation-bar';
import ArrowIcon from '@/public/static/icons/arrow.svg';
import { GroupMenuLevel1Type } from '@/types/navigation';
import { cn } from '@/utils/common';

import MenuLevel2Item from './menu-level2-item';

interface MenuLevel1ItemProps {
  menu: GroupMenuLevel1Type;
}

const MenuLevel1Item = ({ menu }: MenuLevel1ItemProps) => {
  const { t } = useTranslation(LocaleNamespace.Menu);
  const { menuExpansion, toggleMenuExpansion, isRouteMatched } = useNavigationBar();

  const { label, icon, disabled } = menu;

  const isActive = useMemo(
    () =>
      isRouteMatched(menu.href, { exact: menu.exact }) ||
      menu.children.some((level2) => isRouteMatched(level2.href, { exact: level2.exact })),
    [isRouteMatched, menu.children, menu.exact, menu.href],
  );

  const [expandedGroup, setExpandedGroup] = useState(isActive ? true : menu.expandedDefault ?? true);

  const toogleExpandedGroup = () => setExpandedGroup((prev) => !prev);

  const onClickMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (menu.disabled || !menu.href) {
      e.preventDefault();
    }

    if (menu.disabled) return;

    const currentExpansion = menuExpansion;

    if (menu.expandRootOnActive && !currentExpansion) {
      toggleMenuExpansion();
    }

    if (!menu.collapsible) return;

    /**
     * nếu collapsible = true và menu đang active thì chỉ toogle menu con chứ không redirect
     */
    if (isActive) {
      e.preventDefault();
    }

    /**
     * nếu root đang đóng và menu active thì mở menu con
     */
    if (!currentExpansion && isActive) {
      setExpandedGroup(true);
      return;
    }

    /**
     * nếu menu có href và không active thì mở menu con
     */
    if (menu.href && !isActive) {
      setExpandedGroup(true);
      return;
    }
    toogleExpandedGroup();
  };

  const level2ActiveIndex = useMemo(() => {
    if (!isActive) return -1;
    return menu.children.findIndex((level2) =>
      isRouteMatched(level2.href, {
        exact: level2.exact,
      }),
    );
  }, [isActive, isRouteMatched, menu.children]);

  /**
   * khi menu.expandOnActive = true and isActive = false, đóng menu
   */
  useUpdateEffect(() => {
    if (!menu.expandOnActive || isActive) return;
    setExpandedGroup(false);
  }, [menu.expandOnActive, isActive]);

  return (
    <div className="flex flex-col">
      <Tooltip
        content={disabled ? t('comingSoon') : label}
        placement="right"
        open={menuExpansion && !disabled ? false : undefined}
      >
        <Link
          to={menu.href ?? '#'}
          className={cn(
            'flex items-center cursor-pointer justify-between w-full relative py-2 hover:bg-ic-white-1s',
            "before:content-[''] before:absolute before:inset-y-0 before:left-0 before:bg-ic-brand-a",
            {
              'text-ic-white-3s cursor-default': menu.disabled,
              'px-4 py-2.5': menuExpansion,
              'bg-ic-black-7s font-medium text-ic-brand-a before:w-[3px]':
                isActive && !menu.disabled && (!menuExpansion || level2ActiveIndex === -1),
            },
          )}
          target={menu.target}
          onClick={onClickMenu}
        >
          <div
            className={cn(
              'flex items-center w-full',
              {
                'flex-col justify-center': !menuExpansion,
              },
              menuExpansion ? 'gap-2' : 'gap-1',
            )}
          >
            <div className="h-6 w-6 flex items-center justify-center">{icon}</div>
            <span
              className={cn(
                'transition-opacity duration-500 flex-1',
                menuExpansion ? 'text-sm' : 'text-xxs text-center',
              )}
            >
              {menuExpansion ? label : menu.shortLabel ?? label}
            </span>
            {menu.collapsible && !menu.disabled && menuExpansion && (
              <ArrowIcon
                className={cn('text-ic-white-6s transition-transform', expandedGroup ? '-rotate-180' : 'rotate-0')}
              />
            )}
          </div>
        </Link>
      </Tooltip>
      {!menu.disabled && menuExpansion && (
        <Collapse expanded={expandedGroup} disabled={!menu.collapsible}>
          <div className="flex flex-col">
            {menu.children.map((level2, index) => (
              <MenuLevel2Item active={index === level2ActiveIndex} menu={level2} key={index} />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default MenuLevel1Item;
