import { LocaleNamespace } from '@/constants/enums/common';
import { CourierAccountViewModel } from '@/types/ship4p/carrier';
import { Button, Close, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  type: boolean;
  onClose: () => void;
  onConfirm: () => void;
  carrierAccount: CourierAccountViewModel;
  isLoading: boolean;
}

export default function ModalActiveAndDeactive({ isOpen, type, onClose, onConfirm, isLoading, carrierAccount }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);

  return (
    <Dialog size="sm" open={isOpen} handler={onClose} className="'min-w-[1000px] : min-w-[1000px]'">
      <DialogHeader className="pb-2 flex justify-between">
        {type ? ship4p('modal.carrier.deactive.title') : ship4p('modal.carrier.active.title')}
        <div onClick={onClose} className="cursor-pointer">
          <Close />
        </div>
      </DialogHeader>
      <DialogBody className="relative text-ic-black-5s">
        <p className="text-sm leading-5 font-normal text-ic-ink-5s">
          {type
            ? ship4p('modal.carrier.deactive.label', {
                carrier: carrierAccount.courierName || carrierAccount.courierId,
              })
            : ship4p('modal.carrier.active.label', {
                carrier: carrierAccount.courierName || carrierAccount.courierId,
              })}
        </p>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-4">
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
          className="w-[160px] justify-center items-center"
          disabled={isLoading}
          loading={isLoading}
          color="primary"
          variant="filled"
          onClick={onConfirm}
        >
          {t('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
