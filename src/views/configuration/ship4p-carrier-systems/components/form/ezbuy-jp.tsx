import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailEzbuy, IConnectCarrierEZbuyJP } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailEzbuy;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}

export default function EzbuyJP({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tEzbuyJp } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();

  const schema = yup.object({
    ezbuy_accountName: yup.string().required(error('required')),
    ezbuy_customerCode: yup.string().required(error('required')),
    ezbuy_partnerkey: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IConnectCarrierEZbuyJP>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.EZBUYJP,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('courierId', detailCarrier?.courierId);
      setValue('ezbuy_accountName', detailCarrier?.settings?.ezbuy_accountName);
      setValue('ezbuy_customerCode', detailCarrier?.settings?.ezbuy_customerCode);
      setValue('ezbuy_partnerkey', detailCarrier?.settings?.ezbuy_partnerkey);

      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);
  useEffect(() => {
    setErrorInline('');
    if (watch('ezbuy_accountName')) {
      setValue('ezbuy_accountName', trim(getValues('ezbuy_accountName')));
    }
    if (watch('ezbuy_partnerkey')) {
      setValue('ezbuy_partnerkey', trim(getValues('ezbuy_partnerkey')));
    }
    if (watch('ezbuy_customerCode')) {
      setValue('ezbuy_customerCode', trim(getValues('ezbuy_customerCode')));
    }
  }, [watch('ezbuy_accountName'), watch('ezbuy_customerCode'), watch('ezbuy_partnerkey')]);
  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierEZbuyJP) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierEZbuyJP) => {
    data.ezbuy_accountName = data.ezbuy_accountName;
    data.accountId = data.ezbuy_accountName;
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
    mutationFn: (data: IConnectCarrierEZbuyJP) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierEZbuyJP) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.ezbuy_accountName = data.ezbuy_accountName;
    data.accountId = data.ezbuy_accountName;
    data.currency = currencyByCourier;
    data.courierId = CARRIER_ID.EZBUYJP;
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
    setValue('ezbuy_accountName', '', {
      shouldValidate: true,
    });
  };
  const onClearDataCustomerCode = () => {
    setValue('ezbuy_customerCode', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPartnerkey = () => {
    setValue('ezbuy_partnerkey', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tEzbuyJp('carrier.ezbuy.username.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tEzbuyJp('carrier.ezbuy.username.placholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.ezbuy_accountName?.message}
            hiddenClose={!watch('ezbuy_accountName')}
            {...register('ezbuy_accountName')}
          />
          <FormHelperText className="text-red-600">{errors?.ezbuy_accountName?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tEzbuyJp('carrier.ezbuy.customerCode.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tEzbuyJp('carrier.ezbuy.customerCode.placholder')}
            onClearData={onClearDataCustomerCode}
            error={!!errors?.ezbuy_customerCode?.message}
            hiddenClose={!watch('ezbuy_customerCode')}
            {...register('ezbuy_customerCode')}
          />
          <FormHelperText className="text-red-600">{errors?.ezbuy_customerCode?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tEzbuyJp('carrier.ezbuy.partnerkey.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={tEzbuyJp('carrier.ezbuy.partnerkey.placholder')}
            onClearData={onClearDataPartnerkey}
            error={!!errors?.ezbuy_partnerkey?.message}
            hiddenClose={!watch('ezbuy_partnerkey')}
            {...register('ezbuy_partnerkey')}
          />
          <FormHelperText className="text-red-600">{errors?.ezbuy_partnerkey?.message}</FormHelperText>
        </MixLabel>
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.EZBUYJP_web} target="_blank" rel="noreferrer">
                {tEzbuyJp('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{tEzbuyJp('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tEzbuyJp('register.now')}
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
