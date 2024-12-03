import { Dispatch, SetStateAction } from 'react';

import { DialogBody, DialogHeader, Dialog, DialogFooter, Button } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteRole } from '@/services/user-management/role';

interface Props {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteRole = ({ id, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
  });

  const onSubmitConfirm = () => {
    deleteRoleMutation.mutate(id, {
      onSuccess: (response) => {
        if (response.data.isSuccess) {
          showToast({
            type: 'success',
            summary: common('deleteRoleSuccessfully'),
          });
        } else {
          showToast({
            type: 'error',
            summary: error('deleteRoleFaild.description', { numberOfUsers: response.data.numberOfUsers }),
          });
        }
        queryClient.invalidateQueries(['getRolePaging']);
        setOpen(false);
      },
      onError: () => {
        showToast({
          type: 'error',
          summary: error('deleteRoleFaild'),
        });
        setOpen(false);
      },
    });
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('role.delete')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p>{common('role.deleteDescription')}</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteRoleMutation.isLoading} className="ml-3" onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteRole;
