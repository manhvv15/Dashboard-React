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
import { regexEmail } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import {
  CARRIER_ID,
  ConverUppercase,
  GuideConnectCarrierLink,
} from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailShippo, IConnectCarrierGoShippo } from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';

interface Props {
  onClose: () => void;
  onBack?: () => void;
  onRefetch: () => void;
  detailCarrier?: ICarrierDetailShippo;
  setChooseCarrier?: (component: string) => void;
  currencyByCourier?: string;
}

export default function ShippoUsps({
  onClose,
  onRefetch,
  detailCarrier,
  onBack,
  setChooseCarrier,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();

  const schema = yup.object({
    token: yup.string().required(error('required')),
    email: yup
      .string()
      .required(error('required'))
      .test({
        test: (value, ctx) => {
          const val = trim(value);
          if (!regexEmail.test(val as string)) {
            return ctx.createError({
              message: error('email.invalid'),
            });
          }
          setErrorInline('');
          return true;
        },
      }),
  });

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IConnectCarrierGoShippo>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.SHIPPOUSPS,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('token', detailCarrier?.settings?.token);
      setValue('email', detailCarrier?.settings?.email);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierGoShippo) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierGoShippo) => {
    data.accountId = data.email;
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
    mutationFn: (data: IConnectCarrierGoShippo) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierGoShippo) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.accountId = data.email;
    data.isMultiplePackage = true;
    data.currency = currencyByCourier;
    data.courierId = CARRIER_ID.SHIPPOUSPS;
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
  useEffect(() => {
    setErrorInline('');
    if (watch('token')) {
      setValue('token', trim(getValues('token')));
    }
    if (watch('email')) {
      setValue('email', trim(getValues('email')));
    }
  }, [watch('token'), watch('email')]);
  const onClearDataToken = () => {
    setValue('token', '', {
      shouldValidate: true,
    });
  };
  const onClearDataUserName = () => {
    setValue('email', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <MixLabel label={t('email')} required={true}>
        <Input
          className="text-sm"
          type="text"
          placeholder={t('email.placeholder')}
          onClearData={onClearDataUserName}
          error={!!errors?.token?.message}
          hiddenClose={!watch('email')}
          {...register('email')}
        />
        <FormHelperText className="text-red-600">{errors?.email?.message}</FormHelperText>
      </MixLabel>
      <div className="mb-6">
        <MixLabel label={t('token')} required={true}>
          <Input
            className="text-sm"
            type="password"
            placeholder={t('token.placeholder')}
            onClearData={onClearDataToken}
            error={!!errors?.token?.message}
            hiddenClose={!watch('token')}
            {...register('token')}
          />
          <FormHelperText className="text-red-600">{errors?.token?.message}</FormHelperText>
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
                {t('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.USPS_web} target="_blank" rel="noreferrer">
                {t('register.now')}
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
