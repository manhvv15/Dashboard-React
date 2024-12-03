import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteUserRole } from '@/services/user-management/role';

interface Props {
  userId: string;
  roleId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteUserInApplication = ({ userId, roleId, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const deleteUserRoleMutation = useMutation({
    mutationFn: deleteUserRole,
  });

  const onSubmitConfirm = () => {
    deleteUserRoleMutation.mutate(
      {
        roleId: roleId,
        userId: userId,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('user.removeUserFromApplicationSuccessfully'),
          });
          queryClient.invalidateQueries(['getUserById']);
          setOpen(false);
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: error('somethingWentWrongPleaseTryAgain'),
          });
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('user.removeUserInApplication')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm">{common('user.deleteUserInAppDescription')}</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteUserRoleMutation.isLoading} className="ml-3" onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteUserInApplication;
