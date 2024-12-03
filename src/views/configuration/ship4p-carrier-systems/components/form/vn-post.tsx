import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { LENGTH_3, LENGTH_50 } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailVnPost, IConnectCarrierVNPOST } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailVnPost;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}
export default function VnPost({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tVNpost } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();

  const schema = yup.object({
    vnpost_customer_code: yup
      .string()
      .required(error('required'))
      .min(LENGTH_3, error('customerIDCourierMinLength3MaxLength50'))
      .max(LENGTH_50, error('customerIDCourierMinLength3MaxLength50')),
    vnpost_username: yup
      .string()
      .required(error('required'))
      .min(LENGTH_3, error('userNameCourierMinLength3MaxLength50'))
      .max(LENGTH_50, error('userNameCourierMinLength3MaxLength50')),
    vnpost_password: yup
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
  } = useForm<IConnectCarrierVNPOST>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.VNPOST,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('vnpost_password', detailCarrier?.settings?.vnpost_password);
      setValue('vnpost_username', detailCarrier?.settings?.vnpost_username);
      setValue('vnpost_customer_code', detailCarrier?.settings?.vnpost_customer_code);
      setValue('vnpost_contract_code', detailCarrier?.settings?.vnpost_contract_code);

      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('vnpost_username')) {
      setValue('vnpost_username', trim(getValues('vnpost_username')));
    }
    if (watch('vnpost_password')) {
      setValue('vnpost_password', trim(getValues('vnpost_password')));
    }
    if (watch('vnpost_customer_code')) {
      setValue('vnpost_customer_code', trim(getValues('vnpost_customer_code')));
    }
    if (watch('vnpost_contract_code')) {
      setValue('vnpost_contract_code', trim(getValues('vnpost_contract_code')));
    }
  }, [
    watch('vnpost_password'),
    watch('vnpost_username'),
    watch('vnpost_customer_code'),
    watch('vnpost_contract_code'),
  ]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierVNPOST) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierVNPOST) => {
    data.accountId = data.vnpost_username;
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
    mutationFn: (data: IConnectCarrierVNPOST) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierVNPOST) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.accountId = data.vnpost_username;
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
    setValue('vnpost_customer_code', '', {
      shouldValidate: true,
    });
  };
  const onClearDataUserName = () => {
    setValue('vnpost_username', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPassword = () => {
    setValue('vnpost_password', '', {
      shouldValidate: true,
    });
  };
  const onClearDataContractCode = () => {
    setValue('vnpost_contract_code', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel required={true} label={tVNpost('carrier.vnpost.customerId.label')}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tVNpost('carrier.vnpost.customerId.placeholder')}
            onClearData={onClearDataCustomerCode}
            error={!!errors?.vnpost_customer_code?.message}
            hiddenClose={!watch('vnpost_customer_code')}
            {...register('vnpost_customer_code')}
          />
          <FormHelperText className="text-red-600">{errors?.vnpost_customer_code?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={tVNpost('carrier.vnpost.username.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tVNpost('carrier.vnpost.username.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.vnpost_username?.message}
            hiddenClose={!watch('vnpost_username')}
            {...register('vnpost_username')}
          />
          <FormHelperText className="text-red-600">{errors?.vnpost_username?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={tVNpost('carrier.vnpost.password.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={tVNpost('carrier.vnpost.password.placeholder')}
            onClearData={onClearDataPassword}
            error={!!errors?.vnpost_password?.message}
            hiddenClose={!watch('vnpost_password')}
            {...register('vnpost_password')}
          />
          <FormHelperText className="text-red-600">{errors?.vnpost_password?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={tVNpost('carrier.vnpost.contractId.label')}>
          <Input
            className="text-sm"
            type="text"
            disabled={Object.keys(detailCarrier || {}).length > 0}
            placeholder={tVNpost('carrier.vnpost.contractId.placeholder')}
            onClearData={onClearDataContractCode}
            {...register('vnpost_contract_code')}
          />
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
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.VNPOST_Web} target="_blank" rel="noreferrer">
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
