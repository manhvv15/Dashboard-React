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
import { ICarrierDetailJTExpress, IConnectCarrierJTExpressSing } from '@/types/ship4p/carrier';
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
  currencyByCourier?: string;
  onRefetch: () => void;
  detailCarrier?: ICarrierDetailJTExpress;
  setChooseCarrier?: (component: string) => void;
}

export default function JtExpressSing({
  onClose,
  onRefetch,
  detailCarrier,
  onBack,
  setChooseCarrier,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tJTExpressSing } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();

  const schema = yup.object({
    jtExpress_password: yup.string().required(error('required')),
    jtExpress_email: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IConnectCarrierJTExpressSing>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.JTExpressSing,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('jtExpress_password', detailCarrier?.settings?.jtExpress_password);
      setValue('jtExpress_email', detailCarrier?.settings?.jtExpress_email);
    }
  }, [detailCarrier]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierJTExpressSing) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierJTExpressSing) => {
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
    mutationFn: (data: IConnectCarrierJTExpressSing) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierJTExpressSing) => {
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
    if (watch('jtExpress_email')) {
      setValue('jtExpress_email', trim(getValues('jtExpress_email')));
    }
  }, [watch('jtExpress_password'), watch('jtExpress_email')]);
  const onClearDataUserName = () => {
    setValue('jtExpress_password', '', {
      shouldValidate: true,
    });
  };
  const onClearDataEmail = () => {
    setValue('jtExpress_email', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tJTExpressSing('carrier.jtExpresssing.email.lable')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tJTExpressSing('carrier.jtExpresssing.email.placeholder')}
            onClearData={onClearDataEmail}
            error={!!errors?.jtExpress_email?.message}
            hiddenClose={!watch('jtExpress_email')}
            {...register('jtExpress_email')}
          />
          <FormHelperText className="text-red-600">{errors?.jtExpress_email?.message}</FormHelperText>
        </MixLabel>
        {errorInline && (
          <span className="text-red-600 ml-4 font-normal text-sm leading-4">{ConverUppercase(error(errorInline))}</span>
        )}
        <MixLabel label={tJTExpressSing('carrier.jtExpresssing.password.lable')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tJTExpressSing('carrier.jtExpresssing.password.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.jtExpress_password?.message}
            hiddenClose={!watch('jtExpress_password')}
            {...register('jtExpress_password')}
          />
          <FormHelperText className="text-red-600">{errors?.jtExpress_password?.message}</FormHelperText>
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
                {tJTExpressSing('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.JTEXPRESS_Web} target="_blank" rel="noreferrer">
                {tJTExpressSing('register.now')}
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
