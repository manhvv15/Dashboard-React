import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailGhtk, IConnectCarrierGhtk } from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Input } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface Props {
  onClose: () => void;
  onBack?: () => void;
  onRefetch: () => void;
  detailCarrier?: ICarrierDetailGhtk;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}
export default function Ghtk({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    phoneNumber: yup.string().required(error('required')),
    token: yup.string().required(error('required')),
    shiping_services: yup.string(),
  });
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IConnectCarrierGhtk>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.GHTK,
    },
  });
  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('phoneNumber', detailCarrier?.settings?.phoneNumber);
      setValue('token', detailCarrier?.settings?.token);
    }
  }, [detailCarrier]);
  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierGhtk) => updateCarrierOwnSystem(data),
  });
  const handleUpdateCarrier = (data: IConnectCarrierGhtk) => {
    data.accountId = data.phoneNumber;
    updateCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('success.title'),
          detail: t('toast.update.carrier.success'),
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
    mutationFn: (data: IConnectCarrierGhtk) => createCarrierAccountSystem(data),
  });
  const onSubmit = (data: IConnectCarrierGhtk) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      data.id = detailCarrier?.id;
      handleUpdateCarrier(data);
      return;
    }
    data.shiping_services = 'fly';
    data.currency = currencyByCourier;
    data.accountId = data.phoneNumber;
    createCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('success.title'),
          detail: t('toast.create.carrier.success'),
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
  const onClearDataPhoneNumber = () => {
    setValue('phoneNumber', '', {
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
        <MixLabel label={t('phoneNumber.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={t('phoneNumber.placeholder')}
            onClearData={onClearDataPhoneNumber}
            error={!!errors?.phoneNumber?.message}
            hiddenClose={!watch('phoneNumber')}
            {...register('phoneNumber')}
          />
          <FormHelperText className="text-red-600">{errors?.phoneNumber?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="text-sm text-neutral-10 mb-6">
        <MixLabel label={t('token.label')} required={true}>
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
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium leading-6">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {ship4p('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('noAccount')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.Ghtk_Web} target="_blank" rel="noreferrer">
                {ship4p('registerNow')}
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
