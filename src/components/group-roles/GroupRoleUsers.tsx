import { useMemo, useState } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { t } from 'i18next';

import { ACTIONS, OBJECTS } from '@/constants/variables/common';

import { OrganizationByIdResponse, UserDto } from '@/types/user-management/organization';
import { useNavigate } from 'react-router-dom';
import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';
import UserStatus from '../users/UserStatus';
import ModalAddUsersToGroupRole from './dialog/ModalAddUsersToGroupRole';
import ModalDeleteGroupRoleUser from './dialog/ModalDeleteGroupRoleUser';

interface IProps {
  organization: OrganizationByIdResponse;
  isloading: boolean;
}
export const GroupRoleUsers = ({ organization, isloading }: IProps) => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddUserToRole, setOpenAddUserToRole] = useState(false);

  const handleAddApplication = () => {
    setOpenAddUserToRole(true);
  };
  const onHandleRemoveUserFromOrg = (user: UserDto) => {
    setCurrentUserId(user.id);
    setCurrentUserName(user.fullName ?? user.email ?? '');
    setOpenDelete(true);
  };

  const onHandleDetailUser = (id: string) => {
    navigate(`/user-and-roles/users/detail/${id}`);
  };

  const initColumns: GridColumn<UserDto>[] = useMemo(
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
        headerName: t('users'),
        width: 350,
        cellClass: 'flex',
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.avatarUrl ?? '/static/svg/profile.svg'}
                alt=""
              />
              <div className="mx-2">
                <div
                  className="text-ic-primary-6s cursor-pointer"
                  onClick={() => {
                    onHandleDetailUser(data.id);
                  }}
                >
                  {' '}
                  {data.fullName}
                </div>
                <div> {data.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        headerName: t('status'),
        cellClass: 'flex',
        width: 350,
        align: 'center',
        cellRenderer: ({ data }) => {
          return <UserStatus status={data.status}></UserStatus>;
        },
      },
      // {
      //   headerName: t('memberSince'),
      //   cellClass: 'flex',
      //   width: 270,
      //   align: 'center',
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
      //         <div className="font-normal text-ic-black-5s">
      //           {formatDate({ time: data.inviteAt, dateFormat: 'hh:mm MM/dd/yyyy' })}
      //         </div>
      //       </div>
      //     );
      //   },
      // },
      // {
      //   headerName: t('user.addedBy'),
      //   cellClass: 'flex',
      //   width: 200,
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
      //         <div className="text-sm font-normal">{data.createdBy}</div>
      //         <div className="text-xs font-normal text-ic-black-5s">
      //           {formatDate({ time: data.createdAt, dateFormat: 'hh:mm MM/dd/yyyy' })}
      //         </div>
      //       </div>
      //     );
      //   },
      // },
      {
        headerName: t('action'),
        width: 180,
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center">
              <Button
                onClick={() => {
                  onHandleDetailUser(data.id);
                }}
                className="px-2 w-40 text bg-ic-primary-6s"
              >
                {t('viewDetail')}
              </Button>
              <div className="mx-3">
                <Menu placement="bottom-start">
                  <MenuHandler>
                    <Button color="stroke" variant="outlined" className="px-2 h-9">
                      <SvgIcon icon="dots-menu" width={24} height={24} />
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.ADD_APPLICATION_ROLE}>
                      <MenuItem onClick={() => onHandleRemoveUserFromOrg(data)}>
                        <div className="flex items-center">
                          <SvgIcon icon="trash-delete-bin-2" width={24} height={24} className="text-ic-ink-6s mr-2" />
                          {t('Remove member from group')}
                        </div>
                      </MenuItem>
                    </AccessibleComponent>
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

  return (
    <div className="h-full justify-center w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg ">
        <div className="flex items-center justify-between">
          <div className="text-base font-medium">{t('users')}</div>
          <div className="text-sm font-normal leading-5 text-ic-ink-6">
            <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.ADD_APPLICATION_ROLE}>
              <Button onClick={() => handleAddApplication()}>
                <SvgIcon icon="plus" width={24} height={24} />
                <span className="ml-1">{t('addGroupMembers')}</span>
              </Button>
            </AccessibleComponent>
          </div>
        </div>
        <div className="flex-1 my-3">
          <DataGrid
            domLayout="autoHeight"
            rowAutoHeight
            isLoading={isloading}
            rowKey={'id'}
            columnDefs={initColumns}
            rowData={organization.users}
          />
        </div>
        <ModalDeleteGroupRoleUser
          organizationId={organization.id}
          userId={currentUserId}
          open={openDelete}
          setOpen={setOpenDelete}
          userName={currentUserName}
          organizationName={organization.name}
        />
        <ModalAddUsersToGroupRole
          organizationId={organization.id}
          open={openAddUserToRole}
          setOpen={setOpenAddUserToRole}
          organizationName={organization.name}
        />
      </div>
    </div>
  );
};
