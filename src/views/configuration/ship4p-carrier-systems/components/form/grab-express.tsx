import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { LENGTH_3, LENGTH_50 } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import {
  CARRIER_ID,
  ConverUppercase,
  GuideConnectCarrierLink,
} from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailGrabExpress, IConnectCarrierGrabExpress } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailGrabExpress;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}

export default function GrabExpress({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tGrab } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    grab_username: yup.string().required(error('required')),
    grab_clientSecret: yup
      .string()
      .required(error('required'))
      .test({
        test: (value, ctx) => {
          const val = trim(value);
          if (val !== '' && val !== null) {
            if (val.length < LENGTH_3 || val.length > LENGTH_50) {
              return ctx.createError({
                message: error('tokenCourierMinLength3MaxLength50'),
              });
            }
          } else {
            return ctx.createError({
              message: error('required'),
            });
          }
          setErrorInline('');
          return true;
        },
      }),
    grab_clientId: yup
      .string()
      .required(error('required'))
      .test({
        test: (value, ctx) => {
          const val = trim(value);
          if (val !== '' && val !== null) {
            if (val.length < LENGTH_3 || val.length > LENGTH_50) {
              return ctx.createError({
                message: error('tokenCourierMinLength3MaxLength50'),
              });
            }
          } else {
            return ctx.createError({
              message: error('required'),
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
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IConnectCarrierGrabExpress>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.GrabExpress,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('grab_clientId', detailCarrier?.settings?.grab_clientId || '');
      setValue('grab_clientSecret', detailCarrier?.settings?.grab_clientSecret);
      setValue('grab_username', detailCarrier?.settings?.grab_username);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('grab_clientId')) {
      setValue('grab_clientId', trim(getValues('grab_clientId')));
    }
    if (watch('grab_clientSecret')) {
      setValue('grab_clientSecret', trim(getValues('grab_clientSecret')));
    }
    if (watch('grab_username')) {
      setValue('grab_username', trim(getValues('grab_username')));
    }
  }, [watch('grab_clientId'), watch('grab_clientSecret'), watch('grab_username')]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierGrabExpress) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierGrabExpress) => {
    data.accountId = data.grab_username;
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
    mutationFn: (data: IConnectCarrierGrabExpress) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierGrabExpress) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.accountId = data.grab_username;
    data.currency = currencyByCourier;
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
    setValue('grab_username', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientId = () => {
    setValue('grab_clientId', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClienSecret = () => {
    setValue('grab_clientSecret', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tGrab('carrier.grap.username.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            disabled={Object.keys(detailCarrier || {}).length > 0}
            placeholder={tGrab('carrier.grap.username.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.grab_username?.message}
            hiddenClose={!watch('grab_username')}
            {...register('grab_username')}
          />
          <FormHelperText className="text-red-600">{errors?.grab_username?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tGrab('carrier.grap.clientId.label')} required={true}>
          <Input
            className="text-sm"
            type="password"
            placeholder={tGrab('carrier.grap.clientId.placeholder')}
            onClearData={onClearDataClientId}
            error={!!errors?.grab_clientId?.message}
            hiddenClose={!watch('grab_clientId')}
            {...register('grab_clientId')}
          />
          <FormHelperText className="text-red-600">{errors?.grab_clientId?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tGrab('carrier.grap.clientSecret.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={tGrab('carrier.grap.clientSecret.placeholder')}
            onClearData={onClearDataClienSecret}
            error={!!errors?.grab_clientSecret?.message}
            hiddenClose={!watch('grab_clientSecret')}
            {...register('grab_clientSecret')}
          />
          <FormHelperText className="text-red-600">{errors?.grab_clientSecret?.message}</FormHelperText>
        </MixLabel>
        {errorInline && (
          <span className="text-red-600 ml-4 font-normal text-sm leading-4">{ConverUppercase(error(errorInline))}</span>
        )}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tGrab('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{tGrab('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.GRAP_Web} target="_blank" rel="noreferrer">
                {tGrab('register.now')}
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
