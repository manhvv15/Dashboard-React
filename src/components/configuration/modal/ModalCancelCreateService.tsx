import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalCancelCreateService = ({ open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const navigate = useNavigate();

  const handleConfirm = () => {
    setOpen(false);
    navigate(-1);
  };

  return (
    <Dialog size="sm" onClose={() => setOpen(false)} open={open} handler={setOpen}>
      <DialogHeader closeable>
        <p>{common('cancelConfirmation')}</p>
      </DialogHeader>
      <DialogBody>
        <p className="text-sm font-normal text-ic-ink-6s">{common('bodyCancelConfirmation')}</p>
      </DialogBody>
      <DialogFooter className="flex items-center justify-end gap-2">
        <Button color="primary" variant="outlined" onClick={() => setOpen(false)}>
          {common('cancel')}
        </Button>
        <Button color="danger" onClick={handleConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
