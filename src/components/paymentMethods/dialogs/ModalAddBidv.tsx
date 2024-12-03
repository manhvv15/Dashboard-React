import { Dispatch, SetStateAction, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  FormLabel,
  Input,
} from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { MIN_LENGTH_5, MIN_LENGTH_8 } from '@/constants/variables/common';
import { addBankBidv } from '@/services/payment-method';
import { convertToAsciiString, onlySpaces, responseErrorCode } from '@/utils/common';
import { showToast } from '@/utils/toasts';

import { ModalVerifyOptBidv } from './ModalVerifyOptBidv';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalAddBidv = ({ open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const [showMessage, setShowMessage] = useState<string>();

  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [confirmId, setConfirmId] = useState<string>('');

  const queryClient = useQueryClient();

  const schema = yup
    .object({
      bankAccountNumber: yup
        .string()
        .required(error('fieldIsRequired'))
        .min(MIN_LENGTH_8, error('bankAccountNumberMinLength')),
      identification: yup
        .string()
        .required(error('fieldIsRequired'))
        .min(MIN_LENGTH_5, error('bankAccountNumberMinLength')),
      bankOwner: yup.string().required(error('fieldIsRequired')),
      phoneNumber: yup.string().required(error('fieldIsRequired')),
      email: yup.string().email().nullable().notRequired(),
      note: yup.string(),
      usedPayment: yup.boolean(),
      isConfirm: yup.boolean(),
    })
    .required();
  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: addBankBidv,
    onSuccess: (res) => {
      if (!res.data.requestId) {
        showToast({
          type: 'success',
          summary: common('addBankAccountSuccess'),
        });
        queryClient.invalidateQueries(['getBidvs']);
        queryClient.invalidateQueries(['getAllPaymentMethod']);
        setOpen(false);
        return;
      }
      setConfirmId(res.data.requestId);
      setIsVerify(true);
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;

      if (errorFrom) {
        responseErrorCode(errorFrom).forEach(({ name, message, type }) => {
          const mess = err.t(message);
          setError(name, {
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

  const onSubmit = (data: FormData) => {
    const newData = {
      note: '',
      bankAccount: {
        accountNumber: data.bankAccountNumber,
        accountHolder: data.bankOwner,
        note: data.note || '',
        isDefault: data.usedPayment || false,
        phoneNumber: data.phoneNumber,
        email: data.email,
        identification: data.identification,
        isAutoConfirmOrder: false,
      },
    };
    createMutation.mutate(newData);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const checkInput =
    watch('identification') &&
    watch('bankAccountNumber') &&
    watch('bankOwner') &&
    watch('phoneNumber') &&
    watch('isConfirm');

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      {isVerify ? (
        <ModalVerifyOptBidv confirmId={confirmId} visible={open} data={watch()} onClose={setOpen} />
      ) : (
        <>
          <DialogHeader className="flex items-center justify-between border-b border-ic-ink-2s">
            <p className="text-base font-medium leading-6 text-ic-ink-6s">{common('createBIDV')}</p>
            <button onClick={handleClose}>
              <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
            </button>
          </DialogHeader>
          <DialogBody className="w-full overflow-y-auto flex flex-col gap-y-4 max-h-[80vh]">
            <div className="mt-4">
              {showMessage && (
                <div className="px-2 py-1 bg-ic-red-1s rounded-md mb-3 flex items-center justify-between">
                  <p className="text-sm font-normal leading-5 text-ic-red-6s00 ">{showMessage}</p>
                  <button onClick={() => setShowMessage(undefined)}>
                    <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
                  </button>
                </div>
              )}

              <FormLabel required>{common('accountBidv')}</FormLabel>
              <Input
                hiddenClose
                feedbackInvalid={errors.bankAccountNumber?.message}
                {...register('bankAccountNumber', {
                  onChange(event) {
                    setShowMessage(undefined);
                    const { value } = event.target;
                    const replace = value.replace(/[^\d]/g, '').slice(0, 20);
                    clearErrors(['bankAccountNumber']);
                    setValue('bankAccountNumber', replace);
                  },
                })}
                placeholder={common('accountBidv')}
                value={watch('bankAccountNumber')}
              />
              {errors.bankAccountNumber?.message && (
                <FormHelperText error>{errors.bankAccountNumber?.message}</FormHelperText>
              )}
            </div>
            <div>
              <FormLabel required>{common('accountOwner')}</FormLabel>
              <Input
                hiddenClose
                feedbackInvalid={errors.bankOwner?.message}
                {...register('bankOwner', {
                  onChange(event) {
                    setShowMessage(undefined);
                    const { value } = event.target;
                    if (onlySpaces(value)) {
                      setValue('bankOwner', '');
                    } else {
                      const replace = convertToAsciiString(value)
                        .replace(/[0-9]/g, '')
                        .replace(/[^\w\s]/gi, '')
                        .toUpperCase();
                      setValue('bankOwner', replace);
                      clearErrors(['bankOwner']);
                    }
                  },
                })}
                placeholder={common('accountOwner')}
              />
              {errors.bankOwner?.message && <FormHelperText error>{errors.bankOwner?.message}</FormHelperText>}
            </div>
            <div>
              <FormLabel required>{common('personalIdentification')}</FormLabel>
              <Input
                hiddenClose
                feedbackInvalid={errors.identification?.message}
                {...register('identification', {
                  onChange(event) {
                    setShowMessage(undefined);
                    const { value } = event.target;
                    const replace = value.replace(/[^\d]/g, '').slice(0, 20);
                    clearErrors(['identification']);
                    setValue('identification', replace);
                  },
                })}
                placeholder={common('personalIdentification')}
                value={watch('identification')}
              />
              {errors.identification?.message && (
                <FormHelperText error>{errors.identification?.message}</FormHelperText>
              )}
            </div>
            <div>
              <FormLabel required>{common('phoneNumberAccount')}</FormLabel>
              <Input
                hiddenClose
                feedbackInvalid={errors.phoneNumber?.message}
                {...register('phoneNumber', {
                  onChange(event) {
                    setShowMessage(undefined);
                    const { value } = event.target;
                    if (onlySpaces(value)) {
                      setValue('phoneNumber', '');
                    } else {
                      const replace = convertToAsciiString(value).replace(/[^\d]/g, '').slice(0, 20);
                      setValue('phoneNumber', replace);
                      clearErrors(['phoneNumber']);
                    }
                  },
                })}
                placeholder={common('phoneNumberAccount')}
              />
              {errors.phoneNumber?.message && <FormHelperText error>{errors.phoneNumber?.message}</FormHelperText>}
            </div>
            <div>
              <FormLabel>{common('email')}</FormLabel>
              <Input
                hiddenClose
                feedbackInvalid={errors.email?.message}
                {...register('email', {
                  onChange() {
                    setShowMessage(undefined);
                  },
                })}
                placeholder={common('email')}
              />
              {errors.email?.message && <FormHelperText error>{errors.email?.message}</FormHelperText>}
            </div>
            <div className=" flex">
              <Checkbox
                {...register('isConfirm')}
                label={
                  <p className="text-sm font-normal leading-5 text-ic-ink-6s ml-2">
                    {common('confirmConditions')}
                    <Link
                      target="_blank"
                      to={'https://bidv.com.vn/uudai/DKDKDV_VIETQR_ICHIBA_27022024.pdf'}
                      className="text-ic-primary-6s ml-1"
                    >
                      {common('agreementAndPrivacyPolicyBIDV')}
                    </Link>
                  </p>
                }
              />
            </div>
            <div className=" flex">
              <Checkbox
                {...register('usedPayment', {
                  onChange() {
                    setShowMessage(undefined);
                  },
                })}
                label={<p className="text-sm font-normal leading-5 text-ic-ink-6s">{common('defaultAccountBIDV')}</p>}
              />
            </div>
          </DialogBody>
          <DialogFooter className="flex gap-x-4">
            <Button onClick={handleClose} color="danger" variant="filled">
              {common('cancel')}
            </Button>
            <Button loading={createMutation.isLoading} disabled={!checkInput} onClick={handleSubmit(onSubmit)}>
              {common('save')}
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
};
export default ModalAddBidv;
