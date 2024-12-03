import { useMemo, useState } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { UserPagingResponse, UserStatusEnum } from '@/types/user-management/user';
import { isGrantPermission } from '@/utils/common';

import ModalChangeStatusUser from './dialog/ModalChangeStatusUser';
import ModalDeleteUser from './dialog/ModalDeleteUser';
import UserStatus from './UserStatus';

import { useApp } from '@/hooks/use-app';
import { resendInviteSystem } from '@/services/user-management/user';
import { useMutation } from '@tanstack/react-query';
import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  items: UserPagingResponse[];
}

const TableUser = ({ items }: Props) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openActive, setOpenActive] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatusEnum | null>(null);
  const [currentId, setCurrentId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { showToast } = useApp();

  const navigate = useNavigate();
  const handleDetailUser = (id: string) => {
    navigate(`detail/${id}`);
  };
  const isShowButtonAction = () => {
    return (
      isGrantPermission(OBJECTS.USERS, ACTIONS.INVITE_USERS) ||
      isGrantPermission(OBJECTS.USERS, ACTIONS.DELETE) ||
      isGrantPermission(OBJECTS.USERS, ACTIONS.ACTIVE) ||
      isGrantPermission(OBJECTS.USERS, ACTIONS.DEACTIVE)
    );
  };
  const sendInviteMutation = useMutation({
    mutationFn: resendInviteSystem,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('user.resendInviteSuccessfully'),
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: common('somethingWentWrongPleaseTryAgain'),
      });
    },
  });
  const handleResendInvite = (userId: string) => {
    const request = {
      userId: userId,
      returnUrl: `${window.location.origin}/email-confirm`,
    };
    sendInviteMutation.mutate(request);
  };
  const initColumns: GridColumn<UserPagingResponse>[] = useMemo(
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
        headerName: common('user.users'),
        width: 300,
        flex: 1,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={data.avatarUrl ?? '/static/svg/profile.svg'}
                alt=""
              />
              <div className="mx-2">
                <div className="cursor-pointer text-ic-primary-6s" onClick={() => handleDetailUser(data.id)}>
                  {' '}
                  {data.fullName ?? data.email}
                </div>
                <div> {data.email}</div>
              </div>
            </div>
          );
        },
      },
      // {
      //   headerName: common('groupRole'),
      //   cellClass: 'flex',
      //   width: 360,
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
      //         <OrganizationCol organizations={data.organizations}></OrganizationCol>
      //       </div>
      //     );
      //   },
      // },
      // {
      //   headerName: common('role.applicationRole'),
      //   width: 360,
      //   cellClass: 'flex',
      //   cellRenderer: ({ data }) => {
      //     return <ApplicationCol applications={data.applications}></ApplicationCol>;
      //   },
      // },
      {
        headerName: common('status'),
        width: 350,
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex justify-center items-center h-full">
              <UserStatus status={data.status}></UserStatus>
            </div>
          );
        },
      },
      // {
      //   headerName: common('user.memberSince'),
      //   width: 150,
      //   cellClass: 'flex justify-center',
      //   headerClass: 'text-center',
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center text-center">
      //         <p>{formatDate({ time: data.inviteAt, dateFormat: ' hh:mm MM/dd/yyyy' })}</p>
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
              <Button
                onClick={() => {
                  handleDetailUser(data.id);
                }}
                className="px-2 w-40 text bg-ic-primary-6s"
              >
                {common('viewDetail')}
              </Button>
              {isShowButtonAction() && (
                <div className="mx-3">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.DEACTIVE}>
                        {data.status === UserStatusEnum.Active && (
                          <MenuItem
                            onClick={() => {
                              setOpenActive(true);
                              setCurrentId(data.id);
                              setUserStatus(data.status);
                            }}
                          >
                            <div className="flex items-center">
                              <SvgIcon
                                icon="file-blank-edit-pen"
                                width={24}
                                height={24}
                                className="text-ic-ink-6s mr-2"
                              />
                              {common('deactive')}
                            </div>
                          </MenuItem>
                        )}
                      </AccessibleComponent>
                      <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.ACTIVE}>
                        {data.status === UserStatusEnum.DeActive && (
                          <MenuItem
                            onClick={() => {
                              setOpenActive(true);
                              setCurrentId(data.id);
                              setUserStatus(data.status);
                            }}
                          >
                            <div className="flex items-center">
                              <SvgIcon
                                icon="file-blank-edit-pen"
                                width={24}
                                height={24}
                                className="text-ic-ink-6s mr-2"
                              />
                              {common('active')}
                            </div>
                          </MenuItem>
                        )}
                      </AccessibleComponent>
                      <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.INVITE_USERS}>
                        {data.status === UserStatusEnum.Invited && (
                          <MenuItem
                            onClick={() => {
                              handleResendInvite(data.id);
                            }}
                          >
                            <div className="flex items-center">
                              <SvgIcon icon="send" width={24} height={24} className="text-ic-ink-6s mr-2" />
                              {common('user.resendInvitation')}
                            </div>
                          </MenuItem>
                        )}
                      </AccessibleComponent>
                      <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.DELETE}>
                        <MenuItem
                          onClick={() => {
                            setOpenDelete(true);
                            setCurrentId(data.id);
                            setCurrentUserName(data.email);
                          }}
                        >
                          <div className="flex items-center">
                            <SvgIcon icon="trash-delete-bin-2" width={24} height={24} className="text-ic-ink-6s mr-2" />
                            {common('removeUser')}
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
      <ModalDeleteUser id={currentId} open={openDelete} setOpen={setOpenDelete} userName={currentUserName} />
      <ModalChangeStatusUser id={currentId} open={openActive} setOpen={setOpenActive} status={userStatus} />
    </div>
  );
};

export default TableUser;
