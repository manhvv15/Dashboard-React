import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useAuth } from '@/hooks/use-auth';

const Home = () => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { authUser } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <img src={'/static/svg/logo.svg'} alt="" />
      <h1 className="text-4xl font-medium">{t('welcome')}</h1>
      <span>Auth user: {authUser.fullName}</span>
    </div>
  );
};

export default Home;
