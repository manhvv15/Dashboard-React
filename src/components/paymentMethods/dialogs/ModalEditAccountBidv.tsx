import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Dialog, DialogBody, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { LocaleNamespace } from '@/constants/enums/common';
import { deactiveBidv, deleteBidv, editBankAccountBidv } from '@/services/payment-method';
import { BidvDetail } from '@/types/payment-methods/payment-method';
import { showToast } from '@/utils/toasts';

import { ModalVerifyOptBidv } from './ModalVerifyOptBidv';

interface Props {
  visible: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  bankAccount: BidvDetail | null;
  length: number | undefined;
}

enum IsStatus {
  'Edit',
  'Delete',
  'Verify',
}

const ModalEditAccountBidv = ({ visible, onClose, bankAccount, length }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [isStatus, setIsStatus] = useState<IsStatus>(IsStatus.Edit);
  const [confirmId, setConfirmId] = useState<string>('');

  const queryClient = useQueryClient();

  const schema = yup
    .object({
      usedPayment: yup.boolean(),
    })
    .required();
  type FormData = yup.InferType<typeof schema>;

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!visible) {
      reset();
      setIsStatus(IsStatus.Edit);
    }
  }, [visible]);

  useEffect(() => {
    if (bankAccount !== null) {
      setValue('usedPayment', bankAccount.isDefault);
    }
  }, [bankAccount, visible]);

  const checkValueBankName = () => {
    if (bankAccount !== null) {
      const accountCurrent = {
        usedPayment: bankAccount.isDefault,
      };
      const accountChange = {
        usedPayment: watch('usedPayment'),
      };
      return isEqual(accountCurrent, accountChange);
    }
    return true;
  };

  const editBankNameMutation = useMutation({
    mutationFn: editBankAccountBidv,
  });

  const onSubmit = (data: FormData) => {
    const newData = {
      id: bankAccount?.id as string,
      isDefault: data.usedPayment || false,
    };
    editBankNameMutation.mutate(newData, {
      onSuccess: (res) => {
        if (!res.data.requestId) {
          showToast({
            type: 'success',
            summary: common('editAccountSuccess'),
          });
          queryClient.invalidateQueries(['getBidvs']);
          onClose(false);
          return;
        }
        setConfirmId(res.data.requestId);
        setIsStatus(IsStatus.Verify);
      },
    });
  };

  const deleteBankAccountMutation = useMutation({
    mutationFn: deleteBidv,
  });

  const deactiveBidvMutation = useMutation({
    mutationFn: deactiveBidv,
  });

  const onHandleDelete = () => {
    deleteBankAccountMutation.mutate(
      {
        id: [bankAccount?.id as string],
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('deleteBankAccountSuccessfully'),
          });
          if (length && length === 1) {
            deactiveBidvMutation.mutateAsync();
          }
          queryClient.invalidateQueries(['getBidvs']);
          onClose(false);
        },
        onError: (err: any) => {
          const { errorNormal } = err;
          if (errorNormal) {
            showToast({
              type: 'error',
              summary: error(errorNormal),
            });
          }
          onClose(false);
        },
      },
    );
  };

  return (
    <Dialog size="sm" open={visible} handler={onClose}>
      {isStatus === IsStatus.Edit && (
        <>
          <DialogHeader>
            <p className="text-lg font-medium leading-6 text-ic-ink-6">{common('infoBidvAccount')}</p>
          </DialogHeader>
          <DialogBody className="w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="border border-ic-ink-2 p-4 rounded-lg grid grid-cols-1 gap-y-4">
                <div className="">
                  <p className="text-base font-medium leading-5 text-ic-ink-6">{common('accountBidv')}</p>
                  <p className="text-sm font-normal leading-5 text-ic-ink-6s mt-2">{bankAccount?.accountNumber}</p>
                </div>
                <div className="">
                  <p className="text-base font-medium leading-5 text-ic-ink-6">{common('accountOwner')}</p>
                  <p className="text-sm font-normal leading-5 text-ic-ink-6s mt-2">{bankAccount?.accountHolder}</p>
                </div>
                <div className="">
                  <p className="text-base font-medium leading-5 text-ic-ink-6">{common('personalIdentification')}</p>
                  <p className="text-sm font-normal leading-5 text-ic-ink-6s mt-2">{bankAccount?.identification}</p>
                </div>

                <div className="">
                  <p className="text-base font-medium leading-5 text-ic-ink-6">{common('phoneNumberAccount')}</p>
                  <p className="text-sm font-normal leading-5 text-ic-ink-6s mt-2">{bankAccount?.phoneNumber}</p>
                </div>

                <div className="">
                  <p className="text-base font-medium leading-5 text-ic-ink-6">{common('email')}</p>
                  <p className="text-sm font-normal leading-5 text-ic-ink-6s mt-2">{bankAccount?.email ?? '-'}</p>
                </div>
              </div>

              <div className="mt-4 flex">
                <Checkbox
                  {...register('usedPayment')}
                  label={common('usedInPayment')}
                  disabled={bankAccount?.isDefault}
                />
                {/* <Image className="ml-2" src={TooltipIcon} alt="TooltipIcon" /> */}
              </div>
              <div className="flex my-4  justify-end">
                <Button onClick={() => setIsStatus(IsStatus.Delete)} type="button" color="danger" variant="outlined">
                  {common('deleteAccount')}
                </Button>
                <Button
                  disabled={checkValueBankName() || editBankNameMutation.isLoading}
                  loading={editBankNameMutation.isLoading}
                  className="ml-3"
                  type="submit"
                >
                  {common('save')}
                </Button>
              </div>
            </form>
          </DialogBody>
        </>
      )}
      {isStatus === IsStatus.Verify && (
        <ModalVerifyOptBidv
          confirmId={confirmId}
          onClose={onClose}
          visible={visible}
          data={{
            bankOwner: bankAccount?.accountHolder,
            bankAccountNumber: bankAccount?.accountNumber,
            email: bankAccount?.email,
            identification: bankAccount?.identification,
            usedPayment: watch('usedPayment'),
            phoneNumber: bankAccount?.phoneNumber,
          }}
        />
      )}
      {isStatus === IsStatus.Delete && (
        <>
          <DialogHeader>
            <p className="text-lg font-medium leading-6 text-ic-ink-6">{common('deleteAccountBidv')}</p>
          </DialogHeader>
          <DialogBody className="w-full">
            <div>
              <p className="text-sm font-normal leading-5 text-ic-ink-6">
                {common('contentDeleteAccountBidv', {
                  accountId: bankAccount?.accountNumber,
                })}
              </p>
            </div>
            <div className="flex mt-2 mb-4 justify-end">
              <Button onClick={() => onClose(false)} type="button" color="danger" variant="outlined">
                {common('cancel')}
              </Button>
              <Button
                loading={deleteBankAccountMutation.isLoading}
                className="ml-3"
                type="submit"
                onClick={onHandleDelete}
              >
                {common('confirm')}
              </Button>
            </div>
          </DialogBody>
        </>
      )}
    </Dialog>
  );
};

export default ModalEditAccountBidv;
