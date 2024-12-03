import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { deleteMerchantAccount, getAllPaymentMethod } from '@/services/payment-method';
import { MerchantAccountTypeEnum } from '@/types/payment-methods/enum';
import { showToast } from '@/utils/toasts';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: MerchantAccountTypeEnum;
}

const ModalDeleteFromMyMethod = ({ open, setOpen, type }: Props) => {
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { t: common } = useTranslation(LocaleNamespace.Common);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_tab, setTab] = useSearchParams();

  const queryClient = useQueryClient();

  const deleteMerchant = useMutation({
    mutationFn: deleteMerchantAccount,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('deleteMerchantAccountSuccess') });
      queryClient.invalidateQueries([getAllPaymentMethod.name]);
      setOpen(false);
      setTab({ tab: 'all-methods' });
    },

    onError: () => {
      showToast({ type: 'error', summary: error('deleteMerchantAccountFail') });
      setOpen(false);
    },
  });

  const handleConfirm = () => {
    deleteMerchant.mutate({ type: type });
  };

  return (
    <Dialog open={open} size="sm" handler={setOpen}>
      <DialogHeader closeable>{common('removeFromList')}</DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm font-normal text-ic-ink-6s">{common('confirmDeleteFromMyMerchant')}</p>
      </DialogBody>
      <DialogFooter className="flex items-center justify-end gap-3">
        <Button color="primary" variant="outlined" onClick={() => setOpen(false)}>
          {common('cancel')}
        </Button>
        <Button loading={deleteMerchant.isLoading} color="danger" onClick={handleConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalDeleteFromMyMethod;
