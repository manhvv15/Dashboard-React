import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { LENGTH_3, LENGTH_50 } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailEms, IConnectCarrierEMS } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailEms;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}

export default function Ems({ onClose, onRefetch, detailCarrier, setChooseCarrier, onBack, currencyByCourier }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tEms } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [errorMessage, setErrorMessage] = useState('');
  const schema = yup.object({
    ems_tokenKey: yup
      .string()
      .required(error('required'))
      .test({
        test: (value, ctx) => {
          const val = trim(value);
          if (val !== '' && val !== null) {
            if (val.length < LENGTH_3) {
              return ctx.createError({
                message: error('tokenCourierMinLength3MaxLength50'),
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
    // ems_accessKey: yup
    //   .string()
    //   .required(error('tokenApi.required'))
    //   .test({
    //     test: (value, ctx) => {
    //       const val = trim(value);
    //       if (val !== '' && val !== null) {
    //         if (val.length < LENGTH_3) {
    //           return ctx.createError({
    //             message: error('tokenCourierMinLength3MaxLength50'),
    //           });
    //         }
    //       } else {
    //         return ctx.createError({
    //           message: error('required'),
    //         });
    //       }

    //       return true;
    //     },
    //   }),
    // ems_secretKey: yup
    //   .string()
    //   .required(error('tokenApi.required'))
    //   .test({
    //     test: (value, ctx) => {
    //       const val = trim(value);
    //       if (val !== '' && val !== null) {
    //         if (val.length < LENGTH_3) {
    //           return ctx.createError({
    //             message: error('tokenCourierMinLength3MaxLength50'),
    //           });
    //         }
    //       } else {
    //         return ctx.createError({
    //           message: error('required'),
    //         });
    //       }

    //       return true;
    //     },
    //   }),
    ems_username: yup
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
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IConnectCarrierEMS>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.EMS,
    },
  });

  const { showToast } = useApp();
  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('id', detailCarrier?.id);
      setValue('ems_username', detailCarrier?.settings?.ems_username);
      setValue('ems_tokenKey', detailCarrier.settings?.ems_tokenKey);
      setValue('ems_accessKey', detailCarrier.settings?.ems_accessKey);
      setValue('ems_secretKey', detailCarrier.settings?.ems_secretKey);
    }
  }, [detailCarrier]);

  useEffect(() => {
    if (watch('ems_tokenKey')) {
      setValue('ems_tokenKey', trim(getValues('ems_tokenKey')));
    }
    if (watch('ems_accessKey')) {
      setValue('ems_accessKey', trim(getValues('ems_accessKey')));
    }
    if (watch('ems_secretKey')) {
      setValue('ems_secretKey', trim(getValues('ems_secretKey')));
    }
    if (watch('ems_username')) {
      setValue('ems_username', trim(getValues('ems_username')));
    }
  }, [watch('ems_username'), watch('ems_tokenKey'), watch('ems_accessKey'), watch('ems_secretKey')]);

  const createCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierEMS) => createCarrierAccountSystem(data),
  });

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierEMS) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierEMS) => {
    data.accountId = data.ems_username;
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
            setErrorMessage(error(message));
          });
        }
        if (errorNormal) {
          setErrorMessage(error(errorNormal));
        }
      },
    });
  };

  const onSubmit = (data: IConnectCarrierEMS) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.accountId = data.ems_username;
    data.currency = currencyByCourier;
    data.courierId = CARRIER_ID.EMS;
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
            setErrorMessage(mess);
          });
        }
        if (errorNormal) {
          setErrorMessage(error(errorNormal));
        }
      },
    });
  };

  useEffect(() => {
    setErrorMessage('');
  }, [watch('ems_tokenKey'), watch('ems_username'), watch('ems_accessKey'), watch('ems_secretKey')]);
  const onClearDataUserName = () => {
    setValue('ems_username', '', {
      shouldValidate: true,
    });
  };
  const onClearDataMerchantToken = () => {
    setValue('ems_tokenKey', '', {
      shouldValidate: true,
    });
  };
  // const onClearDataAccessKey = () => {
  //   setValue('ems_accessKey', '', {
  //     shouldValidate: true,
  //   });
  // };
  // const onClearDataSecretKey = () => {
  //   setValue('ems_secretKey', '', {
  //     shouldValidate: true,
  //   });
  // };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tEms('carrier.ems.username.label')} required={true}>
          <Input
            type="text"
            className="text-sm"
            hiddenClose={!watch('ems_username')}
            placeholder={tEms('carrier.ems.username.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.ems_username?.message}
            {...register('ems_username')}
          />
          <FormHelperText className="text-red-600">{errors?.ems_username?.message}</FormHelperText>
        </MixLabel>
      </div>
      {/* <div className="mb-6">
        <MixLabel label={tEms('carrier.ems.accessKey.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            hiddenClose={!watch('ems_accessKey')}
            placeholder={tEms('carrier.ems.accessKey.placeholder')}
            error={!!errors?.ems_accessKey?.message}
            onClearData={onClearDataAccessKey}
            feedbackInvalid={errors?.ems_accessKey?.message}
            {...register('ems_accessKey')}
          />
          <FormHelperText className="text-red-600">{errors?.ems_accessKey?.message}</FormHelperText>
        </MixLabel>
      </div> */}
      {/* <div className="mb-6">
        <MixLabel label={tEms('carrier.ems.secretKey.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            hiddenClose={!watch('ems_secretKey')}
            placeholder={tEms('carrier.ems.secretKey.placeholder')}
            error={!!errors?.ems_secretKey?.message}
            onClearData={onClearDataSecretKey}
            feedbackInvalid={errors?.ems_secretKey?.message}
            {...register('ems_secretKey')}
          />
          <FormHelperText className="text-red-600">{errors?.ems_secretKey?.message}</FormHelperText>
        </MixLabel>
      </div> */}
      <div className="mb-6">
        <MixLabel label={tEms('carrier.ems.merchantCode.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            hiddenClose={!watch('ems_tokenKey')}
            placeholder={tEms('carrier.ems.merchantCode.placeholder')}
            error={!!errors?.ems_tokenKey?.message}
            onClearData={onClearDataMerchantToken}
            feedbackInvalid={errors?.ems_tokenKey?.message}
            {...register('ems_tokenKey')}
          />
          <FormHelperText className="text-red-600">{errors?.ems_tokenKey?.message}</FormHelperText>
        </MixLabel>
        {errorMessage && <span className="text-ic-red-6s ml-4 font-normal text-xs leading-4">{errorMessage}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium leading-6">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tEms('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex justify-items-center">
            <span className="mr-2 text-sm flex">{tEms('carrier.dont.account')}</span>
            <span className="cursor-pointer text-ic-primary-6s font-medium text-sm">
              <a href={GuideConnectCarrierLink.EMS_Web} target="_blank" rel="noreferrer">
                {tEms('register.now')}
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
