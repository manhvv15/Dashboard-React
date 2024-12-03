import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, DialogBody, DialogHeader, FormLabel, Input } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { LocaleNamespace } from '@/constants/enums/common';
import { verifyOtpBidv } from '@/services/payment-method';
import { showToast } from '@/utils/toasts';

interface Props {
  onClose: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  data: any;
  confirmId: string;
}

export function ModalVerifyOptBidv({ onClose, visible, data, confirmId }: Props) {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [isCancel, setIsCancel] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const schema = yup
    .object({
      opt: yup.string().required(error('fieldIsRequired')),
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
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const verifyMutation = useMutation({
    mutationFn: verifyOtpBidv,
  });

  const onSubmit = (resData: FormData) => {
    verifyMutation.mutate(
      {
        note: '',
        otpNumber: resData.opt,
        confirmId,
        bankAccount: {
          note: '',
          accountHolder: data.bankOwner,
          accountNumber: data.bankAccountNumber,
          email: data.email,
          identification: data.identification,
          isDefault: data.usedPayment || false,
          phoneNumber: data.phoneNumber,
        },
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: error('verifyOptBidvSuccessfully'),
          });
          queryClient.invalidateQueries(['getBidvs']);
          onClose(false);
        },
        onError: () => {
          setError('opt', { message: error('verifyOptBidvFail') });
        },
      },
    );
  };

  useEffect(() => {
    if (!visible) {
      setIsCancel(false);
    }
  }, [visible]);

  return (
    <>
      {isCancel ? (
        <>
          <DialogHeader>
            <p className="text-lg font-medium leading-6 text-ic-ink-6s">{common('closePopupOpt')}</p>
          </DialogHeader>
          <DialogBody className="w-full">
            <div>
              <p className="text-sm font-normal leading-5 text-ic-ink-6s">{common('notificationClosePopupOpt')}</p>
            </div>
            <div className="flex my-4  justify-end">
              <Button color="danger" variant="outlined" type="button" onClick={() => onClose(false)}>
                {common('confirmCancel')}
              </Button>
              <Button onClick={() => setIsCancel(false)} className=" ml-3" type="submit">
                {common('continueVerifyOpt')}
              </Button>
            </div>
          </DialogBody>
        </>
      ) : (
        <>
          <DialogHeader>
            <p className="text-lg font-medium leading-6 text-ic-ink-6s">{common('enterOtpCode')}</p>
          </DialogHeader>
          <DialogBody className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <FormLabel required>{common('enterTheOtpCodeJustSentToYourPhoneNumber')}</FormLabel>
                <Input
                  hiddenClose
                  feedbackInvalid={errors.opt?.message}
                  {...register('opt', {
                    onChange(event) {
                      const { value } = event.target;
                      const replace = value.replace(/[^\d]/g, '').slice(0, 20);
                      clearErrors(['opt']);
                      setValue('opt', replace);
                    },
                  })}
                  placeholder={common('123456')}
                  value={watch('opt')}
                />
              </div>
              <div className="flex my-4  justify-end">
                <Button
                  type="button"
                  className="w-28"
                  color="danger"
                  variant="outlined"
                  onClick={() => setIsCancel(true)}
                >
                  {common('cancel')}
                </Button>
                <Button
                  className="!w-32 ml-3"
                  loading={verifyMutation.isLoading}
                  disabled={verifyMutation.isLoading || !watch('opt')}
                  type="submit"
                >
                  {common('confirm')}
                </Button>
              </div>
            </form>
          </DialogBody>
        </>
      )}
    </>
  );
}
