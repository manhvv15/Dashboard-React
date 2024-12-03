import { LocaleNamespace } from '@/constants/enums/common';
import { BidCustomerValueType } from '@/types/bid/interface';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../../common';

interface Props {
  dataSource?: BidCustomerValueType;
  onLoading: () => void;
  onClose: () => void;
  onSave: () => void;
  isOnlyCreateOrder: boolean;
}

const ModalForm = ({ onLoading, onClose, dataSource, onSave, isOnlyCreateOrder }: Props) => {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const isButtonDisabled = !dataSource?.value;

  const handleSave = () => {
    if (dataSource) {
      onLoading();
      onSave();
    }
  };

  return (
    <Dialog>
      <DialogHeader>
        <strong>{isOnlyCreateOrder ? bid('confirmCreateOrder') : bid('confirmMapSuccessfulBid')}</strong>
      </DialogHeader>

      <DialogBody className="scroll max-h-[700px] overflow-auto">
        {isOnlyCreateOrder ? (
          <div>
            <span>{bid('confirmCreateOrderMessage')}</span>
          </div>
        ) : (
          <div>
            <span>{bid('confirmMapSuccessfulBidMessage')}</span>
            <StatusButton colorType={'green'}>{dataSource?.label}</StatusButton>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="flex items-center justify-end gap-4">
        <Button style={{ minWidth: 160 }} onClick={onClose}>
          {bid('cancel')}
        </Button>
        <Button style={{ minWidth: 160 }} onClick={handleSave} disabled={isButtonDisabled}>
          {bid('accept')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const ConfirmMappingSuccessfulBidDialog = ({ visible, ...rest }: Props & Pick<any, 'visible'>) => {
  return (
    <Dialog open={visible} onClose={rest.onClose}>
      <ModalForm {...rest} />
    </Dialog>
  );
};
