import { Dispatch, SetStateAction, useMemo } from 'react';

import { Button, DataGrid, GridColumn, Menu, MenuHandler, MenuItem, MenuList } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { formatNumber, isGrantPermission, SetStatePropertyFunc } from '@/utils/common';

import { GetManagementWorkspaceQueryResponse, WorkspaceManagementRequest } from '@/types/user-management/workspace';
import { SortChangedEvent } from 'ag-grid-community';
import AccessibleComponent from '../commons/AccessibleComponent';
import SvgIcon from '../commons/SvgIcon';
import CreatedByInforCol from './cols/CreatedByInforCol';
import MarketCol from './cols/MarketCol';
import SubscriptionCol from './cols/SubscriptionCol';
import WalletCol from './cols/WalletCol';
import WorkspaceInfoCol from './cols/WorkspaceInfoCol';

interface Props {
  items: GetManagementWorkspaceQueryResponse[];
  isLoading: boolean;
  setParams: Dispatch<SetStateAction<WorkspaceManagementRequest>>;
}

const TableWorkspace = ({ items, isLoading, setParams }: Props) => {
  const navigate = useNavigate();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const handleEditRole = (id: string) => {
    navigate(`${id}/detail`);
  };

  const isShowButtonAction = () => {
    return isGrantPermission(OBJECTS.WORKSPACES, ACTIONS.EDIT);
  };

  const initColumns = useMemo(() => {
    const columns: GridColumn<GetManagementWorkspaceQueryResponse>[] = [
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
        pinned: 'left',
      },
      {
        headerName: common('workspaceInfo'),
        width: 300,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col">
              <WorkspaceInfoCol workspace={data}></WorkspaceInfoCol>
            </div>
          );
        },
        pinned: 'left',
      },
      {
        headerName: common('createdBy'),
        width: 300,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col">
              <CreatedByInforCol workspace={data}></CreatedByInforCol>
            </div>
          );
        },
      },
      {
        headerName: common('subscriptionInfo'),
        minWidth: 350,
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col">
              <SubscriptionCol subscriptions={data.subscriptions}></SubscriptionCol>
            </div>
          );
        },
      },
      {
        headerName: common('unpaidAmount'),
        width: 180,
        sortable: true,
        field: 'unpaidAmount',
        comparator: function () {
          return 0;
        },
        align: 'right',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col text-end">
              {formatNumber(data.unpaidAmount)} {data.currencyCode}
            </div>
          );
        },
      },
      {
        headerName: common('monthlyRecurringRevenue'),
        width: 200,
        sortable: true,
        field: 'monthlyRecurringRevenue',
        comparator: function () {
          return 0;
        },
        align: 'right',
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col text-end">
              {formatNumber(data.monthlyRecurringRevenue)} {data.currencyCode}
            </div>
          );
        },
      },
      {
        headerName: common('netPayment'),
        width: 180,
        sortable: true,
        field: 'netPayment',
        align: 'right',
        comparator: function () {
          return 0;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col text-end">
              {formatNumber(data.netPayment)} {data.currencyCode}
            </div>
          );
        },
      },
      {
        headerName: common('customer'),
        width: 90,
        cellClass: 'flex justify-center',
        align: 'right',
        sortable: true,
        field: 'customerCount',
        comparator: function () {
          return 0;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="flex justify-end items-end h-full text-right text-ic-primary-6s">{data.customerCount}</div>
          );
        },
      },
      {
        headerName: common('user'),
        width: 90,
        cellClass: 'flex justify-center',
        sortable: true,
        align: 'right',
        field: 'userCount',
        comparator: function () {
          return 0;
        },
        cellRenderer: ({ data }) => {
          return <div className="flex justify-end items-end h-full text-ic-primary-6s">{data.userCount}</div>;
        },
      },
      {
        headerName: common('walletBalance'),
        width: 200,
        cellClass: 'flex justify-center',
        cellRenderer: ({ data }) => {
          return <WalletCol wallets={data.wallets}></WalletCol>;
        },
      },
      {
        headerName: common('market'),
        width: 230,
        cellClass: 'flex justify-center',
        headerComponent: () => {
          return <div className="flex justify-end items-end w-full text-end">{common('market')}</div>;
        },
        cellRenderer: ({ data }) => {
          return <MarketCol markets={data.markets}></MarketCol>;
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
                      <AccessibleComponent object={OBJECTS.WORKSPACES} action={ACTIONS.EDIT}>
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

export default TableWorkspace;
