import { Dispatch, SetStateAction } from 'react';

import { DialogBody, DialogHeader, Dialog, DialogFooter, Button } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { activeUser, deactiveUser } from '@/services/user-management/user';
import { UserStatusEnum } from '@/types/user-management/user';

interface Props {
  id: string;
  open: boolean;
  status: UserStatusEnum | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalChangeStatusUser = ({ id, open, setOpen, status }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();
  const navigate = useNavigate();

  const activeUserMutation = useMutation({
    mutationFn: activeUser,
  });

  const deactiveUserMutation = useMutation({
    mutationFn: deactiveUser,
  });

  const activeUserHandle = () => {
    activeUserMutation.mutate(id, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: common('user.changeStatusSuccessfully', { action: common('active') }),
        });
        queryClient.invalidateQueries(['getUserPaging']);
        setOpen(false);
        navigate(`/user-and-roles/users`);
      },
      onError: () => {
        showToast({
          type: 'error',
          summary: error('user.changeStatusFail'),
        });
        setOpen(false);
      },
    });
  };

  const deactiveUserHandle = () => {
    deactiveUserMutation.mutate(id, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: common('user.changeStatusSuccessfully', { action: common('deactive') }),
        });
        queryClient.invalidateQueries(['getUserPaging']);
        setOpen(false);
        navigate(`/user-and-roles/users`);
      },
      onError: () => {
        showToast({
          type: 'error',
          summary: error('user.changeStatusFail'),
        });
        setOpen(false);
      },
    });
  };

  const onSubmitConfirm = () => {
    if (status === UserStatusEnum.Active) {
      deactiveUserHandle();
      return;
    }
    activeUserHandle();
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">
          {status === UserStatusEnum.Active ? common('user.deactivateUser') : common('user.activateUser')}
        </p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p
          dangerouslySetInnerHTML={{
            __html: common('user.changeStatusDescription', {
              action: status === UserStatusEnum.Active ? common('deactive') : common('active'),
            }),
          }}
        ></p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button
          loading={activeUserMutation.isLoading || deactiveUserMutation.isLoading}
          className="ml-3"
          onClick={onSubmitConfirm}
        >
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalChangeStatusUser;
