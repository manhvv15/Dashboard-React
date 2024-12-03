import { useEffect } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailNinjavan, IConnectCarrierNINJAVAN } from '@/types/ship4p/carrier';
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
  currencyByCourier?: string;
  countryCode?: string;
  detailCarrier?: ICarrierDetailNinjavan;
}

export default function Ninjavan({ onClose, onRefetch, onBack, detailCarrier, currencyByCourier, countryCode }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();

  const schema = yup.object({
    ninjavan_name: yup.string().required(error('required')),
    ninjavan_clientId: yup.string().required(error('required')),
    ninjavan_secret: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IConnectCarrierNINJAVAN>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.NINJAVAN,
    },
  });

  useEffect(() => {
    if (detailCarrier) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('ninjavan_name', detailCarrier?.settings?.ninjavan_name);
      setValue('courierId', detailCarrier?.courierId);
      setValue('ninjavan_clientId', detailCarrier?.settings?.ninjavan_clientId);
      setValue('ninjavan_secret', detailCarrier?.settings?.ninjavan_secret);
      setValue('ninjavan_countryCode', detailCarrier?.settings?.ninjavan_countryCode);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierNINJAVAN) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierNINJAVAN) => {
    data.accountId = data.ninjavan_name;
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
            showToast({ type: 'error', detail: mess });
          });
        }
        if (errorNormal) {
          showToast({
            type: 'error',
            detail: error(errorNormal),
          });
        }
      },
    });
  };

  const createCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierNINJAVAN) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierNINJAVAN) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.ninjavan_countryCode = countryCode ?? '';
    data.accountId = data.ninjavan_name;
    createCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('success.title'),
          detail: t('toast.create.carier.success'),
        });
        onRefetch();
        onClose();
      },
      onError: (e: any) => {
        const { errorNormal, errorFrom } = e;
        if (errorFrom) {
          responseErrorCode(errorFrom).forEach(({ message }) => {
            const mess = error(message);
            showToast({ type: 'error', detail: mess });
          });
        }
        if (errorNormal) {
          showToast({
            type: 'error',
            detail: error(errorNormal),
          });
        }
      },
    });
  };

  const onClearDataName = () => {
    setValue('ninjavan_name', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientId = () => {
    setValue('ninjavan_clientId', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientSecret = () => {
    setValue('ninjavan_secret', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={ship4p('ninjavan.userName.label')} required>
          <Input
            className="text-sm"
            type="text"
            placeholder={ship4p('ninjavan.userName.placeholder')}
            onClearData={onClearDataName}
            error={!!errors?.ninjavan_name?.message}
            {...register('ninjavan_name')}
          />
          <FormHelperText className="text-red-600">{errors?.ninjavan_name?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={ship4p('carrier.clientId.label')} required>
          <Input
            className="text-sm"
            type="text"
            placeholder={ship4p('carrier.clientId.placeholder')}
            onClearData={onClearDataClientId}
            error={!!errors?.ninjavan_clientId?.message}
            hiddenClose={!watch('ninjavan_clientId')}
            {...register('ninjavan_clientId')}
          />
          <FormHelperText className="text-red-600">{errors?.ninjavan_clientId?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={ship4p('carrier.client.secret.label')} required>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={ship4p('carrier.client.secret.placeholder')}
            onClearData={onClearDataClientSecret}
            error={!!errors?.ninjavan_secret?.message}
            hiddenClose={!watch('ninjavan_secret')}
            {...register('ninjavan_secret')}
          />
          <FormHelperText className="text-red-600">{errors?.ninjavan_secret?.message}</FormHelperText>
        </MixLabel>
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
            <span className="mr-2 text-sm">{ship4p('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.ninjavan_web} target="_blank" rel="noreferrer">
                {ship4p('register.now')}
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
          {ship4p('button.connect')}
        </Button>
      </div>
    </div>
  );
}
