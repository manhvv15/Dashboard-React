import { Dispatch, SetStateAction } from 'react';

import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ModalConfirmGeneratePublicKey = ({ open, setOpen, onConfirm, isLoading }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  return (
    <Dialog open={open} handler={setOpen} size="sm">
      <DialogHeader className="flex items-center justify-between">
        <span className="text-lg font-medium leading-6 text-ic-ink-6s">
          {t('payment.payme.modal.generateKey.title')}
        </span>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm font-normal leading-5 text-ic-ink-5s mb-4">
          {t('payment.payme.modal.generateKey.description.1')}
        </p>
        <p className="text-sm font-bold leading-5 text-ic-red-4s">
          {t('payment.payme.modal.generateKey.description.2')}
        </p>
      </DialogBody>
      <DialogFooter className="flex items-center justify-end">
        <Button className="ml-2" color="danger" variant="outlined" onClick={() => setOpen(false)}>
          {t('cancel')}
        </Button>
        <Button className="ml-4" onClick={onConfirm} loading={isLoading} disabled={isLoading}>
          {t('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalConfirmGeneratePublicKey;
