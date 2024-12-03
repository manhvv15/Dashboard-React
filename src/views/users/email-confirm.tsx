import { useEffect, useState } from 'react';

import { LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import LockIcon from '@/public/static/images/lock.png';
import LogoIcon from '@/public/static/images/logo.png';
import { confirmInviteSystem } from '@/services/user-management/user';

const EmailConfirm = () => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenParam = searchParams.get('token');
  const emailParam = searchParams.get('email');
  const [isError, setIsError] = useState(false);
  const sendConfirmInviteMutation = useQuery({
    queryKey: ['confirm'],
    queryFn: () =>
      confirmInviteSystem({
        email: searchParams.get('email') ?? '',
        token: searchParams.get('token') ?? '',
      }),
    enabled: !!tokenParam && !!emailParam,
    onSuccess: () => {
      setIsError(false);
      window.location.href = '/dashboard';
    },
    onError: () => {
      setIsError(true);
    },
  });

  useEffect(() => {
    if (!tokenParam || !emailParam) {
      navigate(`/404`);
    }
  }, [searchParams, navigate]);

  return (
    <>
      <LoadingOverlay className="w-full h-screen" isLoading={sendConfirmInviteMutation.isLoading}>
        {isError && (
          <div className="fixed top-0 left-0 flex h-full w-full flex-col items-center justify-center bg-white">
            <div className="">
              <a href="https://ichiba.vn " className="flex justify-center">
                <img src={LogoIcon} alt="logo" width={'159'} height={'48'} />
              </a>
              <div className="flex justify-center">
                <img
                  src={LockIcon}
                  alt="lock"
                  width={'120'}
                  height={'120'}
                  className=" mt-[5rem] w-[120px] flex justify-center"
                />
              </div>

              <p className="mt-[2.5rem] text-center text-2xl font-bold leading-9 text-neutral-10">
                <strong>{t('tokenExpiredTitle')}</strong>
              </p>
              <div className="mt-4">
                <p className="text-center text-base font-normal leading-6">
                  <span className="text-base font-bold leading-6 text-neutral-10"></span>
                  <br />
                  <strong>{t('tokenExpiredContent')}</strong>
                </p>
              </div>
            </div>
          </div>
        )}
      </LoadingOverlay>
    </>
  );
};

export default EmailConfirm;
