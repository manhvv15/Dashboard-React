import { Dispatch, SetStateAction, useMemo } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { formatDate, isGrantPermission, SetStatePropertyFunc } from '@/utils/common';

import { CustomerPagingRequest, CustomerPagingResponse } from '@/types/user-management/customer';
import { GetManagementWorkspaceQueryResponse, WorkspaceManagementRequest } from '@/types/user-management/workspace';
import { SortChangedEvent } from 'ag-grid-community';
import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';
import AuthenticationStatus from './cols/AuthenticationStatus';
import CustomerStatus from './cols/CustomerStatus';
import WorkspaceCol from './cols/WorkspaceCol';

interface Props {
  items: CustomerPagingResponse[];
  isLoading: boolean;
  setParams: Dispatch<SetStateAction<CustomerPagingRequest>>;
}

const TableCustomer = ({ items, isLoading, setParams }: Props) => {
  const navigate = useNavigate();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const handleEditRole = (id: string) => {
    navigate(`detail/${id}`);
  };

  const isShowButtonAction = () => {
    return isGrantPermission(OBJECTS.CUSTOMERS, ACTIONS.EDIT);
  };
  const initColumns = useMemo(() => {
    const columns: GridColumn<CustomerPagingResponse>[] = [
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
        headerName: common('userInfo'),
        width: 300,
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-row">
              <div className="mt-2">
                <CustomerStatus status={data.status}></CustomerStatus>
              </div>
              <div className="flex flex-col py-2 pl-1">
                <div className="text-sm text-ic-primary-6s cursor-pointer">{data.fullName}</div>
                <div className="text-sm text-ic-black-5s">{data.email}</div>
                <div className="text-sm text-ic-black-5s">{data.phoneNumber}</div>
              </div>
            </div>
          );
        },
      },
      {
        headerName: common('authenticationStatus'),
        width: 300,
        sortable: true,
        align: 'center',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col text-end">
              <AuthenticationStatus data={data}></AuthenticationStatus>
            </div>
          );
        },
      },
      {
        headerName: common('usedWorkspace'),
        width: 300,
        sortable: true,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col text-end">
              <WorkspaceCol workspaces={data.workspaces}></WorkspaceCol>
            </div>
          );
        },
      },
      {
        headerName: common('countryCode'),
        width: 200,
        sortable: true,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col">{data.countryCode}</div>
          );
        },
      },
      {
        headerName: common('createdAt'),
        width: 300,
        headerClass: 'text-center',
        align: 'center',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center">
              {formatDate({ time: data.createdAt, dateFormat: ' hh:mm MM/dd/yyyy' })}
            </div>
          );
        },
      },
      {
        headerName: common('action'),
        width: 100,
        pinned: 'right',
        headerClass: 'text-center',
        cellClass: 'text-center',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center justify-center">
              {isShowButtonAction() && (
                <div className="mx-3">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button color="stroke" variant="outlined" className="px-2 h-9">
                        <SvgIcon icon="dots-menu" width={24} height={24} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <AccessibleComponent object={OBJECTS.CUSTOMERS} action={ACTIONS.EDIT}>
                        <MenuItem onClick={() => handleEditRole(data.id)}>
                          <div className="flex items-center">{common('detail')}</div>
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
    ];
    return columns;
  }, []);
  const filterHandler: SetStatePropertyFunc<WorkspaceManagementRequest> = (propertyName, value) => {
    setParams((prev) => ({
      ...prev,
      pageNumber: 0,
      [propertyName]: value,
    }));
  };
  const onHandleSort = (event: SortChangedEvent<GetManagementWorkspaceQueryResponse>) => {
    const column = event.api.getColumnState().find((col) => col.sort)?.colId;
    const sort = event.api.getColumnState().find((col) => col.sort)?.sort;
    let sorting = '';
    if (!!column && !!sort) sorting = `${column} ${sort}`;

    filterHandler('sorting', sorting);
  };
  return (
    <div className="h-full flex-1 my-3">
      <DataGrid
        rowHeight={80}
        rowKey={'id'}
        suppressMultiSort
        columnDefs={initColumns}
        rowData={items}
        isLoading={isLoading}
        onSortChanged={(event) => onHandleSort(event)}
      />
    </div>
  );
};

export default TableCustomer;
