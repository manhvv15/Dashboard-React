import { ChangeEvent } from 'react';

import { Button, FormHelperText, FormLabel, Input, Switch, Textarea } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { createPaypal, updatePaypal, updateStatusMerchantAccount } from '@/services/payment-method';
import { PaymentMethodEnum } from '@/types/enums/payment';
import { responseErrorCode } from '@/utils/common';
import { showToast } from '@/utils/toasts';

import { FormValuePaypal } from './Paypal';

interface Props {
  methods: UseFormReturn<FormValuePaypal, any>;
  index: number;
  item: FieldArrayWithId<FormValuePaypal, 'paypal', 'id'>;
  handleUpdateCollapse: () => void;
}

export default function PaypalItem({ methods, index, item, handleUpdateCollapse }: Props) {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { register } = methods;

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPaypal,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('createPaypalSuccess'),
      });
      queryClient.invalidateQueries(['getListPaypal']);
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;

      if (errorFrom) {
        responseErrorCode(errorFrom).forEach(({ name, message, type }) => {
          const mess = err.t(message);
          methods.setError(`paypal.${index}.${name}` as any, {
            type,
            message: mess,
          });
        });
        return;
      }
      showToast({
        type: 'error',
        summary: error(errorNormal),
      });
    },
  });

  const updateStatusMerchantAccountMutation = useMutation({
    mutationFn: updateStatusMerchantAccount,
    onSuccess: () => {
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

  const onUpdateStatusMerchantAccount = (e: ChangeEvent<HTMLInputElement>) => {
    updateStatusMerchantAccountMutation.mutate({
      isActive: e.target.checked,
      type: PaymentMethodEnum.Paypal,
    });
  };

  const updateMutation = useMutation({
    mutationFn: updatePaypal,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('updatePaypalSuccess'),
      });
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorFrom) {
        responseErrorCode(errorFrom).forEach(({ name, message, type }) => {
          const mess = err.t(message);
          methods.setError(`paypal.${index}.${name}` as any, {
            type,
            message: mess,
          });
        });
        return;
      }
      showToast({
        type: 'error',
        summary: error(errorNormal),
      });
    },
  });

  const handleSubmitForm = async () => {
    const check = await methods.trigger(`paypal.${index}`);
    if (check) {
      const getData = methods.watch(`paypal.${index}`);
      if (methods.getValues(`paypal.${index}.isEdit`)) {
        updateMutation.mutate({
          name: getData.name,
          externalAccountRequest: {
            id: getData.id as string,
            clientId: getData.clientId,
            clientSecrect: getData.clientSecrect,
            paymentFeePercent: Number(getData.paymentFeePercent),
            paymentFeeFixed: Number(getData.paymentFeeFixed),
            isActive: getData.status ? getData.status : true,
          },
        });
        return;
      }
      createMutation.mutate({
        clientId: getData.clientId,
        clientSecrect: getData.clientSecrect,
        name: getData.name,
        paymentFeePercent: Number(getData.paymentFeePercent),
        paymentFeeFixed: Number(getData.paymentFeeFixed),
        isActive: getData.status ? getData.status : true,
      });
    }
  };

  const errors = methods.formState.errors.paypal;

  return (
    <div className="p-5 rounded-lg border border-ic-ink-2s transition-all flex flex-col gap-y-4" key={item.id}>
      <div className="flex items-center justify-end">
        <div className=" flex items-center">
          <p className="text-base font-normal leading-6 text-ic-ink-6s mr-2">{common('activeStatus')}</p>
          <Switch
            {...register(`paypal.${index}.status`, {
              onChange(e) {
                onUpdateStatusMerchantAccount(e);
              },
            })}
          />
        </div>
      </div>
      <div>
        <FormLabel required>{common('accountName')}</FormLabel>
        <Input
          readOnly={!methods.watch(`paypal.${index}.isCollapse`)}
          placeholder={common('accountName')}
          hiddenClose
          feedbackInvalid={(errors ?? [])?.[index]?.name?.message}
          {...register(`paypal.${index}.name`)}
        />
        {(errors ?? [])?.[index]?.name?.message && (
          <FormHelperText error>{(errors ?? [])?.[index]?.name?.message}</FormHelperText>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleUpdateCollapse}
          className="text-sm font-normal leading-5 text-ic-primary-6s flex items-center"
        >
          {common('collapse')}
          <SvgIcon icon="arrow-v2" width={20} height={20} className="rotate-[-90deg]" />
        </button>
      </div>
      <div
        className={clsx(
          'transition-all overflow-hidden flex flex-col gap-y-4',
          item.isCollapse ? 'max-h-screen' : 'h-0',
        )}
      >
        <div>
          <FormLabel required>{common('clientID')}</FormLabel>
          <Input
            placeholder={common('clientID')}
            hiddenClose
            feedbackInvalid={(errors ?? [])?.[index]?.clientId?.message}
            {...register(`paypal.${index}.clientId`)}
          />
          {(errors ?? [])?.[index]?.clientId?.message && (
            <FormHelperText error>{(errors ?? [])?.[index]?.clientId?.message}</FormHelperText>
          )}
        </div>
        <div>
          <FormLabel required>{common('secretKey')}</FormLabel>
          <Textarea
            placeholder={common('secretKey')}
            className="w-full h-[120px]"
            feedbackInvalid={(errors ?? [])?.[index]?.clientSecrect?.message}
            {...register(`paypal.${index}.clientSecrect`)}
          />
          {(errors ?? [])?.[index]?.clientSecrect?.message && (
            <FormHelperText error>{(errors ?? [])?.[index]?.clientSecrect?.message}</FormHelperText>
          )}
        </div>

        <div>
          <FormLabel required>{`${common('transactionFeesCollectedFromBuyers')} (%)`}</FormLabel>
          <Input
            hiddenClose
            placeholder={`${common('transactionFeesCollectedFromBuyers')} (%)`}
            feedbackInvalid={(errors ?? [])?.[index]?.paymentFeePercent?.message}
            {...register(`paypal.${index}.paymentFeePercent`, {
              onChange(event) {
                const value = event.target.value.replace(/[^0-9.]/g, '');
                methods.setValue(`paypal.${index}.paymentFeePercent`, value);
              },
            })}
          />
          {(errors ?? [])?.[index]?.paymentFeePercent?.message && (
            <FormHelperText error>{(errors ?? [])?.[index]?.paymentFeePercent?.message}</FormHelperText>
          )}
        </div>
        <div>
          <FormLabel>{`${common('paymentFeeFixed')}`}</FormLabel>
          <Input
            hiddenClose
            placeholder={`${common('paymentFeeFixed')}`}
            feedbackInvalid={(errors ?? [])?.[index]?.paymentFeeFixed?.message}
            {...register(`paypal.${index}.paymentFeeFixed`, {
              onChange(event) {
                const value = event.target.value.replace(/[^0-9.]/g, '');
                methods.setValue(`paypal.${index}.paymentFeeFixed`, value);
              },
            })}
          />
          {(errors ?? [])?.[index]?.paymentFeeFixed?.message && (
            <FormHelperText error>{(errors ?? [])?.[index]?.paymentFeeFixed?.message}</FormHelperText>
          )}
        </div>
        <div className="flex justify-end">
          <Button
            className="px-10"
            loading={createMutation.isLoading || updateMutation.isLoading}
            onClick={handleSubmitForm}
          >
            {common('save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
