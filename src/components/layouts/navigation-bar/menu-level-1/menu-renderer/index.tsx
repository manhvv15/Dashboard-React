import { useNavigationBar } from '@/hooks/use-navigation-bar';
import { cn } from '@/utils/common';

import MenuLevel1Group from './menu-group';
import classes from './menu-renderer.module.scss';

const MenuLevel1Renderer = () => {
  const { groups } = useNavigationBar();

  return (
    <div className={classes.root}>
      {groups.map((group, index) => (
        <div key={index} className="relative">
          <MenuLevel1Group group={group} />
          <fieldset
            className={cn('absolute inset-x-0 bottom-0 border-t border-ic-white-2s border-dashed mx-4', {
              hidden: !group.name || index === groups.length - 1,
            })}
          />
        </div>
      ))}
    </div>
  );
};

export default MenuLevel1Renderer;
