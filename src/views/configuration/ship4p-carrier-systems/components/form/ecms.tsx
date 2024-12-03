import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Input } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { trim } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailECMS, IConnectCarrierECMS } from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';

interface Props {
  onClose: () => void;
  onBack?: () => void;
  onRefetch: () => void;
  detailCarrier?: ICarrierDetailECMS;
  setChooseCarrier?: (component: string) => void;
  currencyByCourier?: string;
}
export default function ECMS({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();

  const schema = yup.object({
    userName: yup.string().required(error('required')),
    clientId: yup.string().required(error('required')),
    token: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IConnectCarrierECMS>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.ECMS,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('userName', detailCarrier?.accountId);
      setValue('clientId', detailCarrier?.settings?.clientId);
      setValue('account', detailCarrier?.settings?.account);
      setValue('token', detailCarrier?.settings?.token);

      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('clientId')) {
      setValue('clientId', trim(getValues('clientId')));
    }
    if (watch('account')) {
      setValue('account', trim(getValues('account')));
    }
    if (watch('token')) {
      setValue('token', trim(getValues('token')));
    }
  }, [watch('clientId'), watch('account'), watch('token')]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierECMS) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierECMS) => {
    data.accountId = data.account;
    updateCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('success.title'),
          detail: t('toast.update.carier.success'),
        });
        onClose();
        onRefetch();
      },
      onError: (e: any) => {
        const { errorNormal, errorFrom } = e;
        if (errorFrom) {
          responseErrorCode(errorFrom).forEach(({ message }) => {
            const mess = error(message);
            setErrorInline(mess);
          });
        }
        if (errorNormal) {
          setErrorInline(errorNormal);
        }
      },
    });
  };

  const createCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierECMS) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierECMS) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.accountId = data.userName;
    data.currency = currencyByCourier;
    data.courierId = CARRIER_ID.ECMS;
    createCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('success.title'),
          detail: t('toast.create.carier.success'),
        });
        setChooseCarrier?.('');
        onRefetch();
      },
      onError: (e: any) => {
        const { errorNormal, errorFrom } = e;
        if (errorFrom) {
          responseErrorCode(errorFrom).forEach(({ message }) => {
            const mess = error(message);
            setErrorInline(mess);
          });
        }
        if (errorNormal) {
          setErrorInline(errorNormal);
        }
      },
    });
  };
  const onClearDataClientId = () => {
    setValue('clientId', '', {
      shouldValidate: true,
    });
  };
  const onClearDataAccount = () => {
    setValue('account', '', {
      shouldValidate: true,
    });
  };
  const onClearDataUserName = () => {
    setValue('userName', '', {
      shouldValidate: true,
    });
  };
  const onClearDataToken = () => {
    setValue('token', '', {
      shouldValidate: true,
    });
  };

  return (
    <div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel required label={t('carrier.username.label')}>
          <Input
            className="text-sm"
            type="text"
            placeholder={t('carrier.username.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.userName?.message}
            hiddenClose={!watch('userName')}
            {...register('userName')}
          />
        </MixLabel>
        <FormHelperText className="text-red-600">{errors?.userName?.message}</FormHelperText>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={t('carrier.emcs.account.label')}>
          <Input
            className="text-sm"
            type="text"
            placeholder={t('carrier.emcs.account.placeholder')}
            onClearData={onClearDataAccount}
            error={!!errors?.account?.message}
            hiddenClose={!watch('account')}
            {...register('account')}
          />
        </MixLabel>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={t('carrier.clientId.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={t('carrier.clientId.placeholder')}
            onClearData={onClearDataClientId}
            error={!!errors?.clientId?.message}
            hiddenClose={!watch('clientId')}
            {...register('clientId')}
          />
          <FormHelperText className="text-red-600">{errors?.clientId?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={t('form.access.token')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={t('form.access.token.placeholder')}
            onClearData={onClearDataToken}
            error={!!errors?.token?.message}
            hiddenClose={!watch('token')}
            {...register('token')}
          />
          <FormHelperText className="text-red-600">{errors?.token?.message}</FormHelperText>
        </MixLabel>
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium leading-6">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {t('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">{t('register.now')}</span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end ">
        <Button
          type="button"
          size="40"
          variant="outlined"
          className=" w-[160px] mr-4 rounded-lg py-2 px-4 justify-center text-sm font-normal leading-6"
          onClick={!detailCarrier ? onBack : onClose}
        >
          {!detailCarrier ? t('button.back') : t('button.cancel')}
        </Button>
        <Button
          type="button"
          size="40"
          variant="filled"
          loading={createCarrierAccount.isLoading || updateCarrierAccount.isLoading}
          disabled={createCarrierAccount.isLoading || updateCarrierAccount.isLoading}
          className="w-[160px] rounded-lg py-2 px-4 justify-center text-sm font-normal leading-6 "
          onClick={handleSubmit(onSubmit)}
        >
          {t('button.connect')}
        </Button>
      </div>
    </div>
  );
}
