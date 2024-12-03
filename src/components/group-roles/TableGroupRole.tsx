import { useMemo, useState } from 'react';

import {
  Button,
  DataGrid,
  GridColumn,
  GridCommunity,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { OrganizationPagingResponse } from '@/types/user-management/organization';
import { isGrantPermission } from '@/utils/common';

import { useApp } from '@/hooks/use-app';
import { orderOrganization } from '@/services/user-management/organization';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AccessibleComponent from '../commons/AccessibleComponent';
import ApplicationAccess from '../commons/ApplicationAccess';
import SvgIcon from '../commons/SvgIcon';
import ModalDeleteGroupRole from './dialog/ModalDeleteGroupRole';
import ModalEditGroupRole from './dialog/ModalEditGroupRole';

interface Props {
  items: OrganizationPagingResponse[];
}

const TableGroupRole = ({ items }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [currentName, setCurrentName] = useState('');
  const navigate = useNavigate();
  const { showToast } = useApp();

  const handleDetailOrg = (id: string) => {
    navigate(`detail/${id}`);
  };

  const onRedirectUsersByOrgId = (orgId: string) => {
    navigate(`/user-and-roles/users?organizationId=${orgId}`);
  };

  const orderOrganizationMutation = useMutation({
    mutationFn: orderOrganization,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('orderGroupRoleSuccessfully'),
      });
    },
  });

  const onHandleRowDrag = (event: GridCommunity.RowDragEvent<OrganizationPagingResponse>) => {
    const rows: any[] = [];
    event.api.forEachNode((node, index) => node.data && rows.push({ id: node.data.id, order: index }));
    orderOrganizationMutation.mutate({
      organizations: rows,
    });
  };

  const initColumns: GridColumn<OrganizationPagingResponse>[] = useMemo(
    () => [
      {
        rowDrag: true,
        width: 50,
        align: 'center',
      },
      {
        headerName: common('group'),
        cellClass: 'flex',
        width: 260,
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              <div className=" text-sm text-ic-primary-6s cursor-pointer" onClick={() => handleDetailOrg(data.id)}>
                {data.name || '-'}
              </div>
              <div className="text-[10px] text-ic-black-5s">{data.description ?? common('noDescription')}</div>
            </div>
          );
        },
      },
      {
        headerName: common('support'),
        width: 200,
        cellClass: 'flex',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              {data.isSystem ? common('forSystem') : common('forWorkspace')}
            </div>
          );
        },
      },
      // {
      //   headerName: common('organization.orderNumber'),
      //   width: 200,
      //   cellClass: 'flex items-end',
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center items-end">
      //         {data.order}
      //       </div>
      //     );
      //   },
      // },
      {
        headerName: common('numberOfUsers'),
        width: 200,
        align: 'right',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center items-end">
              <button onClick={() => onRedirectUsersByOrgId(data.id)} className="text-ic-primary-6s">
                {data.userCount || 0}
              </button>
            </div>
          );
        },
      },
      {
        headerName: common('applicationAccess'),
        width: 200,
        cellRenderer: ({ data }) => {
          return <ApplicationAccess applications={data.applications}></ApplicationAccess>;
        },
      },
      // {
      //   headerName: common('createdAt'),
      //   width: 200,
      //   headerClass: 'text-center',
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center text-center">
      //         <p>{formatDate({ time: data.createdAt, dateFormat: ' hh:mm MM/dd/yyyy' })}</p>
      //       </div>
      //     );
      //   },
      // },
      // {
      //   headerName: common('updatedAt'),
      //   width: 200,
      //   headerClass: 'text-center',
      //   cellRenderer: ({ data }) => {
      //     return (
      //       <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center text-center">
      //         {data.updatedAt ? (
      //           <>
      //             <p>{formatDate({ time: data.updatedAt, dateFormat: 'hh:mm MM/dd/yyyy' })}</p>
      //           </>
      //         ) : (
      //           '-'
      //         )}
      //       </div>
      //     );
      //   },
      // },
      {
        headerName: common('action'),
        width: 210,
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center ">
              <AccessibleComponent object={OBJECTS.GROUP_ROLE} action={ACTIONS.EDIT}>
                <Button
                  onClick={() => {
                    handleDetailOrg(data.id);
                  }}
                  className="px-2 w-40 text bg-ic-primary-6s"
                >
                  {common('viewDetail')}
                </Button>
              </AccessibleComponent>
              {isGrantPermission(OBJECTS.GROUP_ROLE, ACTIONS.DELETE) && (
                <div className="mx-3">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <AccessibleComponent object={OBJECTS.GROUP_ROLE} action={ACTIONS.DELETE}>
                        <MenuItem
                          onClick={() => {
                            setOpenDelete(true);
                            setCurrentId(data.id);
                            setCurrentName(data.name);
                          }}
                        >
                          {common('delete')}
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
    <div className="h-full">
      <DataGrid
        rowHeight={60}
        rowKey={'id'}
        columnDefs={initColumns}
        rowData={items}
        rowDragManaged
        onRowDragEnd={onHandleRowDrag}
      />
      <ModalDeleteGroupRole id={currentId} open={openDelete} setOpen={setOpenDelete} name={currentName} />
      <ModalEditGroupRole open={openUpdate} setOpen={setOpenUpdate} id={currentId}></ModalEditGroupRole>
    </div>
  );
};

export default TableGroupRole;
