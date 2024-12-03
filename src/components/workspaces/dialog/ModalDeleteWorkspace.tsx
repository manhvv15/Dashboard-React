import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteWorkspace } from '@/services/user-management/workspace';

interface Props {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteWorkspace = ({ id, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();
  const navigate = useNavigate();

  const deleteWorkspaceMutation = useMutation({
    mutationFn: deleteWorkspace,
  });

  const onSubmitConfirm = () => {
    deleteWorkspaceMutation.mutate(
      {
        workspaceId: id,
        reason: JSON.stringify({
          mainReason: 'System delete',
        }),
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('workspace.deleteSuccessfully'),
          });
          queryClient.invalidateQueries(['getWorkspacePaging']);
          setOpen(false);
          navigate(`/workspaces`);
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
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('workspace.delete')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm">{common('workspace.deleteDescription')}</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteWorkspaceMutation.isLoading} className="ml-3" onClick={onSubmitConfirm} color="danger">
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteWorkspace;
