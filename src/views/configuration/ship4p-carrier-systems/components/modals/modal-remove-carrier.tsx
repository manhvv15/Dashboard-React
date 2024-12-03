import { LocaleNamespace } from '@/constants/enums/common';
import { CourierAccountViewModel } from '@/types/ship4p/carrier';
import { Button, Close, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  carrierAccount: CourierAccountViewModel;
  errorInline?: string;
  loading: boolean;
}

export default function ModalRemoveCarrier({ isOpen, onClose, onConfirm, loading, carrierAccount }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);

  return (
    <Dialog open={isOpen} size="sm" handler={onClose} className="'min-w-[1000px]': min-w-[1000px]">
      <DialogHeader className="flex justify-between">
        {ship4p('modal.carrier.remove.title')}
        <div onClick={onClose} className="cursor-pointer">
          <Close />
        </div>
      </DialogHeader>
      <DialogBody className="relative text-ic-black-6">
        <p className="text-sm leading-5 font-normal text-ic-ink-5s">
          {ship4p('modal.carrier.remove.label', {
            carrier: carrierAccount.courierName || carrierAccount.courierId,
          })}
        </p>
      </DialogBody>
      <DialogFooter>
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            size="40"
            className="w-[160px] justify-center items-center"
            variant="outlined"
            onClick={onClose}
          >
            {t('button.cancel')}
          </Button>

          <Button
            type="button"
            size="40"
            color="primary"
            className="w-[160px] justify-center items-center"
            variant="filled"
            loading={loading}
            disabled={loading}
            onClick={onConfirm}
          >
            {t('confirm')}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
