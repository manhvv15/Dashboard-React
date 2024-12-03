import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteOrganizationApplication } from '@/services/user-management/organization';

interface Props {
  organizationId: string;
  applicationId: string;
  open: boolean;
  name: string;
  applicationName: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteGroupRoleRole = ({ organizationId, applicationId, open, setOpen, name, applicationName }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const deleteOrganizationApplicationMutation = useMutation({
    mutationFn: deleteOrganizationApplication,
  });

  const onSubmitConfirm = () => {
    deleteOrganizationApplicationMutation.mutate(
      {
        organizationId: organizationId,
        applicationId: applicationId,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('Remove application from  group successfully.'),
          });
          queryClient.invalidateQueries(['getDetailOrganizationById', organizationId]);
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
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('Remove application from group')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm">
          Are you sure you want to remove <span className="font-medium">{applicationName}</span> from the group {name}?
        </p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteOrganizationApplicationMutation.isLoading} onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteGroupRoleRole;
