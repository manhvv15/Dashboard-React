import { LocaleNamespace } from '@/constants/enums/common';
import { IProxySourceWorkspace } from '@/types/pim/proxy';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

type Props = {
  visibleConfirmDelete: boolean;
  onCloseConfirmDelete: () => void;
  edit: IProxySourceWorkspace | undefined;
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
  const { t: common } = useTranslation(LocaleNamespace.Pim);
  return (
    <Dialog open={visibleConfirmDelete} onClose={onCloseConfirmDelete}>
      <DialogHeader>
        <div className="text-lg font-medium">
          <p>{common('deleteProxy')}</p>
        </div>
      </DialogHeader>
      <DialogBody>{common('deleteProxySourceWpConfirm').replace('{name}', edit?.sourceName || '')}</DialogBody>
      <DialogFooter className="flex justify-end">
        <div className="mr-3">
          <Button className="text-sm px-10" variant="outlined" onClick={onCloseConfirmDelete}>
            <span>{common('cancel')}</span>
          </Button>
        </div>
        <div>
          <Button
            className="text-ic-white-6s text-sm px-10"
            disabled={isDeleteLoading}
            loading={isDeleteLoading}
            onClick={handleDelete}
          >
            <span>{common('confirm')}</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
