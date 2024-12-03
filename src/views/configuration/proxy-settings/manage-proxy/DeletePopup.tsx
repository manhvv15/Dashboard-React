import { LocaleNamespace } from '@/constants/enums/common';
import { IProxyWorkspace } from '@/types/pim/proxy';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

type Props = {
  visibleConfirmDelete: boolean;
  onCloseConfirmDelete: () => void;
  edit: IProxyWorkspace | undefined;
  isDeleteLoading: boolean;
  handleDelete: () => void;
};
export default function DeletePopup({
  visibleConfirmDelete,
  onCloseConfirmDelete,
  edit,
  handleDelete,
  isDeleteLoading,
}: Props) {
  const { t: pim } = useTranslation(LocaleNamespace.Pim);
  return (
    <Dialog open={visibleConfirmDelete} onClose={onCloseConfirmDelete}>
      <DialogHeader>
        <div className="text-lg font-medium">
          <p>{pim('deleteProxy')}</p>
        </div>
      </DialogHeader>
      <DialogBody>
        {pim('deleteProxyConfirm')
          .replace('{ip}', edit?.ip || '')
          .replace('{port}', edit?.port || '')}
      </DialogBody>
      <DialogFooter className="flex justify-end">
        <div className="mr-3">
          <Button className=" text-sm px-10" variant="outlined" onClick={onCloseConfirmDelete}>
            <span>{pim('cancel')}</span>
          </Button>
        </div>
        <div>
          <Button
            className="text-ic-white-6s text-sm px-10"
            disabled={isDeleteLoading}
            loading={isDeleteLoading}
            onClick={handleDelete}
          >
            <span>{pim('confirm')}</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
