import { Button } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { useAuth } from '@/hooks/use-auth';

const ManageDashboard = () => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { authUser } = useAuth();
  const { showToast } = useApp();

  const handleShowToast = () => {
    showToast({
      type: 'success',
      summary: 'This is a success toast',
      detail: 'This is a success toast detail',
    });
  };

  return (
    <div className="flex flex-col px-2 pt-2">
      <span>{t('welcome')}</span>
      <span>Main section</span>
      <span>User: {authUser.fullName}</span>
      <Button className="w-max" variant="outlined" onClick={handleShowToast}>
        Show toast
      </Button>
    </div>
  );
};

export default ManageDashboard;
