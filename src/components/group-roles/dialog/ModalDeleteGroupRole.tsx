import { Dispatch, SetStateAction } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { deleteOrganization } from '@/services/user-management/organization';

interface Props {
  id: string;
  open: boolean;
  name: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteGroupRole = ({ id, open, setOpen, name }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const deleteOrganizationMutation = useMutation({
    mutationFn: deleteOrganization,
  });

  const onSubmitConfirm = () => {
    deleteOrganizationMutation.mutate(id, {
      onSuccess: (response) => {
        if (response.data.isSuccess) {
          showToast({
            type: 'success',
            summary: common('deleteGroupRoleSuccessfully'),
          });
          queryClient.invalidateQueries(['getOrganizationPaging']);
        } else if (response.data.message === 'DELETE_ORGANIZATION_FAILD_BECAUSE_HAS_USER') {
          showToast({
            type: 'error',
            summary: error('deleteOrganizationFaildBecauseHasUser', {
              numberOfUsers: response.data.numberOfUsers,
            }),
          });
        } else {
          showToast({
            type: 'error',
            summary: error('deleteOrganizationFaildBecauseHasChild'),
          });
        }

        setOpen(false);
      },
      onError: () => {
        showToast({
          type: 'error',
          summary: error('deleteOrganizationFaild'),
        });
        setOpen(false);
      },
    });
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('deleteGroupRole')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p>
          {common('deleteGroupRoleDescription', {
            name: name,
          })}
        </p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={deleteOrganizationMutation.isLoading} onClick={onSubmitConfirm}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalDeleteGroupRole;
