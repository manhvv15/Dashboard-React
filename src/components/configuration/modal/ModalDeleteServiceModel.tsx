import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteServiceModel } from '@/services/configuration';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

export const ModalDeleteServiceModel = ({ open, setOpen, id }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();

  const queryClient = useQueryClient();

  const deletePlanMutation = useMutation({
    mutationFn: deleteServiceModel,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('deleteServiceModelSuccess') });
      queryClient.invalidateQueries(['getServiceModels']);
      setOpen(false);
    },
    onError: () => {
      showToast({ type: 'error', summary: error('deleteServiceModelFail') });
      setOpen(false);
    },
  });

  const handleDeletePlan = () => {
    deletePlanMutation.mutate(id);
  };
  return (
    <Dialog size="sm" onClose={() => setOpen(false)} open={open} handler={setOpen}>
      <DialogHeader closeable>
        <p>{common('deleteThisServiceModel')}</p>
      </DialogHeader>
      <DialogBody>
        <p className="text-sm font-normal text-ic-ink-6s">{common('contentDeleteServiceModel')}</p>
      </DialogBody>
      <DialogFooter className="flex items-center justify-end gap-2">
        <Button color="danger" variant="outlined" onClick={() => setOpen(false)}>
          {common('cancel')}
        </Button>
        <Button loading={deletePlanMutation.isLoading} onClick={handleDeletePlan}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
