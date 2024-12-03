import { useState } from 'react';

import { Collapse } from '@ichiba/ichiba-core-ui';

import { useNavigationBar } from '@/hooks/use-navigation-bar';
import ArrowIcon from '@/public/static/icons/arrow.svg';
import { NavigationGroupMenu } from '@/types/navigation';
import { cn } from '@/utils/common';

import MenuLevel1Item from './menu-item';

interface MenuLevel1GroupProps {
  group: NavigationGroupMenu;
}

const MenuLevel1Group = ({ group }: MenuLevel1GroupProps) => {
  const { menuExpansion } = useNavigationBar();
  const [expandedGroup, setExpandedGroup] = useState(group.expandedDefault ?? true);

  const toogleExpandedGroup = () => setExpandedGroup((prev) => !prev);

  return (
    <div
      className={cn('flex flex-col', {
        'py-2': !!group.name,
      })}
    >
      {!!group.name && (
        <button
          className={cn(
            'py-2 uppercase text-xs truncate flex gap-1 items-center text-ic-white-5s',
            menuExpansion ? 'px-4 justify-between' : 'px-2 flex-col',
            {
              'hover:bg-ic-white-1s': group.collapsible,
            },
          )}
          disabled={!group.collapsible}
          onClick={toogleExpandedGroup}
        >
          <span className="truncate max-w-full">{group.name}</span>
          {group.collapsible && (
            <ArrowIcon
              className={cn('text-ic-white-6s transition-transform', expandedGroup ? '-rotate-180' : 'rotate-0')}
            />
          )}
        </button>
      )}
      <Collapse expanded={expandedGroup} disabled={!group.collapsible}>
        <div className="flex flex-col">
          {group.children.map((level1, index) => (
            <MenuLevel1Item menu={level1} key={index} />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default MenuLevel1Group;
