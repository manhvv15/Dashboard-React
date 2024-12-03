import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { LENGTH_3, LENGTH_50 } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import {
  CARRIER_ID,
  ConverUppercase,
  GuideConnectCarrierLink,
  fedexAccountType,
  fielDefaultAccountTypeFedExExpress,
} from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { Options } from '@/types';
import { AccountType, ICarrierDetailFefexExpress, IConnectCarrierFedExExpress } from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Input, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { trim } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface Props {
  onClose: () => void;
  onBack?: () => void;
  onRefetch: () => void;
  setChooseCarrier?: (component: string) => void;
  currencyByCourier?: string;
  detailCarrier?: ICarrierDetailFefexExpress;
}

export default function FedExExpress({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tFedex } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    fedexJp_accountType: yup.string().required(error('required')),
    fedexJp_accountNumber: yup.string().required(error('required')),
    fedexJp_userName: yup.string().required(error('required')),
    fedexJp_clientId: yup
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
    fedexJp_clientSecret: yup
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
    fedexJp_childKey: yup.string().when(['fedexJp_accountType'], {
      is: (fedexJp_accountType: string) =>
        fedexJp_accountType !== fielDefaultAccountTypeFedExExpress.client_credentials,
      then: (rule) =>
        rule.required(error('required')).test({
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
    }),
    fedexJp_childSecret: yup.string().when(['fedexJp_accountType'], {
      is: (fedexJp_accountType: string) =>
        fedexJp_accountType !== fielDefaultAccountTypeFedExExpress.client_credentials,
      then: (rule) =>
        rule.required(error('required')).test({
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
    }),
  });

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IConnectCarrierFedExExpress>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.FedExExpress,
    },
  });

  const [currentAccountType, setCurrentAccountType] = useState<Options>({
    label: fedexAccountType.fedexAccountType[0]?.typeName as string,
    value: fedexAccountType.fedexAccountType[0]?.value as string,
    code: fedexAccountType.fedexAccountType[0]?.value as string,
    searchLabel: fedexAccountType.fedexAccountType[0]?.typeName as string,
  });
  const [visibleAccountType, setVisibleAccountType] = useState<boolean>(false);

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('fedexJp_clientId', detailCarrier?.settings?.fedexJp_clientId || '');
      setValue('fedexJp_clientSecret', detailCarrier?.settings?.fedexJp_clientSecret);
      setValue('fedexJp_userName', detailCarrier?.settings?.fedexJp_userName);
      setValue('fedexJp_childKey', detailCarrier?.settings?.fedexJp_childKey);
      setValue('fedexJp_childSecret', detailCarrier?.settings?.fedexJp_childSecret);
      setValue('fedexJp_accountNumber', detailCarrier.settings?.fedexJp_accountNumber);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('fedexJp_userName')) {
      setValue('fedexJp_userName', trim(getValues('fedexJp_userName')));
    }
    if (watch('fedexJp_clientId')) {
      setValue('fedexJp_clientId', trim(getValues('fedexJp_clientId')));
    }
    if (watch('fedexJp_clientSecret')) {
      setValue('fedexJp_clientSecret', trim(getValues('fedexJp_clientSecret')));
    }
    if (watch('fedexJp_childKey')) {
      setValue('fedexJp_childKey', trim(getValues('fedexJp_childKey')));
    }
    if (watch('fedexJp_childSecret')) {
      setValue('fedexJp_childSecret', trim(getValues('fedexJp_childSecret')));
    }
    if (watch('fedexJp_accountNumber')) {
      setValue('fedexJp_accountNumber', trim(getValues('fedexJp_accountNumber')));
    }
  }, [
    watch('fedexJp_userName'),
    watch('fedexJp_clientId'),
    watch('fedexJp_clientSecret'),
    watch('fedexJp_childKey'),
    watch('fedexJp_childSecret'),
    watch('fedexJp_accountNumber'),
  ]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierFedExExpress) => updateCarrierOwnSystem(data),
  });
  useEffect(() => {
    setValue('fedexJp_accountType', currentAccountType.value as string);
    if (currentAccountType.value?.includes(fielDefaultAccountTypeFedExExpress.client_credentials)) {
      setValue('fedexJp_childKey', '');
      setValue('fedexJp_childSecret', '');
    }
  }, [currentAccountType]);
  const handleUpdateCarrier = (data: IConnectCarrierFedExExpress) => {
    data.accountId = data.fedexJp_userName;
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
    mutationFn: (data: IConnectCarrierFedExExpress) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierFedExExpress) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.accountId = data.fedexJp_userName;
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
  const onChangeAccountType = (value: string) => {
    const val = fedexAccountType.fedexAccountType.find((i) => i.value.includes(value)) as AccountType;
    setCurrentAccountType({
      label: val.typeName,
      value: val.value,
      code: val.value,
      searchLabel: val.typeName,
    });
    setValue('fedexJp_accountType', val.value as string);
    if (!val.value?.includes(fielDefaultAccountTypeFedExExpress.client_credentials)) {
      setVisibleAccountType(true);
    } else {
      setVisibleAccountType(false);
    }
  };
  const onClearDataUserName = () => {
    setValue('fedexJp_userName', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientId = () => {
    setValue('fedexJp_clientId', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientSecret = () => {
    setValue('fedexJp_clientSecret', '', {
      shouldValidate: true,
    });
  };
  const onClearDataAccoutNumber = () => {
    setValue('fedexJp_accountNumber', '', {
      shouldValidate: true,
    });
  };
  const onClearDataChildKey = () => {
    setValue('fedexJp_childKey', '', {
      shouldValidate: true,
    });
  };
  const onClearDataChildSecret = () => {
    setValue('fedexJp_childSecret', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="scrollbar overflow-y-auto max-h-[500px]">
        <div className="mb-6">
          <MixLabel required={true} label={tFedex('carrier.fedex.accountType.label')}>
            <SelectPortal
              options={fedexAccountType.fedexAccountType.map((item: AccountType) => ({
                label: item.typeName,
                value: item.value,
              }))}
              onChange={(e) => onChangeAccountType(e as string)}
              placeholder={tFedex('fedex.accountType.placeholder')}
              value={currentAccountType.value || ''}
            />
          </MixLabel>
        </div>
        <div className="mb-6">
          <MixLabel required={true} label={tFedex('carrier.fedex.userName.label')}>
            <Input
              className="text-sm"
              type="text"
              placeholder={tFedex('carrier.fedex.userName.placeholder')}
              onClearData={onClearDataUserName}
              error={!!errors?.fedexJp_userName?.message}
              hiddenClose={!watch('fedexJp_userName')}
              {...register('fedexJp_userName')}
            />
            <FormHelperText className="text-red-600">{errors?.fedexJp_userName?.message}</FormHelperText>
          </MixLabel>
        </div>
        <div className="mb-6">
          <MixLabel required={true} label={tFedex('carrier.fedex.apiKey.label')}>
            <Input
              className="text-sm"
              type="password"
              placeholder={tFedex('carrier.fedex.apiKey.placeholder')}
              onClearData={onClearDataClientId}
              error={!!errors?.fedexJp_clientId?.message}
              hiddenClose={!watch('fedexJp_clientId')}
              {...register('fedexJp_clientId')}
            />
            <FormHelperText className="text-red-600">{errors?.fedexJp_clientId?.message}</FormHelperText>
          </MixLabel>
        </div>
        <div className="mb-6">
          <MixLabel required={true} label={tFedex('carrier.fedex.apiSecret.label')}>
            <Input
              className="text-sm"
              type={'password'}
              placeholder={tFedex('carrier.fedex.apiSecret.placeholder')}
              onClearData={onClearDataClientSecret}
              error={!!errors?.fedexJp_clientSecret?.message}
              hiddenClose={!watch('fedexJp_clientSecret')}
              {...register('fedexJp_clientSecret')}
            />
            <FormHelperText className="text-red-600">{errors?.fedexJp_clientSecret?.message}</FormHelperText>
          </MixLabel>
        </div>
        <div>
          <MixLabel required={true} label={tFedex('carrier.fedex.accountNumber.label')}>
            <Input
              className="text-sm"
              type="text"
              placeholder={tFedex('carrier.fedex.accountNumber.placeholder')}
              onClearData={onClearDataAccoutNumber}
              error={!!errors?.fedexJp_accountNumber?.message}
              hiddenClose={!watch('fedexJp_accountNumber')}
              {...register('fedexJp_accountNumber')}
            />
            <FormHelperText className="text-red-600">{errors?.fedexJp_accountNumber?.message}</FormHelperText>
          </MixLabel>
        </div>
        {visibleAccountType && (
          <div className="mt-6">
            <div className="mb-6">
              <MixLabel label={tFedex('carrier.fedex.childKey.label')} required={visibleAccountType}>
                <Input
                  className="text-sm"
                  type={'password'}
                  placeholder={tFedex('carrier.fedex.childKey.placeholder')}
                  onClearData={onClearDataChildKey}
                  error={!!errors?.fedexJp_childKey?.message}
                  hiddenClose={!watch('fedexJp_childKey')}
                  {...register('fedexJp_childKey')}
                />
                <FormHelperText className="text-red-600">{errors?.fedexJp_childKey?.message}</FormHelperText>
              </MixLabel>
            </div>
            <div>
              <MixLabel label={tFedex('carrier.fedex.childSecret.label')} required={visibleAccountType}>
                <Input
                  className="text-sm"
                  type={'password'}
                  placeholder={tFedex('carrier.fedex.childSecret.placeholder')}
                  onClearData={onClearDataChildSecret}
                  error={!!errors?.fedexJp_childSecret?.message}
                  hiddenClose={!watch('fedexJp_childSecret')}
                  {...register('fedexJp_childSecret')}
                />
              </MixLabel>
            </div>
          </div>
        )}
        {errorInline && (
          <span className="text-ic-red-6s ml-4 font-normal text-sm leading-4">
            {ConverUppercase(error(errorInline))}
          </span>
        )}
      </div>
      <div>
        <div className="mt-6 text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tFedex('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.FEDEX_Web} target="_blank" rel="noreferrer">
                {tFedex('register.now')}
              </a>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-4 justify-end">
        <Button
          type="button"
          size="40"
          variant="outlined"
          className="w-[160px] h-[40px] justify-center"
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
          className="w-[160px] h-[40px] justify-center text-sm font-normal leading-6 "
          onClick={handleSubmit(onSubmit)}
        >
          {t('button.connect')}
        </Button>
      </div>
    </div>
  );
}
