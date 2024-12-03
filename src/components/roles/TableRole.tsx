import { useMemo, useState } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { RolePagingResponse } from '@/types/user-management/role';
import { isGrantPermission } from '@/utils/common';

import ModalAddUsersToRole from './dialog/ModalAddUsersToRole';
import ModalDeleteRole from './dialog/ModalDeleteRole';
import RoleStatus from './RoleStatus';

import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  items: RolePagingResponse[];
}

const TableRole = ({ items }: Props) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddUsersToRole, setOpenAddUsersToRole] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [roleName, setRoleName] = useState('');
  const navigate = useNavigate();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const handleEditRole = (id: string) => {
    navigate(`edit/${id}`);
  };

  const handleDuplicateRole = (id: string) => {
    navigate(`duplicate/${id}`);
  };

  const onHandleAddUsersToRole = (data: RolePagingResponse) => {
    setCurrentId(data.id);
    setRoleName(data.name);
    setOpenAddUsersToRole(true);
  };
  const onRedirectUsersByRoleId = (roleId: string) => {
    navigate(`/user-and-roles/users?roleId=${roleId}`);
  };

  const isShowButtonAction = () => {
    return isGrantPermission(OBJECTS.ROLES, ACTIONS.DELETE) || isGrantPermission(OBJECTS.ROLES, ACTIONS.CREATE);
  };
  const initColumns: GridColumn<RolePagingResponse>[] = useMemo(
    () => [
      {
        headerName: common('#'),
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        width: 50,
        cellRenderer: ({ node }) => {
          return (
            <div className="text-sm  font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center text-center">
              {node.childIndex + 1}
            </div>
          );
        },
      },
      {
        headerName: common('role.applicationRole'),
        cellClass: 'flex',
        width: 260,
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              <div className="overflow-hidden text-ellipsis"> {data.name}</div>
              <div className="overflow-hidden text-ellipsis text-xs text-ic-black-5s"> {data.code}</div>
            </div>
          );
        },
      },
      {
        headerName: common('application'),
        width: 350,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.applicationLogoUrl ?? '/static/svg/profile.svg'}
                alt=""
              />
              <div className="mx-2">{data.applicationName || '-'}</div>
            </div>
          );
        },
      },
      {
        headerName: common('role.numberOfUsers'),
        width: 200,
        cellClass: 'flex items-end',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center items-end">
              <button onClick={() => onRedirectUsersByRoleId(data.id)} className="text-ic-primary-6s">
                {data.numberOfUsers || ''}
              </button>
            </div>
          );
        },
      },
      {
        headerName: common('status'),
        width: 200,
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex justify-center items-center h-full">
              <RoleStatus status={data.status}></RoleStatus>
            </div>
          );
        },
      },
      // {
      //   headerName: common('createdAt'),
      //   width: 190,
      //   headerClass: 'text-center',
      //   cellClass: 'text-center',
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
      //         <p>{formatDate({ time: data.createdAt, dateFormat: ' hh:mm MM/dd/yyyy' })}</p>
      //       </div>
      //     );
      //   },
      // },
      // {
      //   headerName: common('updatedAt'),
      //   width: 190,
      //   headerClass: 'text-center',
      //   cellClass: 'text-center',
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
      //         {data.updatedAt ? (
      //           <>
      //             <p>{formatDate({ time: data.updatedAt, dateFormat: 'hh:mm MM/dd/yyyy' })}</p>
      //           </>
      //         ) : (
      //           ''
      //         )}
      //       </div>
      //     );
      //   },
      // },
      {
        headerName: common('action'),
        width: 200,
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center">
              <AccessibleComponent object={OBJECTS.ROLES} action={ACTIONS.EDIT}>
                <Button onClick={() => handleEditRole(data.id)} className="px-2 w-40 text bg-ic-primary-6s">
                  {common('edit')}
                </Button>
              </AccessibleComponent>
              {isShowButtonAction() && (
                <div className="mx-3">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      {data.isApplicationSystem && isGrantPermission(OBJECTS.ROLES, ACTIONS.ADD_USERS_TO_ROLE) && (
                        <MenuItem onClick={() => onHandleAddUsersToRole(data)}>
                          <div className="flex items-center">
                            <SvgIcon
                              icon="single-user-add-plus_1"
                              width={24}
                              height={24}
                              className="text-ic-ink-6s mr-2"
                            />
                            {common('role.addUsersToRole')}
                          </div>
                        </MenuItem>
                      )}

                      <AccessibleComponent object={OBJECTS.ROLES} action={ACTIONS.DUPLICATE}>
                        <MenuItem onClick={() => handleDuplicateRole(data.id)}>
                          <div className="flex items-center">
                            <SvgIcon
                              icon="copy-duplicate-object-add-plus"
                              width={24}
                              height={24}
                              className="text-ic-ink-6s mr-2"
                            />
                            {common('role.duplicateRole')}
                          </div>
                        </MenuItem>
                      </AccessibleComponent>

                      <AccessibleComponent object={OBJECTS.ROLES} action={ACTIONS.DELETE}>
                        <MenuItem
                          onClick={() => {
                            setOpenDelete(true);
                            setCurrentId(data.id);
                          }}
                        >
                          <div className="flex items-center">
                            <SvgIcon icon="trash-delete-bin-2" width={24} height={24} className="text-ic-ink-6s mr-2" />
                            {common('delete')}
                          </div>
                        </MenuItem>
                      </AccessibleComponent>
                    </MenuList>
                  </Menu>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="h-full flex-1 my-3">
      <DataGrid rowHeight={58} rowKey={'id'} columnDefs={initColumns} rowData={items} />
      <ModalDeleteRole id={currentId} open={openDelete} setOpen={setOpenDelete} />
      <ModalAddUsersToRole
        roleId={currentId}
        open={openAddUsersToRole}
        setOpen={setOpenAddUsersToRole}
        roleName={roleName}
      />
    </div>
  );
};

export default TableRole;
