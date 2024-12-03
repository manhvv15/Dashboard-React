import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { LENGTH_3, LENGTH_50 } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailDhl, IConnectCarrierDHL } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailDhl;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}

export default function DhlUs({
  onRefetch,
  onClose,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tDhl } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    dhl_apiKey: yup.string().required(error('required')),
    dhl_apiSecret: yup.string().required(error('required')),
    dhl_userName: yup
      .string()
      .required(error('required'))
      .test({
        test: (value, ctx) => {
          const val = trim(value);
          if (val !== '' && val !== null) {
            if (val.length < LENGTH_3 || val.length > LENGTH_50) {
              return ctx.createError({
                message: error('userNameCourierMinLength3MaxLength50'),
              });
            }
          } else {
            return ctx.createError({
              message: error('required'),
            });
          }
          return true;
        },
      }),
    dhl_accountNumber: yup.string().required(error('required')),
  });
  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IConnectCarrierDHL>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.DHLUS,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('dhl_userName', detailCarrier?.accountId ?? '');
      setValue('dhl_accountNumber', detailCarrier?.settings?.dhl_accountNumber);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('dhl_userName')) {
      setValue('dhl_userName', trim(getValues('dhl_userName')));
    }
    if (watch('dhl_accountNumber')) {
      setValue('dhl_accountNumber', trim(getValues('dhl_accountNumber')));
    }
  }, [watch('dhl_userName'), watch('dhl_accountNumber')]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierDHL) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierDHL) => {
    data.accountId = data.dhl_userName;
    updateCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('toast.create.carier.title'),
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
    mutationFn: (data: IConnectCarrierDHL) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierDHL) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.accountId = data.dhl_userName;
    data.currency = currencyByCourier;
    data.isMultiplePackage = true;
    createCarrierAccount.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: t('toast.create.carier.title'),
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
    setValue('dhl_userName', '', {
      shouldValidate: true,
    });
  };
  const onClearDataAccountNumber = () => {
    setValue('dhl_accountNumber', '', {
      shouldValidate: true,
    });
  };
  const onClearDataApiKey = () => {
    setValue('dhl_apiKey', '', {
      shouldValidate: true,
    });
  };
  const onClearDataApiSecret = () => {
    setValue('dhl_apiSecret', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tDhl('dhl.username.lable')} required>
          <Input
            className="text-sm"
            type="text"
            hiddenClose={!watch('dhl_userName')}
            placeholder={tDhl('dhl.username.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.dhl_userName?.message}
            {...register('dhl_userName')}
          />
          <FormHelperText className="text-red-600">{errors?.dhl_userName?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tDhl('dhl.apikey.lable')} required>
          <Input
            className="text-sm"
            type="text"
            hiddenClose={!watch('dhl_apiKey')}
            placeholder={tDhl('dhl.apikey.placeholder')}
            onClearData={onClearDataApiKey}
            error={!!errors?.dhl_apiKey?.message}
            {...register('dhl_apiKey')}
          />
          <FormHelperText className="text-red-600">{errors?.dhl_apiKey?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tDhl('dhl.apisecret.lable')} required>
          <Input
            className="text-sm"
            type="text"
            hiddenClose={!watch('dhl_apiSecret')}
            placeholder={tDhl('dhl.apisecret.placeholder')}
            onClearData={onClearDataApiSecret}
            error={!!errors?.dhl_apiSecret?.message}
            {...register('dhl_apiSecret')}
          />
          <FormHelperText className="text-red-600">{errors?.dhl_apiSecret?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tDhl('dhl.accountNumber.lable')} required>
          <Input
            className="text-sm"
            type="text"
            hiddenClose={!watch('dhl_accountNumber')}
            placeholder={tDhl('dhl.accountNumber.placeholder')}
            onClearData={onClearDataAccountNumber}
            error={!!errors?.dhl_accountNumber?.message}
            {...register('dhl_accountNumber')}
          />
          <FormHelperText className="text-red-600">{errors?.dhl_accountNumber?.message}</FormHelperText>
        </MixLabel>
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tDhl('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{tDhl('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.DHL_Web} target="_blank" rel="noreferrer">
                {tDhl('register.now')}
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
