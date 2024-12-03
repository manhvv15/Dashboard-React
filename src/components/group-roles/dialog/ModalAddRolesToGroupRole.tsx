import { Dispatch, SetStateAction, useState } from 'react';

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import { FormApplicationRole } from '@/types/user-management/user';

import SvgIcon from '@/components/commons/SvgIcon';
import { ApplicationItem } from '@/components/users/ApplicationItem';
import { useApp } from '@/hooks/use-app';
import { getApplicationPaging } from '@/services/user-management/application';
import { addRolesToOrganizations, getAvailableRolesByOrganizationId } from '@/services/user-management/organization';

interface Props {
  id: string;
  open: boolean;
  isSystem: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalAddRolesToRoleGroup = ({ id, open, setOpen, isSystem }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();
  const [applications, setApplications] = useState<FormApplicationRole[]>([]);
  useQuery({
    queryKey: ['getApplicationPaging', open],
    queryFn: () =>
      getApplicationPaging({
        pageNumber: 0,
        pageSize: 100,
        keyword: '',
        isSystem: isSystem,
      }),
    retry: true,
    onSuccess: (res) => {
      const input =
        res.data.items.map(
          (el) =>
            ({
              id: el.id,
              logoUrl: el.logoUrl,
              name: el.name,
              roles: [],
              roleIds: [],
            }) as FormApplicationRole,
        ) ?? [];
      setApplications(input);
    },
    enabled: open,
  }).data;

  const roles =
    useQuery({
      queryKey: ['getAvailableRolesByUserId', id],
      queryFn: () =>
        getAvailableRolesByOrganizationId({
          keyword: '',
          workspaceId: '',
          organizationId: id,
        }),
      retry: true,
      enabled: !!id && open,
    }).data?.data ?? [];

  const addRolesToOrganizationMutation = useMutation({
    mutationFn: addRolesToOrganizations,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('addApplicationToGroupRoleSuccessfully'),
      });
      setOpen(false);
      queryClient.invalidateQueries(['getDetailOrganizationById', id]);
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
    addRolesToOrganizationMutation.mutate({
      roleIds: roleIds,
      organizationIds: [id],
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
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('addApplicationToGroupRole')}</p>
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
            <tbody className="scroll block w-full overflow-y-auto border-[1px] max-h-[400px] scrollbar">
              {applications &&
                applications?.map((item, index) => {
                  return (
                    <ApplicationItem
                      data={item}
                      appRoles={roles?.filter((x) => x.applicationId == item.id) ?? []}
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
        <Button loading={addRolesToOrganizationMutation.isLoading} onClick={() => submitData()} className="ml-1">
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalAddRolesToRoleGroup;
