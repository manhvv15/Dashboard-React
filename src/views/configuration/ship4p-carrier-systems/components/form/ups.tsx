import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Input } from '@ichiba/ichiba-core-ui';
// import { Button, FormHelperText, Input, Select } from '@ichiba/ichiba-core-ui';
import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import {
  CARRIER_ID,
  ConverUppercase,
  GuideConnectCarrierLink,
} from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailUpsExpress, IConnectCarrierUpsExpress } from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';
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
  detailCarrier?: ICarrierDetailUpsExpress;
}

export default function UpsExpress({
  onClose,
  onRefetch,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tUps } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    // ups_accountType: yup.string().required(error('required')),
    ups_responseType: yup.string().required(error('required')),
    ups_clientId: yup.string().required(error('required')),
    ups_redirectUri: yup.string().required(error('required')),
    // ups_clientId: yup
    //   .string()
    //   .required(error('required'))
    //   .test({
    //     test: (value, ctx) => {
    //       const val = trim(value);
    //       if (val !== '' && val !== null) {
    //         if (val.length < LENGTH_3 || val.length > LENGTH_50) {
    //           return ctx.createError({
    //             message: error('tokenCourierMinLength3MaxLength50'),
    //           });
    //         }
    //       } else {
    //         return ctx.createError({
    //           message: error('required'),
    //         });
    //       }
    //       setErrorInline('');
    //       return true;
    //     },
    //   }),
    // ups_redirectUri: yup
    //   .string()
    //   .required(error('required'))
    //   .test({
    //     test: (value, ctx) => {
    //       const val = trim(value);
    //       if (val !== '' && val !== null) {
    //         if (val.length < LENGTH_3 || val.length > LENGTH_50) {
    //           return ctx.createError({
    //             message: error('tokenCourierMinLength3MaxLength50'),
    //           });
    //         }
    //       } else {
    //         return ctx.createError({
    //           message: error('required'),
    //         });
    //       }
    //       setErrorInline('');
    //       return true;
    //     },
    //   }),
  });

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IConnectCarrierUpsExpress>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.UPS,
    },
  });

  // const [currentAccountType, setCurrentAccountType] = useState<ItemSelectSearch>({
  //   label: uspsAccountType.uspsAccountType[0]?.typeName as string,
  //   value: uspsAccountType.uspsAccountType[0]?.value as string,
  // });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      // setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('ups_clientId', detailCarrier?.settings?.ups_clientId || '');
      setValue('ups_redirectUri', detailCarrier?.settings?.ups_redirectUri);
      setValue('ups_responseType', detailCarrier?.settings?.ups_responseType);
      // setValue('ups_accountNumber', detailCarrier.settings.ups_accountNumber);
      // setValue('ups_accountType', detailCarrier.settings.ups_accountType);
      // setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    // if (watch('ups_responseType')) {
    //   setValue('ups_responseType', trim(getValues('ups_responseType')));
    // }
    if (watch('ups_clientId')) {
      setValue('ups_clientId', trim(getValues('ups_clientId')));
    }
    if (watch('ups_redirectUri')) {
      setValue('ups_redirectUri', trim(getValues('ups_redirectUri')));
    }
    if (watch('ups_responseType')) {
      setValue('ups_responseType', trim(getValues('ups_responseType')));
    }
    // if (watch('ups_accountType')) {
    //   setValue('ups_accountType', trim(getValues('ups_accountType')));
    // }
  }, [
    // watch('ups_responseType'),
    watch('ups_clientId'),
    watch('ups_redirectUri'),
    watch('ups_responseType'),
    // watch('ups_accountType'),
  ]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierUpsExpress) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierUpsExpress) => {
    data.accountId = data.ups_clientId;
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
    mutationFn: (data: IConnectCarrierUpsExpress) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierUpsExpress) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.accountId = data.ups_clientId;
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
  // const onChangeAccountType = (value: string) => {
  //   const val = upsAccountType.upsAccountType.find((i) => i.value.includes(value)) as AccountType;
  //   setCurrentAccountType({
  //     label: val.typeName,
  //     value: val.value,
  //   });
  //   setValue('ups_accountType', val.value as string);
  // };
  const onClearDataUserName = () => {
    setValue('ups_responseType', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientId = () => {
    setValue('ups_clientId', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientSecret = () => {
    setValue('ups_redirectUri', '', {
      shouldValidate: true,
    });
  };
  // const onClearDataAccoutNumber = () => {
  //   setValue('ups_accountNumber', '', {
  //     shouldValidate: true,
  //   });
  // };
  return (
    <div>
      <div className="scrollbar overflow-y-auto max-h-[500px]">
        {/* <div className="mb-6">
          <MixLabel required={true} label={tUps('carrier.fedex.accountType.label')}>
            <Select
              options={uspsAccountType.uspsAccountType.map((item: AccountType) => ({
                label: item.typeName,
                value: item.value,
              }))}
              onChange={(e) => onChangeAccountType(e as string)}
              label={tUps('fedex.accountType.placeholder')}
              value={currentAccountType.label || ''}
            />
          </MixLabel>
        </div> */}
        <div className="mb-6">
          <MixLabel required={true} label={tUps('carrier.ups.clientId.label')}>
            <Input
              className="text-sm"
              type="text"
              placeholder={tUps('carrier.ups.clientId.placeholder')}
              onClearData={onClearDataUserName}
              error={!!errors?.ups_clientId?.message}
              hiddenClose={!watch('ups_clientId')}
              {...register('ups_clientId')}
            />
            <FormHelperText className="text-red-600">{errors?.ups_clientId?.message}</FormHelperText>
          </MixLabel>
        </div>
        <div className="mb-6">
          <MixLabel required={true} label={tUps('carrier.ups.responseType.label')}>
            <Input
              className="text-sm"
              type="text"
              placeholder={tUps('carrier.ups.responseType.placeholder')}
              onClearData={onClearDataClientId}
              error={!!errors?.ups_responseType?.message}
              hiddenClose={!watch('ups_responseType')}
              {...register('ups_responseType')}
            />
            <FormHelperText className="text-red-600">{errors?.ups_responseType?.message}</FormHelperText>
          </MixLabel>
        </div>
        <div className="mb-6">
          <MixLabel required={true} label={tUps('carrier.ups.redirectUri.label')}>
            <Input
              className="text-sm"
              type={'text'}
              placeholder={tUps('carrier.ups.redirectUri.placeholder')}
              onClearData={onClearDataClientSecret}
              error={!!errors?.ups_redirectUri?.message}
              hiddenClose={!watch('ups_redirectUri')}
              {...register('ups_redirectUri')}
            />
            <FormHelperText className="text-red-600">{errors?.ups_redirectUri?.message}</FormHelperText>
          </MixLabel>
        </div>
        {/* <div>
          <MixLabel label={tUps('carrier.fedex.accountNumber.label')}>
            <Input
              className="text-sm"
              type="text"
              placeholder={tUps('carrier.fedex.accountNumber.placeholder')}
              onClearData={onClearDataAccoutNumber}
              error={!!errors?.ups_accountNumber?.message}
              hiddenClose={!watch('ups_accountNumber')}
              {...register('ups_accountNumber')}
            />
          </MixLabel>
        </div> */}
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
                {tUps('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.UPS_web} target="_blank" rel="noreferrer">
                {tUps('register.now')}
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
