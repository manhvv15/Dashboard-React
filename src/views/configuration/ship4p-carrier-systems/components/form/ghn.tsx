import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { LENGTH_3, LENGTH_50, regexNumberClient } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import {
  CARRIER_ID,
  ConverUppercase,
  GuideConnectCarrierLink,
} from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailGhn, IConnectCarrierGHN } from '@/types/ship4p/carrier';
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
  setChooseCarrier?: (component: string) => void;
  currencyByCourier?: string;
  detailCarrier?: ICarrierDetailGhn;
}

export default function Ghn({ onClose, onRefetch, detailCarrier, setChooseCarrier, onBack, currencyByCourier }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tGhn } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    ghn_shopId: yup.string().required(error('required')).matches(regexNumberClient, error('ghn.shopId.invalid')),
    ghn_clientId: yup.string().required(error('required')).matches(regexNumberClient, error('ghn.clientId.invalid')),
    ghn_tokenApi: yup
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
  } = useForm<IConnectCarrierGHN>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.GHN,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('accountId', detailCarrier?.accountId);
      setValue('courierId', detailCarrier?.courierId);
      setValue('ghn_shopId', detailCarrier?.settings?.ghn_shopId || '');
      setValue('ghn_clientId', detailCarrier?.settings?.ghn_clientId);
      setValue('ghn_tokenApi', detailCarrier?.settings?.ghn_tokenApi);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('ghn_shopId')) {
      setValue('ghn_shopId', trim(getValues('ghn_shopId')));
    }
    if (watch('ghn_clientId')) {
      setValue('ghn_clientId', trim(getValues('ghn_clientId')));
    }
    if (watch('ghn_tokenApi')) {
      setValue('ghn_tokenApi', trim(getValues('ghn_tokenApi')));
    }
  }, [watch('ghn_shopId'), watch('ghn_clientId'), watch('ghn_tokenApi')]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierGHN) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierGHN) => {
    data.accountId = data.ghn_shopId;
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
    mutationFn: (data: IConnectCarrierGHN) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierGHN) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.accountId = data.ghn_shopId;
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
  const onClearDataShopId = () => {
    setValue('ghn_shopId', '', {
      shouldValidate: true,
    });
  };
  const onClearDataClientId = () => {
    setValue('ghn_clientId', '', {
      shouldValidate: true,
    });
  };
  const onClearDataToken = () => {
    setValue('ghn_tokenApi', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tGhn('carrier.ghn.shopId.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tGhn('carrier.ghn.shopId.placeholder')}
            onClearData={onClearDataShopId}
            error={!!errors?.ghn_shopId?.message}
            hiddenClose={!watch('ghn_shopId')}
            {...register('ghn_shopId')}
          />
          <FormHelperText className="text-red-600">{errors?.ghn_shopId?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tGhn('carrier.ghn.clientId.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tGhn('carrier.ghn.clientId.placeholder')}
            onClearData={onClearDataClientId}
            error={!!errors?.ghn_clientId?.message}
            hiddenClose={!watch('ghn_clientId')}
            {...register('ghn_clientId')}
          />
          <FormHelperText className="text-red-600">{errors?.ghn_clientId?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tGhn('carrier.ghn.tokenApi.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={tGhn('carrier.ghn.tokenApi.placeholder')}
            onClearData={onClearDataToken}
            error={!!errors?.ghn_tokenApi?.message}
            hiddenClose={!watch('ghn_tokenApi')}
            {...register('ghn_tokenApi')}
          />
          <FormHelperText className="text-red-600">{errors?.ghn_tokenApi?.message}</FormHelperText>
        </MixLabel>
        {errorInline && (
          <span className="text-red-600 ml-4 font-normal text-sm leading-4">{ConverUppercase(error(errorInline))}</span>
        )}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium leading-6">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tGhn('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{tGhn('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.GHN_Web} target="_blank" rel="noreferrer">
                {tGhn('register.now')}
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
