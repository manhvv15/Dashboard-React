import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { LENGTH_3, LENGTH_50 } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailUSPSVia, IConnectCarrierUSPSViaEms } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailUSPSVia;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}
export default function USPSViaEms({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tUsps } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();

  const schema = yup.object({
    usps_customer_code: yup
      .string()
      .required(error('required'))
      .min(LENGTH_3, error('customerIDCourierMinLength3MaxLength50'))
      .max(LENGTH_50, error('customerIDCourierMinLength3MaxLength50')),
    usps_usename: yup
      .string()
      .required(error('required'))
      .min(LENGTH_3, error('userNameCourierMinLength3MaxLength50'))
      .max(LENGTH_50, error('userNameCourierMinLength3MaxLength50')),
    usps_password: yup
      .string()
      .required(error('required'))
      .min(LENGTH_3, error('passwordCourierMinLength3MaxLength50'))
      .max(LENGTH_50, error('passwordCourierMinLength3MaxLength50')),
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IConnectCarrierUSPSViaEms>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.USPSEMS,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('usps_password', detailCarrier?.settings?.usps_password);
      setValue('usps_usename', detailCarrier?.settings?.usps_usename);
      setValue('usps_customer_code', detailCarrier?.settings?.usps_customer_code);

      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('usps_usename')) {
      setValue('usps_usename', trim(getValues('usps_usename')));
    }
    if (watch('usps_customer_code')) {
      setValue('usps_customer_code', trim(getValues('usps_customer_code')));
    }
    if (watch('usps_password')) {
      setValue('usps_password', trim(getValues('usps_password')));
    }
  }, [watch('usps_usename'), watch('usps_customer_code'), watch('usps_password')]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierUSPSViaEms) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierUSPSViaEms) => {
    data.accountId = data.usps_usename;
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
    mutationFn: (data: IConnectCarrierUSPSViaEms) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierUSPSViaEms) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.accountId = data.usps_usename;
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
  const onClearDataCustomerCode = () => {
    setValue('usps_customer_code', '', {
      shouldValidate: true,
    });
  };
  const onClearDataUserName = () => {
    setValue('usps_usename', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPassword = () => {
    setValue('usps_password', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel required={true} label={tUsps('carrier.usps.customerId.label')}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tUsps('carrier.usps.customerId.placeholder')}
            onClearData={onClearDataCustomerCode}
            error={!!errors?.usps_customer_code?.message}
            hiddenClose={!watch('usps_customer_code')}
            {...register('usps_customer_code')}
          />
          <FormHelperText className="text-red-600">{errors?.usps_customer_code?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={tUsps('carrier.usps.username.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tUsps('carrier.usps.username.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.usps_usename?.message}
            hiddenClose={!watch('usps_usename')}
            {...register('usps_usename')}
          />
          <FormHelperText className="text-red-600">{errors?.usps_usename?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={tUsps('carrier.usps.password.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={tUsps('carrier.usps.password.placeholder')}
            onClearData={onClearDataPassword}
            error={!!errors?.usps_password?.message}
            hiddenClose={!watch('usps_password')}
            {...register('usps_password')}
          />
          <FormHelperText className="text-red-600">{errors?.usps_customer_code?.message}</FormHelperText>
        </MixLabel>
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium leading-6">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tUsps('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{tUsps('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.USPS_web} target="_blank" rel="noreferrer">
                {t('register.now')}
              </a>
            </span>
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
