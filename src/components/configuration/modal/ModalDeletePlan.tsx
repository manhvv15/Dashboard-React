import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deletePlan } from '@/services/configuration';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

export const ModalDeletePlan = ({ open, setOpen, id }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();

  const queryClient = useQueryClient();

  const deletePlanMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('deletePlanSuccess') });
      queryClient.invalidateQueries(['getPlans']);
      setOpen(false);
    },
    onError: (err: any) => {
      const { errorNormal } = err;
      if (errorNormal) {
        showToast({ type: 'error', summary: error(errorNormal) });
        setOpen(false);
        return;
      }
      showToast({ type: 'error', summary: error('deletePlanFail') });
      setOpen(false);
    },
  });

  const handleDeletePlan = () => {
    deletePlanMutation.mutate(id);
  };
  return (
    <Dialog size="sm" onClose={() => setOpen(false)} open={open} handler={setOpen}>
      <DialogHeader closeable>
        <p>{common('deleteThisPlan')}</p>
      </DialogHeader>
      <DialogBody>
        <p className="text-sm font-normal text-ic-ink-6s">{common('contentDeletePlan')}</p>
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
