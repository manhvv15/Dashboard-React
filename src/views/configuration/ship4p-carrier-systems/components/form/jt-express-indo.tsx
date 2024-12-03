import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import {
  CARRIER_ID,
  ConverUppercase,
  GuideConnectCarrierLink,
} from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailJTExpress, IConnectCarrierJTExpressIndo } from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Input } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { trim } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface Props {
  onClose: () => void;
  onBack?: () => void;
  onRefetch: () => void;
  detailCarrier?: ICarrierDetailJTExpress;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}

export default function JtExpressIndo({
  onClose,
  onRefetch,
  detailCarrier,
  onBack,
  setChooseCarrier,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tjtExpressindo } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();

  const schema = yup.object({
    jtExpress_password: yup.string().required(error('required')),
    jtExpress_username: yup.string().required(error('required')),
    jtExpress_apikey: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IConnectCarrierJTExpressIndo>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.JTExpressIndo,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('jtExpress_password', detailCarrier?.settings?.jtExpress_password);
      setValue('jtExpress_username', detailCarrier?.settings?.jtExpress_username);
      setValue('jtExpress_apikey', detailCarrier?.settings?.jtExpress_apikey);
    }
  }, [detailCarrier]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierJTExpressIndo) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierJTExpressIndo) => {
    data.accountId = data.jtExpress_password;
    updateCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('success.title'),
          detail: t('toast.update.carier.success'),
        });
        onRefetch();
        onClose();
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
    mutationFn: (data: IConnectCarrierJTExpressIndo) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierJTExpressIndo) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.accountId = data.jtExpress_password;
    createCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('success.title'),
          detail: t('toast.create.carier.success'),
        });

        setChooseCarrier?.('');
        onRefetch();
        onClose();
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

  useEffect(() => {
    setErrorInline('');
    if (watch('jtExpress_password')) {
      setValue('jtExpress_password', trim(getValues('jtExpress_password')));
    }
    if (watch('jtExpress_username')) {
      setValue('jtExpress_username', trim(getValues('jtExpress_username')));
    }
    if (watch('jtExpress_apikey')) {
      setValue('jtExpress_apikey', trim(getValues('jtExpress_apikey')));
    }
  }, [watch('jtExpress_password'), watch('jtExpress_username'), watch('jtExpress_apikey')]);
  const onClearDataUserName = () => {
    setValue('jtExpress_password', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPassWord = () => {
    setValue('jtExpress_username', '', {
      shouldValidate: true,
    });
  };
  const onClearDataApiKey = () => {
    setValue('jtExpress_apikey', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tjtExpressindo('carrier.jtExpressindo.username.lable')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tjtExpressindo('carrier.jtExpressindo.username.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.jtExpress_username?.message}
            hiddenClose={!watch('jtExpress_username')}
            {...register('jtExpress_username')}
          />
          <FormHelperText className="text-red-600">{errors?.jtExpress_username?.message}</FormHelperText>
        </MixLabel>
        {errorInline && (
          <span className="text-red-600 ml-4 font-normal text-sm leading-4">{ConverUppercase(error(errorInline))}</span>
        )}
        <MixLabel label={tjtExpressindo('carrier.jtExpressindo.password.lable')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tjtExpressindo('carrier.jtExpressindo.password.placeholder')}
            onClearData={onClearDataPassWord}
            error={!!errors?.jtExpress_password?.message}
            hiddenClose={!watch('jtExpress_password')}
            {...register('jtExpress_password')}
          />
          <FormHelperText className="text-red-600">{errors?.jtExpress_password?.message}</FormHelperText>
        </MixLabel>
        {errorInline && (
          <span className="text-red-600 ml-4 font-normal text-sm leading-4">{ConverUppercase(error(errorInline))}</span>
        )}
        <MixLabel label={tjtExpressindo('carrier.jtExpressindo.apikey.lable')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tjtExpressindo('carrier.jtExpressindo.apikey.placeholder')}
            onClearData={onClearDataApiKey}
            error={!!errors?.jtExpress_apikey?.message}
            hiddenClose={!watch('jtExpress_apikey')}
            {...register('jtExpress_apikey')}
          />
          <FormHelperText className="text-red-600">{errors?.jtExpress_apikey?.message}</FormHelperText>
        </MixLabel>
        {errorInline && (
          <span className="text-red-600 ml-4 font-normal text-sm leading-4">{ConverUppercase(error(errorInline))}</span>
        )}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium leading-6">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tjtExpressindo('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.JTEXPRESS_Web} target="_blank" rel="noreferrer">
                {tjtExpressindo('register.now')}
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end">
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
          className="w-[160px] rounded-lg py-2 px-4 justify-center text-sm font-normal leading-6"
          onClick={handleSubmit(onSubmit)}
        >
          {t('button.connect')}
        </Button>
      </div>
    </div>
  );
}
