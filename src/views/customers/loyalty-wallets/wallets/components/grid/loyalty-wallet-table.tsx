import { useState } from 'react';

import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { WalletItem } from '@/types/loyalty';
import NoDataTable from '@/views/customers/invoices/components/grid/nodata-table';

import Balance from './columns/balance';
import PeriodDeposit from './columns/period-deposit';
import TotalSpend from './columns/total-spend';
import InformationWorkspace from './columns/workspace-information';

import { DataHistoryDetailTransacion } from '../../../transactions/components/grid/table-transaction';
import TransactionHistoryDetail from '../../../transactions/detail';

interface props {
  data: WalletItem[];
  reset: () => void;
}
const LoyaltyWalletTable = ({ data, reset }: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const [isDetailWallet, setIsDetailWallet] = useState<boolean>(false);
  const [dataDetailWallet, setDataDetailWallet] = useState<DataHistoryDetailTransacion>();
  const openDetailWallet = (data: WalletItem) => {
    setIsDetailWallet(true);
    setDataDetailWallet({
      currency: data.currency,
      slug: data.workspaceInformation?.slug ?? '',
      walletId: data.id,
      workspaceId: data.workspaceId ?? data.workspaceInformation?.id ?? '',
    });
  };
  const onCloseDetailWallet = () => {
    setIsDetailWallet(false);
    reset();
  };
  const clolumnRef: GridColumn[] = [
    {
      align: 'left',
      cellClass: 'cursor-pointer',
      headerName: customer('customer.loyalty.wallet.table.header.workspace'),
      cellRenderer: (params) => {
        return <InformationWorkspace data={params.data} />;
      },
      width: 400,
    },
    {
      align: 'right',
      cellClass: 'cursor-pointer',
      width: 400,
      headerName: customer('customer.loyalty.wallet.table.header.totalSpend'),
      cellRenderer: (params) => {
        return <TotalSpend data={params.data} />;
      },
    },
    {
      width: 400,
      align: 'right',
      cellClass: 'cursor-pointer',
      headerName: customer('customer.loyalty.wallet.table.header.periodDeposit'),
      cellRenderer: (params) => {
        return <PeriodDeposit data={params.data} />;
      },
    },
    {
      width: 440,
      flex: 1,
      cellClass: 'cursor-pointer',
      align: 'right',
      headerName: customer('customer.loyalty.wallet.table.header.balance'),
      cellRenderer: (params) => {
        return <Balance data={params.data} />;
      },
    },
  ];
  return (
    <div className="flex-1 overflow-hidden ">
      <DataGrid
        columnDefs={clolumnRef}
        rowData={data}
        rowKey="id"
        rowHeight={76}
        onRowClicked={({ data }) => {
          openDetailWallet(data);
        }}
        noRowsOverlayComponent={() => (
          <NoDataTable>
            <p className="text-base  font-medium leading-6 text-ic-ink-6s">{customer('walletNoData')}</p>
          </NoDataTable>
        )}
      />
      {isDetailWallet && (
        <TransactionHistoryDetail
          visible={isDetailWallet}
          onClose={onCloseDetailWallet}
          dataDetail={dataDetailWallet}
        />
      )}
    </div>
  );
};
export default LoyaltyWalletTable;
