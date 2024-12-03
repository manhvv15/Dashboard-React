import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailBestExpress, IConnectCarrierBestExpress } from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Input } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { trim } from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
interface Props {
  onClose: () => void;
  onBack?: () => void;
  onRefetch: () => void;
  detailCarrier?: ICarrierDetailBestExpress;
  setChooseCarrier?: (component: string) => void;
  currencyByCourier?: string;
}

export default function BestExpress({
  onRefetch,
  onClose,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    bestex_username: yup.string().required(error('required')),
    bestex_password: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IConnectCarrierBestExpress>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.BESTEXPRESS,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('bestex_username', detailCarrier?.accountId ?? '');
      setValue('bestex_password', detailCarrier?.settings?.bestex_password);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('bestex_username')) {
      setValue('bestex_username', trim(getValues('bestex_username')));
    }
    if (watch('bestex_password')) {
      setValue('bestex_password', trim(getValues('bestex_password')));
    }
  }, [watch('bestex_username'), watch('bestex_password')]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierBestExpress) => updateCarrierOwnSystem(data),
  });
  const handleUpdateCarrier = (data: IConnectCarrierBestExpress) => {
    data.accountId = data.bestex_username;
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
    mutationFn: (data: IConnectCarrierBestExpress) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierBestExpress) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.accountId = data.bestex_username;
    data.currency = currencyByCourier;
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
  const onClearDataUserName = () => {
    setValue('bestex_username', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPasswowd = () => {
    setValue('bestex_password', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tShip4p('carrier.bestEx.email.phone.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tShip4p('carrier.bestEx.email.phone.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.bestex_username?.message}
            hiddenClose={!watch('bestex_username')}
            {...register('bestex_username')}
          />
          <FormHelperText className="text-red-600">{errors?.bestex_username?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tShip4p('carrier.bestEx.password.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={tShip4p('carrier.bestEx.password.placeholder')}
            onClearData={onClearDataPasswowd}
            error={!!errors?.bestex_password?.message}
            hiddenClose={!watch('bestex_password')}
            {...register('bestex_password')}
          />
          <FormHelperText className="text-red-600">{errors?.bestex_password?.message}</FormHelperText>
        </MixLabel>
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {t('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.bestEx_web} target="_blank" rel="noreferrer">
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
