import { Dispatch, SetStateAction } from 'react';

import { DialogBody, DialogHeader, Dialog, DialogFooter, Button } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deletePermission } from '@/services/user-management/permission';

interface Props {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteOrganization = ({ id, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const deletePermissionMutation = useMutation({
    mutationFn: deletePermission,
  });

  const onSubmitConfirm = () => {
    deletePermissionMutation.mutate(id, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: common('deletePermissionSuccessfully'),
        });
        queryClient.invalidateQueries(['getPermissionPaging']);
        setOpen(false);
      },
      onError: () => {
        showToast({
          type: 'error',
          summary: error('deletePermissionFaild'),
        });
        setOpen(false);
      },
    });
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('permission.delete')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p>{common('permission.deleteDescription')}</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deletePermissionMutation.isLoading} className="ml-3" onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteOrganization;
