import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deletePricingModel } from '@/services/user-management/configuration';

interface Props {
  id?: string;
}

export interface ModalConfirmDeleteRef {
  open: () => void;
  close: () => void;
}

const ModalConfirmDelete = forwardRef<any, Props>(({ id }, ref) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const deleteMutation = useMutation({
    mutationKey: [id],
    mutationFn: deletePricingModel,
  });

  const handleConfirmDelete = () => {
    if (!id) {
      return;
    }
    deleteMutation.mutate(
      { id },
      {
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
          queryClient.invalidateQueries(['getPringModel']);
          setOpen(false);
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: error('deleteRoleFaild'),
          });
          setOpen(false);
        },
      },
    );
  };

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader>{common('deleteThisPricingModel')}</DialogHeader>
      <DialogBody className="w-full">
        <p>{common('configuration.deleteDescription')}</p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteMutation.isLoading} color={'danger'} className="ml-3" onClick={handleConfirmDelete}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
});

export default ModalConfirmDelete;
