import { useEffect, useState } from 'react';

import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { regexEmail, regexNumber, regexPhonenumberVN } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID, GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { createCarrierAccountSystem, updateCarrierOwnSystem } from '@/services/ship4p/carrier-system';
import { ICarrierDetailVtPost, IConnectCarrierVTPOST } from '@/types/ship4p/carrier';
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
  detailCarrier?: ICarrierDetailVtPost;
  currencyByCourier?: string;
  setChooseCarrier?: (component: string) => void;
}

export default function VtPost({
  onRefetch,
  onClose,
  detailCarrier,
  setChooseCarrier,
  onBack,
  currencyByCourier,
}: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: tVtpost } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [errorInline, setErrorInline] = useState<string>();
  const schema = yup.object({
    vtpost_username: yup
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
          if (val !== null && !regexNumber.test(val as string)) {
            if (!regexEmail.test(val as string)) {
              return ctx.createError({
                message: error('email.invalid'),
              });
            }
          }
          setErrorInline('');
          return true;
        },
      }),
    vtpost_password: yup.string().required(error('required')),
  });

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IConnectCarrierVTPOST>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      courierId: CARRIER_ID.VTPOST,
    },
  });

  useEffect(() => {
    if (detailCarrier?.courierId) {
      setValue('vtpost_username', detailCarrier?.accountId ?? '');
      setValue('vtpost_password', detailCarrier?.settings?.vtpost_password);
      setValue('vtpost_contractId', detailCarrier?.settings?.vtpost_contractId);
      setValue('id', detailCarrier?.id);
    }
  }, [detailCarrier]);

  useEffect(() => {
    setErrorInline('');
    if (watch('vtpost_username')) {
      setValue('vtpost_username', trim(getValues('vtpost_username')));
    }
    if (watch('vtpost_password')) {
      setValue('vtpost_password', trim(getValues('vtpost_password')));
    }
  }, [watch('vtpost_username'), watch('vtpost_password')]);

  const updateCarrierAccount = useMutation({
    mutationFn: (data: IConnectCarrierVTPOST) => updateCarrierOwnSystem(data),
  });

  const handleUpdateCarrier = (data: IConnectCarrierVTPOST) => {
    data.accountId = data.vtpost_username;
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
    mutationFn: (data: IConnectCarrierVTPOST) => createCarrierAccountSystem(data),
  });

  const onSubmit = (data: IConnectCarrierVTPOST) => {
    if (Object.keys(detailCarrier || {}).length > 0) {
      handleUpdateCarrier(data);
      return;
    }
    data.currency = currencyByCourier;
    data.accountId = data.vtpost_username;
    data.vtpost_contractId = data.vtpost_username;
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
    setValue('vtpost_username', '', {
      shouldValidate: true,
    });
  };
  const onClearDataPasswowd = () => {
    setValue('vtpost_password', '', {
      shouldValidate: true,
    });
  };
  return (
    <div>
      <div className="mb-6">
        <MixLabel label={tVtpost('carrier.vtpost.email.phone.label')} required={true}>
          <Input
            className="text-sm"
            type="text"
            placeholder={tVtpost('carrier.vtpost.email.phone.placeholder')}
            onClearData={onClearDataUserName}
            error={!!errors?.vtpost_username?.message}
            hiddenClose={!watch('vtpost_username')}
            {...register('vtpost_username')}
          />
          <FormHelperText className="text-red-600">{errors?.vtpost_username?.message}</FormHelperText>
        </MixLabel>
      </div>
      <div className="mb-6">
        <MixLabel label={tVtpost('carrier.vtpost.password.label')} required={true}>
          <Input
            className="text-sm"
            type={'password'}
            placeholder={tVtpost('carrier.vtpost.password.placeholder')}
            onClearData={onClearDataPasswowd}
            error={!!errors?.vtpost_password?.message}
            hiddenClose={!watch('vtpost_password')}
            {...register('vtpost_password')}
          />
          <FormHelperText className="text-red-600">{errors?.vtpost_password?.message}</FormHelperText>
        </MixLabel>
        {errorInline && <span className="text-red-600 ml-4 font-normal text-sm leading-4">{error(errorInline)}</span>}
      </div>
      <div>
        <div className="text-black mb-4">
          <div className="flex">
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.Guide} target="_blank" rel="noreferrer">
                {tVtpost('carrier.refer.here')}
              </a>
            </span>
          </div>
          <div className="flex">
            <span className="mr-2 text-sm">{t('carrier.dont.account')} </span>
            <span className="cursor-pointer text-ic-primary-6s text-sm font-medium ">
              <a href={GuideConnectCarrierLink.VTP_Web} target="_blank" rel="noreferrer">
                {tVtpost('register.now')}
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
