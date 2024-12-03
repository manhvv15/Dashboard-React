import { Dispatch, SetStateAction } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  FormLabel,
  Input,
  InputNumber,
} from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { WORKSPACEBYLV1 } from '@/constants/variables/common';
import { createStripe } from '@/services/payment-method';
import { responseErrorCode } from '@/utils/common';
import { showToast } from '@/utils/toasts';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export type FormValuePaypal = {
  name: string;
  publishableKey: string;
  secretKey: string;
  paymentFeePercent?: string;
  paymentFeeFixed?: string;
};

const ModalStripe = ({ open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const queryClient = useQueryClient();

  const schema = yup.object().shape({
    name: yup.string().required(error('fieldIsRequired')),
    publishableKey: yup.string().required(error('fieldIsRequired')),
    secretKey: yup.string().required(error('fieldIsRequired')),
    paymentFeePercent: yup.string().notRequired().nullable(),
    paymentFeeFixed: yup.string().notRequired().nullable(),
  });

  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
    reset,
    watch,
  } = useForm<FormValuePaypal>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: createStripe,
    onSuccess: () => {
      queryClient.invalidateQueries(['getAllPaymentMethod']);
      showToast({
        type: 'success',
        summary: common('createStripeSuccess'),
      });

      setOpen(false);
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      setOpen(false);
      if (errorFrom) {
        responseErrorCode(errorFrom).forEach(({ name, message, type }) => {
          const mess = err.t(message);
          setError(`paypal.${name}` as any, {
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

  const onSubmit = (data: FormValuePaypal) => {
    createMutation.mutate({
      workspaceId: WORKSPACEBYLV1,
      name: data.name,
      publishableKey: data.publishableKey,
      secretKey: data.secretKey,
      paymentFeeFixed: data.paymentFeeFixed ? Number(data.paymentFeeFixed.replaceAll(',', '')) : undefined,
      paymentFeePercent: data.paymentFeePercent ? Number(data.paymentFeePercent.replaceAll(',', '')) : undefined,
    });
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-end">
        <button onClick={handleClose}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full overflow-y-auto flex flex-col gap-y-4 max-h-[80vh]">
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
      </DialogBody>
      <DialogFooter className="flex gap-x-3">
        <Button onClick={handleClose} color="danger" variant="filled">
          {common('cancel')}
        </Button>
        <Button loading={createMutation.isLoading} onClick={handleSubmit(onSubmit)}>
          {common('save')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalStripe;
