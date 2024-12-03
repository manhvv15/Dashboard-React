import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteUser } from '@/services/user-management/user';

interface Props {
  id: string;
  userName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteUser = ({ id, open, setOpen, userName }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();
  const navigate = useNavigate();

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
  });

  const onSubmitConfirm = () => {
    deleteUserMutation.mutate(id, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: common('user.deleteUserSuccessfully'),
        });
        queryClient.invalidateQueries(['getUserPaging']);
        setOpen(false);
        navigate(`/user-and-roles/users`);
      },
      onError: () => {
        showToast({
          type: 'error',
          summary: error('user.deleteUserFaild'),
        });
        setOpen(false);
      },
    });
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('user.removeUser')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm">{common('user.deleteDescription', { userName: userName })}</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteUserMutation.isLoading} className="ml-3" onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteUser;
