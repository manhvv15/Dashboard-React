import { LocaleNamespace } from '@/constants/enums/common';
import { BidNickStatusEnum } from '@/types/bid/enum';
import { GetBidNickResponse } from '@/types/bid/interface';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

export type ConfirmBlockedRequestType = GetBidNickResponse;

interface Props {
  dataSource?: GetBidNickResponse;
  isLoading: boolean;
  onClose: () => void;
  onSave: (params: ConfirmBlockedRequestType) => void;
}

const ModalForm = ({ isLoading, onClose, dataSource, onSave }: Props) => {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const isButtonDisabled = dataSource?.status === BidNickStatusEnum.BlockedByAuction;

  const handleSave = () => {
    if (dataSource) {
      onSave({
        ...dataSource,
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <strong>{bid('confirmBlocked')}</strong>
      </DialogHeader>

      <DialogBody className="scroll max-h-[700px] overflow-auto">
        <div>{bid('confirmBlockedWarning')}</div>
      </DialogBody>

      <DialogFooter className="flex items-center justify-end gap-4">
        <Button variant="outlined" color="danger" onClick={onClose}>
          {common('cancel')}
        </Button>
        <Button loading={isLoading} onClick={handleSave} disabled={isButtonDisabled}>
          {common('accept')}
        </Button>
      </DialogFooter>
    </>
  );
};

export const ConfirmBlockedDialog = ({ visible, ...rest }: Props & Pick<any, 'visible'>) => {
  return (
    <Dialog open={visible} onClose={rest.onClose}>
      <ModalForm {...rest} />
    </Dialog>
  );
};
