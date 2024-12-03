import { useNavigationBar } from '@/hooks/use-navigation-bar';

import MenuLevel1Renderer from './menu-renderer';
import MenuRootToggle from './menu-toggle';

const MenuLevel1 = () => {
  const { menuExpansion } = useNavigationBar();

  return (
    <div
      className="flex flex-col h-full overflow-hidden relative bg-ic-ink-6s text-ic-white-6s transition-all"
      style={{ width: menuExpansion ? 220 : 64 }}
    >
      <MenuLevel1Renderer />
      <MenuRootToggle />
    </div>
  );
};

export default MenuLevel1;
