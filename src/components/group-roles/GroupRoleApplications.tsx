import { useEffect, useMemo, useState } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useGetApplication } from '@/hooks-query/application';
import { useApp } from '@/hooks/use-app';
import { updateApplicationRoleByOrganization } from '@/services/user-management/organization';
import { getRolePaging } from '@/services/user-management/role';
import { OrganizationByIdResponse } from '@/types/user-management/organization';
import { RoleStatusEnum } from '@/types/user-management/role';
import { ApplicationResponse, FormApplicationRole } from '@/types/user-management/user';
import { ApplicationRoleForm } from '../commons/ApplicationRoleForm';
import SvgIcon from '../commons/SvgIcon';
import ModalAddRolesToGroupRole from './dialog/ModalAddRolesToGroupRole';
import ModalDeleteGroupRoleRole from './dialog/ModalDeleteGroupRoleRole';

interface IProps {
  organization: OrganizationByIdResponse;
  isloading: boolean;
}
export const GroupRoleApplications = ({ organization, isloading }: IProps) => {
  const queryClient = useQueryClient();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [applications, setApplications] = useState<FormApplicationRole[]>([]);
  const [currentApplicationId, setCurrentApplicationId] = useState('');
  const [currentApplicationName, setCurrentApplicationName] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddUserToRole, setOpenAddUserToRole] = useState(false);
  const { showToast } = useApp();

  const handleAddApplication = () => {
    setOpenAddUserToRole(true);
  };

  const onHandleRemoveApplicationFromGroup = (data: ApplicationResponse) => {
    setCurrentApplicationName(data.name);
    setCurrentApplicationId(data.id);
    setOpenDelete(true);
  };

  const totalApplication = useGetApplication({
    isSystem: organization.isSystem,
  }).data?.data?.items.map((i) => i.id).length;

  const { data: roles } = useQuery({
    queryKey: ['getAllRolesByWorkspace', ''],
    queryFn: () =>
      getRolePaging({
        pageNumber: 0,
        pageSize: 500,
        workspaceId: '',
        applicationIds: [],
        status: [RoleStatusEnum.Active],
        keyword: '',
      }),
    select: (response) => {
      return (
        response.data?.items.map((i) => ({
          label: i.name,
          value: i.id,
          applicationId: i.applicationId,
          isSystem: i.isSystem,
        })) ?? []
      );
    },
  });

  const updateApplicationRoleMutation = useMutation({
    mutationFn: updateApplicationRoleByOrganization,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('user.changeRoleSuccessfully'),
      });
      queryClient.invalidateQueries(['getDetailUserById']);
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('somethingWentWrongPleaseTryAgain'),
      });
    },
  });

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

    const app = applications[index];
    updateApplicationRoleMutation.mutate({
      applicationId: app.id,
      organizationId: organization.id,
      roleIds: roleIds,
    });
  };

  useEffect(() => {
    setApplications(
      organization.applications.map(
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
  }, [organization.applications.length]);

  const initColumns: GridColumn<ApplicationResponse>[] = useMemo(
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
        cellRenderer: ({ data, node }) => {
          return (
            <ApplicationRoleForm
              appRoles={roles?.filter((x) => x.applicationId == data.id) ?? []}
              rolesSelected={data.roleIds ?? []}
              updateAppRole={(data) => updateAppRole(node.childIndex, data)}
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
                    <MenuItem onClick={() => onHandleRemoveApplicationFromGroup(data)}>
                      <div className="flex items-center">
                        <SvgIcon icon="trash-delete-bin-2" width={24} height={24} className="text-ic-ink-6 mr-2" />
                        {t('removeApplicationFromGroup')}
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
    [applications, roles],
  );

  return (
    <div className="h-full justify-center w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg ">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium">{t('groupApplicationAccess')}</div>
          <div className="text-sm font-normal leading-5 text-ic-ink-6">
            <Button
              onClick={() => handleAddApplication()}
              disabled={totalApplication == organization.applications.length}
            >
              <SvgIcon icon="plus" width={24} height={24} />
              <span className="ml-1">{t('addApplication')}</span>
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
        <ModalAddRolesToGroupRole
          id={organization.id}
          isSystem={organization.isSystem}
          open={openAddUserToRole}
          setOpen={setOpenAddUserToRole}
        />
        <ModalDeleteGroupRoleRole
          organizationId={organization.id}
          applicationId={currentApplicationId}
          open={openDelete}
          setOpen={setOpenDelete}
          name={organization.name}
          applicationName={currentApplicationName}
        />
      </div>
    </div>
  );
};
