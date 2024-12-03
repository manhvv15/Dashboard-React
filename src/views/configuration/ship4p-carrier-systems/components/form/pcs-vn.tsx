import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailPcs, IConnectCarrierPCSVN } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailPcs;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}

export default function PcsVn({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tPcs } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();

  const schema = yup.object({
    pcs_username: yup.string().required(error('required')),
    pcs_password: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IConnectCarrierPCSVN>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.PCSVN,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('courierId', detailCarrier?.courierId);
      setValue('pcs_username', detailCarrier?.settings?.pcs_username);
      setValue('pcs_accountId', detailCarrier?.settings?.pcs_accountId);
      setValue('pcs_password', detailCarrier?.settings?.pcs_password);

      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);
  useEffect(() => {
    setErrorInline('');
    if (watch('pcs_username')) {
      setValue('pcs_username', trim(getValues('pcs_username')));
    }
    if (watch('pcs_password')) {
      setValue('pcs_password', trim(getValues('pcs_password')));
    }
  }, [watch('pcs_username'), watch('pcs_password')]);
  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierPCSVN) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierPCSVN) => {
    data.pcs_accountId = data.pcs_username;
    data.accountId = data.pcs_username;
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
    mutationFn: (data: IConnectCarrierPCSVN) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierPCSVN) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.pcs_accountId = data.pcs_username;
    data.accountId = data.pcs_username;
    data.currency = currencyByCourier;
    data.courierId = CARRIER_ID.PCSVN;
    data.isMultiplePackage = true;
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
    setValue('pcs_username', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPassword = () => {
    setValue('pcs_password', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tPcs('carrier.pcs.username.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tPcs('carrier.pcs.username.placholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.pcs_username?.message}
            hiddenClose={!watch('pcs_username')}
            {...register('pcs_username')}
          />
          <FormHelperText className="text-red-600">{errors?.pcs_username?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tPcs('carrier.pcs.password.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={tPcs('carrier.pcs.password.placholder')}
            onClearData={onClearDataPassword}
            error={!!errors?.pcs_password?.message}
            hiddenClose={!watch('pcs_password')}
            {...register('pcs_password')}
          />
          <FormHelperText className="text-red-600">{errors?.pcs_password?.message}</FormHelperText>
        </MixLabel>
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.PCS_Web} target="_blank" rel="noreferrer">
                {tPcs('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{tPcs('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tPcs('register.now')}
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
