import { Dispatch, SetStateAction, useState } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, MultipleSelect } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { addUsersToOrganization, getOrganizationsAvailableToUser } from '@/services/user-management/user';

interface Props {
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalAddGroupRolesToUser = ({ userId, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [orgIds, setOrgIds] = useState<string[]>([]);
  const { showToast } = useApp();
  const queryClient = useQueryClient();

  const organizationsAvailable = useQuery({
    queryKey: ['getOrganizationsAvailableToUser', userId],
    queryFn: () =>
      getOrganizationsAvailableToUser({
        keyword: '',
        userId: userId,
      }),
    enabled: open && !!userId,
  }).data?.data.map((el) => ({
    value: el.id,
    label: el.name,
  }));

  const addUsersToOrganizationMutation = useMutation({
    mutationFn: addUsersToOrganization,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('addGroupMembersSuccessfully'),
      });
      queryClient.invalidateQueries(['getDetailUserById', userId]);
      responseSuccess();
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('somethingWentWrongPleaseTryAgain'),
      });
    },
  });

  const submitData = () => {
    if (!orgIds || orgIds.length < 1) {
      showToast({
        type: 'error',
        summary: error('user.pleaseSelectUser'),
      });
      return;
    }

    addUsersToOrganizationMutation.mutate({
      userIds: [userId],
      organizationIds: orgIds,
    });
  };

  const responseSuccess = () => {
    setOpen(false);
    setOrgIds([]);
    queryClient.invalidateQueries(['getUserById', userId]);
  };

  const handleCloseModel = () => {
    setOrgIds([]);
    setOpen(false);
  };

  const handleChangeOrganizations = (data?: any) => {
    setOrgIds(data);
  };
  return (
    <Dialog
      size="md"
      open={open}
      handler={setOpen}
      dismiss={{
        outsidePress: false,
      }}
    >
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('addGroupRole')}</p>
        <button onClick={() => handleCloseModel()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="text-sm">{common('addGroupRoleDescription')}</div>
        <div className="mt-2 max-h-[500px] overflow-auto scrollbar">
          <MultipleSelect
            options={organizationsAvailable ?? []}
            placeholder={common('groupRole')}
            onChange={(e) => handleChangeOrganizations(e)}
            showSelected="all"
          ></MultipleSelect>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModel()} color="stroke" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={addUsersToOrganizationMutation.isLoading} onClick={submitData}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalAddGroupRolesToUser;
