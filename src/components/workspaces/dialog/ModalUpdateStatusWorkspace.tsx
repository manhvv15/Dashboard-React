import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { updateStatusWorkspace } from '@/services/user-management/workspace';
import { StatusEnum } from '@/types/user-management/workspace';

interface Props {
  id: string;
  open: boolean;
  status: StatusEnum;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalUpdateStatusWorkspace = ({ id, open, setOpen, status }: Props) => {
  const { showToast } = useApp();

  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const updateStatusWorkspaceMutation = useMutation({
    mutationFn: updateStatusWorkspace,
  });

  const onSubmitConfirm = () => {
    updateStatusWorkspaceMutation.mutate(
      {
        workspaceId: id,
        status: status == StatusEnum.Active ? StatusEnum.Deactive : StatusEnum.Active,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('updateStatusWorkspaceSuccessfully'),
          });
          queryClient.invalidateQueries(['getCompanyDetail']);
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
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">
          {status == StatusEnum.Active ? common('deactiveWorkspace') : common('activeWorkspace')}
        </p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm">
          Please confirm to <span className="font-bold">{status == StatusEnum.Active ? 'Deactive' : 'Active'}</span> the
          workspace?
        </p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={updateStatusWorkspaceMutation.isLoading} className="ml-1" onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalUpdateStatusWorkspace;
