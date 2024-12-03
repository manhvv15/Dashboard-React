import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Input } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { trim } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { regexNumber, regexPhonenumberVN } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailAhamove, IConnectorCarrierAhamove } from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';

interface Props {
  onClose: () => void;
  onBack?: () => void;
  onRefetch: () => void;
  detailCarrier?: ICarrierDetailAhamove;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}

export default function Ahamove({
  onRefetch,
  onClose,
  detailCarrier,
  onBack,
  setChooseCarrier,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tAhamove } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object().shape({
    ahamove_phoneNumber: yup
      .string()
      .required(error('required'))
      .test({
        test: (value, ctx) => {
          const val = trim(value);
          if (val !== null && regexNumber.test(val as string)) {
            if (!regexPhonenumberVN.test(val as string)) {
              return ctx.createError({
                message: error('phone.invalid'),
              });
            }
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
  } = useForm<IConnectorCarrierAhamove>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.AHAMOVE,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('ahamove_userName', detailCarrier?.settings?.ahamove_userName);
      setValue('ahamove_phoneNumber', detailCarrier?.settings?.ahamove_phoneNumber);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');

    if (watch('ahamove_phoneNumber')) {
      setValue('ahamove_phoneNumber', trim(getValues('ahamove_phoneNumber')));
    }
  }, [watch('ahamove_userName'), watch('ahamove_phoneNumber')]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectorCarrierAhamove) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectorCarrierAhamove) => {
    data.accountId = data.ahamove_phoneNumber;
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
    mutationFn: (data: IConnectorCarrierAhamove) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectorCarrierAhamove) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.accountId = data.ahamove_phoneNumber;
    data.currency = currencyByCourier;
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
  const onClearUsername = () => {
    setValue('ahamove_userName', '', {
      shouldValidate: true,
    });
  };
  const onClearPhoneNumber = () => {
    setValue('ahamove_phoneNumber', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tAhamove('carrier.ahamove.username.label')} required={false}>
          <Input
            className="text-sm"
            type="text"
            hiddenClose={!watch('ahamove_userName')}
            onClearData={onClearUsername}
            placeholder={tAhamove('carrier.ahamove.username.placeholder')}
            {...register('ahamove_userName')}
          />
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tAhamove('carrier.ahamove.phone.label')} required>
          <Input
            className="text-sm"
            type="text"
            hiddenClose={!watch('ahamove_phoneNumber')}
            onClearData={onClearPhoneNumber}
            placeholder={tAhamove('carrier.ahamove.phone.placeholder')}
            error={!!errors?.ahamove_phoneNumber?.message}
            {...register('ahamove_phoneNumber')}
          />
          <FormHelperText className="text-red-600">{errors?.ahamove_phoneNumber?.message}</FormHelperText>
        </MixLabel>
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tAhamove('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium">
              <a href={GuideConnectCarrierLink.Ahamove_Web} target="_blank" rel="noreferrer">
                {tAhamove('register.now')}
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
