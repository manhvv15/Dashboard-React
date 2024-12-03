import { ChangeEvent, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, FormLabel, Input, InputNumber, Switch } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { LocaleNamespace } from '@/constants/enums/common';
import { getStripe, updateStatusMerchantAccount, updateStripe } from '@/services/payment-method';
import { MerchantAccountStatusEnum, MerchantAccountTypeEnum } from '@/types/payment-methods/enum';

import { WORKSPACEBYLV1 } from '@/constants/variables/common';
import { PaymentMethodEnum } from '@/types/enums/payment';
import { responseErrorCode } from '@/utils/common';
import { showToast } from '@/utils/toasts';
import ModalDeleteFromMyMethod from '../dialogs/ModalDeleteFromMyMethod';

const secretKeyStripe =
  '******************************************************************************************************************';

export type FormValuePaypal = {
  name: string;
  publishableKey: string;
  secretKey: string;
  paymentFeePercent?: string;
  paymentFeeFixed?: string;
  status?: boolean | null;
  isActive: boolean;
  isCollapse: boolean;
  isEdit: boolean;
  id?: string;
};
const Stripe = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const [open, setOpen] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required(error('fieldIsRequired')),
    publishableKey: yup.string().required(error('fieldIsRequired')),
    secretKey: yup.string().required(error('fieldIsRequired')),
    paymentFeePercent: yup.string().notRequired().nullable(),
    paymentFeeFixed: yup.string().notRequired().nullable(),
    status: yup.boolean().notRequired().nullable(),
    isActive: yup.boolean(),
    id: yup.string().nullable().notRequired(),
  });

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    setError,
    watch,
  } = useForm<FormValuePaypal>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { refetch } = useQuery({
    queryKey: ['getStripe'],
    queryFn: () => getStripe(),
    onSuccess: (res) => {
      const data = res.data.externalAccounts[0];

      setValue('name', data.name);
      setValue('publishableKey', data.publishableKey);
      setValue('paymentFeeFixed', String(data.paymentFeeFixed));
      setValue('paymentFeePercent', String(data.paymentFeePercent));
      setValue('id', data.id);
      setValue('isActive', data.isActive);
      setValue('status', res.data.status === MerchantAccountStatusEnum.IntegrationSuccessfull);
    },
  });

  const updateStatusMerchantAccountMutation = useMutation({
    mutationFn: updateStatusMerchantAccount,
    onSuccess: () => {
      refetch();
      showToast({
        type: 'success',
        summary: common('updateSuccess'),
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('updateFailed'),
      });
    },
  });

  const onUpdateStatusMerchantAccount = (event: ChangeEvent<HTMLInputElement>) => {
    updateStatusMerchantAccountMutation.mutate({
      isActive: event.target.checked,
      type: PaymentMethodEnum.Stripe,
    });
  };

  const updateMutation = useMutation(updateStripe, {
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('updateStripeSuccess'),
      });
    },
    onError: (err: any) => {
      console.log('err', err);
      const { errorNormal, errorFrom } = err;
      if (errorNormal) {
        showToast({
          type: 'error',
          summary: error('updateStripeFail'),
        });
        return;
      }

      if (errorFrom) {
        responseErrorCode(err.errorFrom).forEach(({ name, message, type }) => {
          const mess = error(message);
          setError(name, { type, message: mess });
        });
      }
    },
  });

  const onSubmit = (data: FormValuePaypal) => {
    const secret = data.secretKey === secretKeyStripe ? '' : data.secretKey;

    const newData = {
      name: data.name,
      workspaceId: WORKSPACEBYLV1,
      externalAccountRequest: {
        id: data.id as string,
        publishableKey: data.publishableKey,
        secretKey: secret,
        paymentFeePercent: data.paymentFeePercent ? Number(data.paymentFeePercent?.replaceAll(',', '')) : undefined,
        paymentFeeFixed: data.paymentFeeFixed ? Number(data.paymentFeeFixed?.replaceAll(',', '')) : undefined,
        isActive: data.isActive,
        isDelete: false,
      },
    };

    updateMutation.mutate(newData);
  };

  return (
    <div className="relative w-full h-full  flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-lg font-normal leading-6 text-ic-ink-6s"></p>
        <div className="flex items-center gap-x-2">
          <span className="text-base font-normal leading-6 text-ic-ink-6s">{common('activeStatus')}</span>
          <Switch
            {...register('status', {
              onChange(event) {
                onUpdateStatusMerchantAccount(event);
              },
            })}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <FormLabel required>{common('accountName')}</FormLabel>
          <Input
            placeholder={common('accountName')}
            hiddenClose
            feedbackInvalid={errors?.name?.message}
            {...register(`name`)}
          />
          {errors?.name?.message && <FormHelperText error>{errors?.name?.message}</FormHelperText>}
        </div>
        <div>
          <FormLabel required>{common('secretKey')}</FormLabel>
          <Input
            placeholder={common('secretKey')}
            hiddenClose
            defaultValue={secretKeyStripe}
            feedbackInvalid={errors?.secretKey?.message}
            {...register(`secretKey`)}
          />
          {errors?.secretKey?.message && <FormHelperText error>{errors?.secretKey?.message}</FormHelperText>}
        </div>
        <div>
          <FormLabel required>{common('publishableKey')}</FormLabel>
          <Input
            placeholder={common('publishableKey')}
            hiddenClose
            feedbackInvalid={errors?.publishableKey?.message}
            {...register(`publishableKey`)}
          />
          {errors?.publishableKey?.message && <FormHelperText error>{errors?.publishableKey?.message}</FormHelperText>}
        </div>

        <div>
          <FormLabel>{common('paymentFeePercent')}</FormLabel>
          <InputNumber
            placeholder={common('paymentFeePercent')}
            hiddenClose
            feedbackInvalid={errors?.paymentFeePercent?.message}
            {...register(`paymentFeePercent`)}
            value={watch('paymentFeePercent')}
          />
          {errors?.paymentFeePercent?.message && (
            <FormHelperText error>{errors?.paymentFeePercent?.message}</FormHelperText>
          )}
        </div>
        <div>
          <FormLabel>{common('paymentFeeFixed')}</FormLabel>
          <InputNumber
            placeholder={common('paymentFeeFixed')}
            hiddenClose
            feedbackInvalid={errors?.paymentFeeFixed?.message}
            {...register(`paymentFeeFixed`)}
            value={watch('paymentFeeFixed')}
          />
          {errors?.paymentFeeFixed?.message && (
            <FormHelperText error>{errors?.paymentFeeFixed?.message}</FormHelperText>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            loading={updateStatusMerchantAccountMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
            className="w-20"
          >
            {common('save')}
          </Button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end w-full gap-x-4 border-t border-ic-ink-2s py-4">
        <Button onClick={() => setOpen(true)} color="danger" variant="filled">
          {common('removeFromMyMethod')}
        </Button>
      </div>
      <ModalDeleteFromMyMethod open={open} setOpen={setOpen} type={MerchantAccountTypeEnum.Stripe} />
    </div>
  );
};

export default Stripe;
