import { Dispatch, SetStateAction } from 'react';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteUserFromApplication } from '@/services/user-management/user';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface Props {
  applicationId: string;
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteUserFromApplication = ({ applicationId, userId, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const deleteUserFromApplicationMutation = useMutation({
    mutationFn: deleteUserFromApplication,
  });

  const onSubmitConfirm = () => {
    deleteUserFromApplicationMutation.mutate(
      {
        applicationId: applicationId,
        userId: userId,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('removeMemberFromApplicationSuccessfully'),
          });
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
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('removeUserFromApplication')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm">{common('removeUserFromApplicationDescription')}</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteUserFromApplicationMutation.isLoading} onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteUserFromApplication;
