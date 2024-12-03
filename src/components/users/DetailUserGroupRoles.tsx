import { useMemo, useState } from 'react';

import { OrganizationResponse, UserByIdResponse } from '@/types/user-management/user';
import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';

import { getOrganizationPaging } from '@/services/user-management/organization';
import ApplicationAccess from '../commons/ApplicationAccess';
import SvgIcon from '../commons/SvgIcon';
import ModalAddGroupRolesToUser from './dialog/ModalAddGroupRolesToUser';
import ModalDeleteUserFromGroupRole from './dialog/ModalDeleteUserFromGroupRole';

interface IProps {
  user: UserByIdResponse;
  isloading?: boolean;
}
export const DetailUserGroupRoles = ({ user, isloading = false }: IProps) => {
  const [currentOrganizationId, setCurrentOrganizationId] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddUserToRole, setOpenAddUserToRole] = useState(false);

  const totalOrganization = useQuery({
    queryKey: ['totalOrganizationByWorkspace'],
    queryFn: () =>
      getOrganizationPaging({
        pageNumber: 0,
        pageSize: 1000,
        keyword: '',
        workspaceId: '',
      }),
    retry: true,
  }).data?.data.totalRecords;

  const handleAddApplication = () => {
    setOpenAddUserToRole(true);
  };
  const onHandleRemoveUserFromApp = (data: OrganizationResponse) => {
    setCurrentOrganizationId(data.id);
    setOpenDelete(true);
  };

  const initColumns: GridColumn<OrganizationResponse>[] = useMemo(
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
        headerName: t('groupRole'),
        cellClass: 'flex',
        width: 500,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 h-full flex flex-col justify-center">
              <a href={`/user-and-roles/group-roles/detail/${data.id}`} className="text-ic-primary-6s">
                {data.name}
              </a>
            </div>
          );
        },
      },
      {
        headerName: t('applicationAccess'),
        cellClass: 'flex',
        width: 180,
        flex: 1,
        cellRenderer: ({ data }) => {
          return <ApplicationAccess applications={data.applications}></ApplicationAccess>;
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
                        {t('removeFromGroupRole')}
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
    [],
  );

  console.log('user', user);
  return (
    <div className="h-full justify-center w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg ">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium">{t('groupRole')}</div>
          <div className="text-sm font-normal leading-5 text-ic-ink-6">
            <Button
              onClick={() => handleAddApplication()}
              variant="outlined"
              disabled={totalOrganization == user.organizations.length}
            >
              <SvgIcon icon="plus" width={24} height={24} />
              <span className="ml-1">{t('addGroupRole')}</span>
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
            rowData={user.organizations}
          />
        </div>
        <ModalDeleteUserFromGroupRole
          userId={user.id}
          organizationId={currentOrganizationId}
          open={openDelete}
          setOpen={setOpenDelete}
        />
        <ModalAddGroupRolesToUser userId={user.id} open={openAddUserToRole} setOpen={setOpenAddUserToRole} />
      </div>
    </div>
  );
};
