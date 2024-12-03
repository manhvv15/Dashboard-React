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
  Textarea,
} from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { createPaypal } from '@/services/payment-method';
import { responseErrorCode } from '@/utils/common';
import { showToast } from '@/utils/toasts';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export type FormValuePaypal = {
  name: string;
  clientId: string;
  clientSecrect: string;
  paymentFeePercent: string;
  paymentFeeFixed?: string;

  status?: boolean | null;
  marketId?: string[];
  isCollapse: boolean;
  isEdit: boolean;
};

const ModalPaypal = ({ open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const queryClient = useQueryClient();

  const schema = yup.object().shape({
    name: yup.string().required(error('fieldIsRequired')),
    clientId: yup.string().required(error('fieldIsRequired')),
    clientSecrect: yup.string().required(error('fieldIsRequired')),
    paymentFeePercent: yup.string().required(error('fieldIsRequired')),
    paymentFeeFixed: yup.string().notRequired().nullable(),
    status: yup.boolean().notRequired().nullable(),
    marketId: yup.array().of(yup.string()).notRequired().nullable(),
    isCollapse: yup.boolean(),
  });

  const {
    setValue,
    formState: { errors },
    handleSubmit,
    setError,
    register,
    reset,
  } = useForm<FormValuePaypal>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: createPaypal,
    onSuccess: () => {
      queryClient.invalidateQueries(['getAllPaymentMethod']);
      showToast({
        type: 'success',
        summary: common('createPaypalSuccess'),
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
      clientId: data.clientId,
      clientSecrect: data.clientSecrect,
      name: data.name,
      paymentFeePercent: Number(data.paymentFeePercent),
      paymentFeeFixed: Number(data.paymentFeeFixed),
      marketIds: data.marketId,
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
          <FormLabel required>{common('clientID')}</FormLabel>
          <Input
            placeholder={common('clientID')}
            hiddenClose
            feedbackInvalid={errors?.clientId?.message}
            {...register(`clientId`)}
          />
          {errors?.clientId?.message && <FormHelperText error>{errors?.clientId?.message}</FormHelperText>}
        </div>
        <div>
          <FormLabel required>{common('secretKey')}</FormLabel>
          <Textarea
            placeholder={common('secretKey')}
            className="w-full h-[120px]"
            feedbackInvalid={errors?.clientSecrect?.message}
            {...register(`clientSecrect`)}
          />
          {errors?.clientSecrect?.message && <FormHelperText error>{errors?.clientSecrect?.message}</FormHelperText>}
        </div>
        <div>
          <FormLabel required>{`${common('transactionFeesCollectedFromBuyers')} (%)`}</FormLabel>
          <Input
            hiddenClose
            placeholder={`${common('transactionFeesCollectedFromBuyers')} (%)`}
            feedbackInvalid={errors?.paymentFeePercent?.message}
            {...register(`paymentFeePercent`, {
              onChange(event) {
                const value = event.target.value.replace(/[^0-9.]/g, '');
                setValue(`paymentFeePercent`, value);
              },
            })}
          />
          {errors?.paymentFeePercent?.message && (
            <FormHelperText error>{errors?.paymentFeePercent?.message}</FormHelperText>
          )}
        </div>
        <div>
          <FormLabel>{`${common('paymentFeeFixed')}`}</FormLabel>
          <Input
            hiddenClose
            placeholder={`${common('paymentFeeFixed')}`}
            feedbackInvalid={errors?.paymentFeeFixed?.message}
            {...register(`paymentFeeFixed`, {
              onChange(event) {
                const value = event.target.value.replace(/[^0-9.]/g, '');
                setValue(`paymentFeeFixed`, value);
              },
            })}
          />
          {errors?.paymentFeeFixed?.message && (
            <FormHelperText error>{errors?.paymentFeeFixed?.message}</FormHelperText>
          )}
        </div>
      </DialogBody>
      <DialogFooter className="flex gap-x-4">
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
export default ModalPaypal;
