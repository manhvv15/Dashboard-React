import { Dispatch, SetStateAction, useState } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import { FormApplicationRole } from '@/types/user-management/user';

import SvgIcon from '@/components/commons/SvgIcon';
import { useApp } from '@/hooks/use-app';
import { getAvailableApplicationByUser } from '@/services/user-management/application';
import { addUsersToRole } from '@/services/user-management/user';
import { ApplicationItem } from '../ApplicationItem';

interface Props {
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalAddUserToRoles = ({ userId, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();
  const [applications, setApplications] = useState<FormApplicationRole[]>([]);

  useQuery({
    queryKey: ['getAvailableApplicationByUser', open, userId],
    queryFn: () =>
      getAvailableApplicationByUser({
        userId: userId,
      }),
    retry: true,
    onSuccess: (res) => {
      const input =
        res.data.map(
          (el) =>
            ({
              id: el.id,
              logoUrl: el.logoUrl,
              name: el.name,
              roleIds: [],
              roles: el.roles,
            }) as FormApplicationRole,
        ) ?? [];
      setApplications(input);
    },
    enabled: open == true && !!userId,
  }).data;

  const addUsersToRoleMutation = useMutation({
    mutationFn: addUsersToRole,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('user.changeRoleSuccessfully'),
      });
      setOpen(false);
      queryClient.invalidateQueries(['getDetailUserById', userId]);
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('somethingWentWrongPleaseTryAgain'),
      });
    },
  });

  const submitData = () => {
    const roleIds = applications.flatMap((x) => x.roleIds);
    addUsersToRoleMutation.mutate({
      roleIds: roleIds,
      userIds: [userId],
    });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const updateAppRole = (index: number, roleIds?: string[]) => {
    const selected = applications.map((o, idx) => {
      if (idx === index) {
        return {
          ...o,
          roleIds: roleIds ?? [],
        };
      }
      return o;
    });
    setApplications(selected);
  };
  return (
    <Dialog size="md" open={open} handler={handleCloseModal}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('user.addToApplication')}</p>
        <button onClick={() => handleCloseModal()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="relative w-full shadow-1 mt-4 rounded-md overflow-hidden">
          <table className="table w-full bg-white text-sm">
            <thead className="border-b-2 border-ic-ink-2 bg-ic-ink-1s table table-fixed w-full">
              <tr>
                <th
                  className="py-3 px-3 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%]  before:bg-ic-ink-2s before:right-0 before:top-[50%] before:translate-y-[-50%]"
                  align="left"
                >
                  <span className="text-sm font-medium">{common('applications')}</span>
                </th>
                <th className="py-3 px-3" align="left">
                  <span className="text-sm font-medium">{common('applicationRole')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="scroll block w-full overflow-y-auto border-[1px]">
              {applications &&
                applications?.map((item, index) => {
                  return (
                    <ApplicationItem
                      data={item}
                      appRoles={item.roles}
                      key={index}
                      updateAppRole={(data) => updateAppRole(index, data)}
                      rolesSelected={item.roleIds ?? []}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModal()} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={addUsersToRoleMutation.isLoading} onClick={() => submitData()}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalAddUserToRoles;
