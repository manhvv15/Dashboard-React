import { Button, ErrorState, PermissionIcon } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Status403() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const backHome = () => {
    navigate('/');
  };
  return (
    <ErrorState className="fixed top-0 left-0 w-full h-screen justify-center">
      <PermissionIcon />
      <Button onClick={backHome} className="mt-4">
        {t('homePage')}
      </Button>
    </ErrorState>
  );
}
