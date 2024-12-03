import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useNavigationBar } from '@/hooks/use-navigation-bar';
import ArrowLeftIcon from '@/public/static/icons/arrow-left.svg';
import { cn } from '@/utils/common';

const MenuToggle = () => {
  const { t } = useTranslation(LocaleNamespace.Menu);
  const { menuExpansion, toggleMenuExpansion } = useNavigationBar();

  return (
    <button
      className={cn(
        'p-4 flex items-center relative gap-1 hover:bg-ic-white-1s text-sm',
        'before:absolute before:border-t before:border-ic-ink-2s before:inset-x-0 before:top-0',
        menuExpansion ? 'justify-end' : 'justify-center',
      )}
      onClick={toggleMenuExpansion}
    >
      <ArrowLeftIcon
        className={cn({
          'rotate-180': !menuExpansion,
        })}
      />
      <span
        className={cn('font-medium', {
          hidden: !menuExpansion,
        })}
      >
        {t('hide')}
      </span>
    </button>
  );
};

export default MenuToggle;
