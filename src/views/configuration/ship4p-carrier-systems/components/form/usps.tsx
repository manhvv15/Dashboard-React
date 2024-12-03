import { useEffect, useRef, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { LENGTH_3, LENGTH_50 } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import {
  CARRIER_ID,
  ConverUppercase,
  GuideConnectCarrierLink,
  uspsAccountType,
} from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { Options } from '@/types';
import { AccountType, ICarrierDetailUspsExpress, IConnectCarrierUspsExpress } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailUspsExpress;
  currencyByCourier?: string;
  onSetVisibleWarehouseMapping?: () => void;
}

export default function UspsExpress({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: usps } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const myElementRef = useRef<HTMLDivElement>(null);
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    usps_accountType: yup.string().required(error('required')),
    usps_userName: yup.string().required(error('required')),
    usps_mid: yup.string().required(error('required')),
    usps_crid: yup.string().required(error('required')),
    usps_paymentMID: yup.string().required(error('required')),
    usps_paymentCRID: yup.string().required(error('required')),
    usps_paymentAccountType: yup.string().required(error('required')),
    usps_paymentAccountNumber: yup.string().required(error('required')),
    usps_paymentManifestMID: yup.string().required(error('required')),
    usps_clientId: yup
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
    usps_clientSecret: yup
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
    usps_accountNumber: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IConnectCarrierUspsExpress>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.USPS,
      usps_accountType: uspsAccountType.uspsAccountType[0]?.value,
      usps_paymentAccountType: uspsAccountType.uspsAccountType[0]?.value,
    },
  });

  const [currentAccountType, setCurrentAccountType] = useState<Options>({
    label: uspsAccountType.uspsAccountType[0]?.typeName as string,
    value: uspsAccountType.uspsAccountType[0]?.value as string,
  });
  const [currentAccountTypePayment, setCurrentAccountTypePayment] = useState<Options>({
    label: uspsAccountType.uspsAccountType[0]?.typeName as string,
    value: uspsAccountType.uspsAccountType[0]?.value as string,
  });
  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);

      setValue('usps_crid', detailCarrier?.settings?.usps_crid || '');
      setValue('usps_mid', detailCarrier?.settings?.usps_mid || '');
      setValue('usps_clientId', detailCarrier?.settings?.usps_clientId || '');
      setValue('usps_clientSecret', detailCarrier?.settings?.usps_clientSecret);
      setValue('usps_userName', detailCarrier?.settings?.usps_userName);
      setValue('usps_accountNumber', detailCarrier.settings?.usps_accountNumber);
      setValue('usps_accountType', detailCarrier.settings?.usps_accountType);

      setValue('usps_paymentAccountNumber', detailCarrier?.settings?.usps_paymentAccountNumber || '');
      setValue('usps_paymentAccountType', detailCarrier?.settings?.usps_paymentAccountType || '');
      setValue('usps_paymentManifestMID', detailCarrier?.settings?.usps_paymentManifestMID || '');
      setValue('usps_paymentCRID', detailCarrier?.settings?.usps_paymentCRID || '');
      setValue('usps_paymentMID', detailCarrier?.settings?.usps_paymentMID || '');
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);
  useEffect(() => {
    setErrorInline('');
    if (watch('usps_userName')) {
      setValue('usps_userName', trim(getValues('usps_userName')));
    }
    if (watch('usps_clientId')) {
      setValue('usps_clientId', trim(getValues('usps_clientId')));
    }
    if (watch('usps_clientSecret')) {
      setValue('usps_clientSecret', trim(getValues('usps_clientSecret')));
    }
    if (watch('usps_accountNumber')) {
      setValue('usps_accountNumber', trim(getValues('usps_accountNumber')));
    }
    if (watch('usps_accountType')) {
      setValue('usps_accountType', trim(getValues('usps_accountType')));
    }
  }, [
    watch('usps_userName'),
    watch('usps_clientId'),
    watch('usps_clientSecret'),
    watch('usps_accountNumber'),
    watch('usps_accountType'),
  ]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierUspsExpress) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierUspsExpress) => {
    data.accountId = data.usps_userName;
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
    mutationFn: (data: IConnectCarrierUspsExpress) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierUspsExpress) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.accountId = data.usps_userName;
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
  const onChangeAccountTypeOwner = (value: string) => {
    const val = uspsAccountType.uspsAccountType.find((e) => e.value.includes(value)) as AccountType;
    setCurrentAccountTypePayment({
      label: val.typeName,
      value: val.value,
    });
    setValue('usps_paymentAccountType', val.value);
  };
  const onChangeAccountType = (value: string) => {
    const val = uspsAccountType.uspsAccountType.find((i) => i.value.includes(value)) as AccountType;
    setCurrentAccountType({
      label: val.typeName,
      value: val.value,
    });
    setValue('usps_accountType', val.value as string);
  };
  const onClearDataUserName = () => {
    setValue('usps_userName', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientId = () => {
    setValue('usps_clientId', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientSecret = () => {
    setValue('usps_clientSecret', '', {
      shouldValidate: true,
    });
  };
  const onClearDataAccoutNumber = () => {
    setValue('usps_accountNumber', '', {
      shouldValidate: true,
    });
  };
  const onClearDataAccountNumberPayment = () => {
    setValue('usps_paymentAccountNumber', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPaymentMID = () => {
    setValue('usps_paymentMID', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPaymentCRID = () => {
    setValue('usps_paymentCRID', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPaymentMainfestMID = () => {
    setValue('usps_paymentManifestMID', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="scrollbar scroll overflow-y-auto max-h-[500px]" ref={myElementRef}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <MixLabel required={true} label={usps('carrier.fedex.accountType.label')}>
              <SelectPortal
                options={uspsAccountType.uspsAccountType.map((item: AccountType) => ({
                  label: item.typeName,
                  value: item.value,
                }))}
                onChange={(e) => onChangeAccountType(e as string)}
                placeholder={usps('fedex.accountType.placeholder')}
                value={currentAccountType.label || ''}
              />
            </MixLabel>
          </div>
          <div>
            <MixLabel required={true} label={usps('carrier.fedex.userName.label')}>
              <Input
                className="text-sm"
                type="text"
                placeholder={usps('carrier.fedex.userName.placeholder')}
                onClearData={onClearDataUserName}
                error={!!errors?.usps_userName?.message}
                hiddenClose={!watch('usps_userName')}
                {...register('usps_userName')}
              />
              <FormHelperText className="text-red-600">{errors?.usps_userName?.message}</FormHelperText>
            </MixLabel>
          </div>
          <div>
            <MixLabel label={usps('carrier.usps.crid')} required>
              <Input
                className="text-sm"
                type="text"
                placeholder={usps('carrier.usps.crid.placeholder')}
                onClearData={onClearDataAccoutNumber}
                error={!!errors?.usps_crid?.message}
                hiddenClose={!watch('usps_crid')}
                {...register('usps_crid')}
              />
              <FormHelperText className="text-red-600">{errors?.usps_crid?.message}</FormHelperText>
            </MixLabel>
          </div>
          <div>
            <MixLabel label={usps('carrier.usps.mid')} required>
              <Input
                className="text-sm"
                type="text"
                placeholder={usps('carrier.usps.mid.placeholder')}
                onClearData={onClearDataAccoutNumber}
                error={!!errors?.usps_mid?.message}
                hiddenClose={!watch('usps_mid')}
                {...register('usps_mid')}
              />
              <FormHelperText className="text-red-600">{errors?.usps_mid?.message}</FormHelperText>
            </MixLabel>
          </div>
          <div>
            <MixLabel required={true} label={usps('carrier.fedex.clientId.label')}>
              <Input
                className="text-sm"
                type="password"
                placeholder={usps('carrier.fedex.clientId.placeholder')}
                onClearData={onClearDataClientId}
                error={!!errors?.usps_clientId?.message}
                hiddenClose={!watch('usps_clientId')}
                {...register('usps_clientId')}
              />
              <FormHelperText className="text-red-600">{errors?.usps_clientId?.message}</FormHelperText>
            </MixLabel>
          </div>
          <div className="mb-4">
            <MixLabel required={true} label={usps('carrier.fedex.clientSecret.label')}>
              <Input
                className="text-sm"
                type={'password'}
                placeholder={usps('carrier.fedex.clientSecret.placeholder')}
                onClearData={onClearDataClientSecret}
                error={!!errors?.usps_clientSecret?.message}
                hiddenClose={!watch('usps_clientSecret')}
                {...register('usps_clientSecret')}
              />
              <FormHelperText className="text-red-600">{errors?.usps_clientSecret?.message}</FormHelperText>
            </MixLabel>
          </div>
        </div>
        <div>
          <MixLabel label={usps('carrier.fedex.accountNumber.label')} required>
            <Input
              className="text-sm"
              type="text"
              placeholder={usps('carrier.fedex.accountNumber.placeholder')}
              onClearData={onClearDataAccoutNumber}
              error={!!errors?.usps_accountNumber?.message}
              hiddenClose={!watch('usps_accountNumber')}
              {...register('usps_accountNumber')}
            />
            <FormHelperText className="text-red-600">{errors?.usps_accountNumber?.message}</FormHelperText>
          </MixLabel>
        </div>
        <div className="p-2 w-full border border-ic-ink-2s rounded-md  mt-6">
          <div className="flex w-full h-full justify-between items-center mb-4 font-medium">
            <span>{t('usps.payment.authorization')}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <MixLabel label={usps('carrier.usps.payment.crid')} required>
                <Input
                  className="text-sm"
                  type="text"
                  placeholder={usps('carrier.usps.payment.crid.placeholder')}
                  onClearData={onClearDataPaymentCRID}
                  error={!!errors?.usps_paymentCRID?.message}
                  hiddenClose={!watch('usps_paymentCRID')}
                  {...register('usps_paymentCRID')}
                />
                <FormHelperText className="text-red-600">{errors?.usps_paymentCRID?.message}</FormHelperText>
              </MixLabel>
            </div>
            <div>
              <MixLabel label={usps('carrier.usps.payment.mid')} required>
                <Input
                  className="text-sm"
                  type="text"
                  placeholder={usps('carrier.usps.payment.mid.placeholder')}
                  onClearData={onClearDataPaymentMID}
                  error={!!errors?.usps_paymentMID?.message}
                  hiddenClose={!watch('usps_paymentMID')}
                  {...register('usps_paymentMID')}
                />
                <FormHelperText className="text-red-600">{errors?.usps_paymentMID?.message}</FormHelperText>
              </MixLabel>
            </div>
            <div>
              <MixLabel label={usps('carrier.usps.payment.manifestMID')} required>
                <Input
                  className="text-sm"
                  type="text"
                  placeholder={usps('carrier.usps.payment.manifestMID.placeholder')}
                  onClearData={onClearDataPaymentMainfestMID}
                  error={!!errors?.usps_paymentManifestMID?.message}
                  hiddenClose={!watch('usps_paymentManifestMID')}
                  {...register('usps_paymentManifestMID')}
                />
                <FormHelperText className="text-red-600">{errors?.usps_paymentManifestMID?.message}</FormHelperText>
              </MixLabel>
            </div>
            <div>
              <MixLabel required={true} label={usps('carrier.usps.payment.accountType')}>
                <SelectPortal
                  options={uspsAccountType.uspsAccountType.map((item: AccountType) => ({
                    label: item.typeName,
                    value: item.value,
                  }))}
                  onChange={(e) => onChangeAccountTypeOwner(e as string)}
                  placeholder={usps('carrier.usps.payment.accountType.placeholder')}
                  value={currentAccountTypePayment.label || ''}
                />
              </MixLabel>
            </div>
          </div>
          <div className="mt-4">
            <MixLabel label={usps('carrier.usps.payment.accountNumber')} required>
              <Input
                className="text-sm"
                type="text"
                placeholder={usps('carrier.usps.payment.accountNumber.placeholder')}
                onClearData={onClearDataAccountNumberPayment}
                error={!!errors?.usps_paymentAccountNumber?.message}
                hiddenClose={!watch('usps_paymentAccountNumber')}
                {...register('usps_paymentAccountNumber')}
              />
              <FormHelperText className="text-red-600">{errors?.usps_paymentAccountNumber?.message}</FormHelperText>
            </MixLabel>
          </div>
        </div>
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
                {usps('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{usps('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.FEDEX_Web} target="_blank" rel="noreferrer">
                {usps('register.now')}
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
