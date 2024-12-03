import { Button, Close, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { dateFormat } from '@/constants/variables/common';
import { ICarrierDetail } from '@/types/ship4p/carrier';
import { formatDate } from '@/utils/common';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detailCarrier: ICarrierDetail;
}
export default function ModalDetailAccountOwn({ isOpen, onClose, detailCarrier }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);

  return (
    <Dialog size="sm" open={isOpen} handler={onClose} className="'!min-w-[1000px]':'!min-w-[1000px]'">
      <DialogHeader className="flex justify-between">
        {ship4p('modal.carrier.detail.title')}
        <div onClick={onClose} className="cursor-pointer">
          <Close />
        </div>
      </DialogHeader>
      <DialogBody>
        <div className="bg-ic-ink-1s rounded-t-xl px-6 py-4 flex font-medium">
          <img src={detailCarrier.logoUrl || ''} alt="profile" width={24} height={24} className="mr-3" />
          {detailCarrier.carrierName}
        </div>
        <div className="mt-6 grid grid-cols-12 mx-6">
          <div className="col-span-6 mb-4 ">
            <span className="text-ic-ink-5">{ship4p('carrier.detail.connecting.date')} :</span>
            <p>
              {formatDate({
                time: detailCarrier.createdAt,
                dateFormat: dateFormat.MM_DD_YYYY,
              })}
            </p>
          </div>
          <div className="col-span-6 mb-4">
            <span className="text-ic-ink-5">{ship4p('carrier.detail.code')} :</span>
            <p>{detailCarrier?.description}</p>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-end">
        <Button type="button" size="40" variant="outlined" onClick={onClose}>
          {t('button.close')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
