import { useEffect, useMemo, useState } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

import { RoleStatusEnum } from '@/types/user-management/role';
import { FormApplicationRole, UserByIdResponse } from '@/types/user-management/user';

import { LocaleNamespace } from '@/constants/enums/common';
import { useGetApplication } from '@/hooks-query/application';
import { useApp } from '@/hooks/use-app';
import { getRolePaging } from '@/services/user-management/role';
import { updateApplicationRolesOfUser } from '@/services/user-management/user';
import SvgIcon from '../commons/SvgIcon';
import ModalAddUserToRoles from './dialog/ModalAddUserToRoles';
import ModalDeleteUserFromApplication from './dialog/ModalDeleteUserFromApplication';
import { ApplicationRoleForm } from '../commons/ApplicationRoleForm';

interface IProps {
  user: UserByIdResponse;
  isloading?: boolean;
}
export const DetailUserApplications = ({ user, isloading }: IProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();
  const [openAddUserToRole, setOpenAddUserToRole] = useState(false);
  const { showToast } = useApp();
  const [openDelete, setOpenDelete] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState('');
  const [applications, setApplications] = useState<FormApplicationRole[]>([]);

  const { data: roles } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () =>
      getRolePaging({
        pageNumber: 0,
        pageSize: 1000,
        workspaceId: '',
        applicationIds: [],
        status: [RoleStatusEnum.Active],
        keyword: '',
      }),
    select: (response) => {
      return response.data?.items.map((i) => ({ label: i.name, value: i.id, applicationId: i.applicationId })) ?? [];
    },
  });

  const addUsersToRoleMutation = useMutation({
    mutationFn: updateApplicationRolesOfUser,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('user.changeRoleSuccessfully'),
      });
      queryClient.invalidateQueries(['getDetailUserById', user.id]);
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('somethingWentWrongPleaseTryAgain'),
      });
    },
  });

  const updateAppRole = (applicationId: string, roleIds?: string[]) => {
    const selected = applications.map((o, idx) => {
      const index = applications.findIndex((x) => x.id == applicationId);
      if (idx === index) {
        return {
          ...o,
          roleIds: roleIds ?? [],
        };
      }
      return o;
    });

    setApplications(selected);

    addUsersToRoleMutation.mutate({
      applicationId: applicationId,
      roleIds: roleIds,
      userId: user.id,
    });
  };

  const handleAddApplication = () => {
    setOpenAddUserToRole(true);
  };

  const onHandleRemoveUserFromApp = (data: FormApplicationRole) => {
    setCurrentApplicationId(data.id);
    setOpenDelete(true);
  };

  const initColumns: GridColumn<FormApplicationRole>[] = useMemo(
    () => [
      {
        headerName: t('#'),
        cellClass: 'flex justify-center flex-1',
        headerClass: 'text-center',
        width: 50,
        cellRenderer: ({ node }) => {
          return (
            <div className="text-sm  font-normal leading-5 text-ic-ink-6s h-fullh-full flex flex-col justify-center text-center">
              {node.childIndex + 1}
            </div>
          );
        },
      },
      {
        headerName: t('user.application'),
        width: 350,
        cellClass: 'flex',
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
              <img className="w-8 h-8 rounded-full object-cover" src={data.logoUrl ?? ''} alt="" />
              <div className="mx-2">
                <div> {data.name}</div>
              </div>
            </div>
          );
        },
      },
      {
        headerName: t('user.applicationRole'),
        width: 350,
        cellClass: 'flex',
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <ApplicationRoleForm
              appRoles={roles?.filter((x) => x.applicationId == data.id) ?? []}
              rolesSelected={data.roleIds ?? []}
              updateAppRole={(response) => updateAppRole(data.id, response)}
              error=""
            ></ApplicationRoleForm>
          );
        },
      },
      {
        headerName: t('action'),
        width: 80,
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center">
              <div className="mx-3">
                <Menu placement="bottom-start">
                  <MenuHandler>
                    <Button color="stroke" variant="outlined" className="px-2 h-9">
                      <SvgIcon icon="dots-menu" width={24} height={24} />
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => onHandleRemoveUserFromApp(data)}>
                      <div className="flex items-center">
                        <SvgIcon icon="trash-delete-bin-2" width={24} height={24} className="text-ic-ink-6 mr-2" />
                        {t('user.removeFromApplication')}
                      </div>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          );
        },
      },
    ],
    [roles, applications.length],
  );

  const totalApplication = useGetApplication({
    isSystem: true,
  }).data?.data?.items.map((i) => i.id).length;

  useEffect(() => {
    setApplications(
      user.applications.map(
        (el) =>
          ({
            id: el.id,
            logoUrl: el.logoUrl,
            name: el.name,
            roleIds: el.roleIds,
            roles: [],
          }) as FormApplicationRole,
      ),
    );
  }, [user.applications.length]);
  return (
    <div className="h-full justify-center w-full max-w-[1200px] pb-3">
      <div className="bg-ic-white-6s p-4 rounded-lg h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium">{common('user.roleApplications')}</div>
          <div className="text-sm font-normal leading-5 text-ic-ink-6">
            <Button
              onClick={() => handleAddApplication()}
              variant="outlined"
              disabled={totalApplication == applications.length}
            >
              <SvgIcon icon="plus" width={24} height={24} />
              <span className="ml-1">{common('user.addApplication')}</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 my-3">
          <DataGrid
            domLayout="autoHeight"
            rowAutoHeight
            isLoading={isloading}
            rowKey={'id'}
            columnDefs={initColumns}
            rowData={applications}
          />
        </div>
        <ModalAddUserToRoles userId={user.id} open={openAddUserToRole} setOpen={setOpenAddUserToRole} />
        <ModalDeleteUserFromApplication
          userId={user.id}
          applicationId={currentApplicationId}
          open={openDelete}
          setOpen={setOpenDelete}
        />
      </div>
    </div>
  );
};
