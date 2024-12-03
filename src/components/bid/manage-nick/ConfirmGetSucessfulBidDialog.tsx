import { GetBidNickResponse } from '@/types/bid/interface';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

interface Props {
  dataSource: GetBidNickResponse;
  isLoading: boolean;
  onClose: () => void;
  onSave: (params: GetBidNickResponse) => void;
}

const ModalForm = ({ isLoading, dataSource, onClose, onSave }: Props) => {
  const { t: bid } = useTranslation('bid');
  const { t: common } = useTranslation('common');
  const handleSave = () => {
    if (dataSource) {
      onSave({
        ...dataSource,
        username: dataSource.username,
        isAutoGetSuccessfulBid: false,
        period: 60,
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <strong>{bid('confirmChangeStatusGetSuccessfulBid')}</strong>
      </DialogHeader>
      <DialogBody className="scrollbar max-h-[700px] overflow-auto">
        <div>{bid('confirmUnregisterGetSuccessfulBidReminder')}</div>
      </DialogBody>
      <DialogFooter className="flex items-center justify-end gap-4">
        <Button variant="outlined" onClick={onClose}>
          {common('cancel')}
        </Button>
        <Button type="button" loading={isLoading} onClick={handleSave}>
          {common('accept')}
        </Button>
      </DialogFooter>
    </>
  );
};
export const ConfirmGetSuccessfulBidDialog = ({ visible, ...rest }: Props & Pick<any, 'visible'>) => {
  return (
    <Dialog open={visible} onClose={rest.onClose}>
      <ModalForm {...rest} />
    </Dialog>
  );
};
