import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteOrganizationUser } from '@/services/user-management/organization';

interface Props {
  organizationId: string;
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteUserFromGroupRole = ({ organizationId, userId, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const deleteOrganizationUserMutation = useMutation({
    mutationFn: deleteOrganizationUser,
  });

  const onSubmitConfirm = () => {
    deleteOrganizationUserMutation.mutate(
      {
        organizationId: organizationId,
        userId: userId,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('removeMemberFromGroupSuccessfully'),
          });
          queryClient.invalidateQueries(['getDetailOrganizationById', organizationId]);
          queryClient.invalidateQueries(['getDetailUserById', userId]);
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
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('removeUserFromGroupRole')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm">{common('removeUserFromGroupRoleDescription')}</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteOrganizationUserMutation.isLoading} onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteUserFromGroupRole;
