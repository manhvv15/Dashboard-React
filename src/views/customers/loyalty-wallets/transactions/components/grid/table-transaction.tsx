import { useMemo, useState } from 'react';

import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { TransactionItem } from '@/types/loyalty';
import NoDataTable from '@/views/customers/invoices/components/grid/nodata-table';

import ReferenceCode from './grid-columns/reference-code';
import TransactionStatus from './grid-columns/status';
import TotalAmount from './grid-columns/total-amount';
import Type from './grid-columns/type';
import WorkspaceInformation from './grid-columns/workspace-information';

import TransactionHistoryDetail from '../../detail';

export enum TransactionTabEnum {
  AllPoints = 0,
  EarnPoints = 1,
  SpentPoints = 2,
}
interface props {
  data?: TransactionItem[];
  reset: () => void;
}
export interface DataHistoryDetailTransacion {
  walletId: string;
  slug: string;
  currency: string;
  workspaceId: string;
}
const TableTransaction = ({ data, reset }: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const [dataDetail, setDataDetail] = useState<DataHistoryDetailTransacion>();
  const [isOenDetailWallet, setIsOpenDetailWallet] = useState<boolean>(false);

  const onCloseModalDetailWallet = () => {
    setIsOpenDetailWallet(false);
    reset();
  };
  const dataGridColumnTransactions: GridColumn<TransactionItem>[] = useMemo(
    () => [
      {
        headerName: customer('customer.loyalty.transacion.table.header.workspaceInf'),
        width: 320,
        cellClass: 'cursor-pointer',
        align: 'left',
        cellRenderer: (params) => {
          return <WorkspaceInformation data={params.data} />;
        },
      },
      {
        headerName: customer('customer.loyalty.transacion.table.header.referenceCode'),
        align: 'left',
        cellClass: 'cursor-pointer',
        width: 320,
        cellRenderer: (params) => {
          return <ReferenceCode data={params.data} />;
        },
      },
      {
        headerName: customer('customer.loyalty.transacion.table.header.method'),
        align: 'left',
        cellClass: 'cursor-pointer',
        width: 150,
        cellRenderer: (params) => {
          return <Type data={params.data} />;
        },
      },
      {
        headerName: customer('customer.wallet.history.header.status'),
        align: 'center',
        width: 200,
        cellRenderer: (params) => {
          return <TransactionStatus data={params.data} />;
        },
      },
      {
        headerName: customer('customer.loyalty.transacion.table.header.amount'),
        flex: 1,
        width: 325,
        cellClass: 'cursor-pointer',
        align: 'right',
        cellRenderer: (params) => {
          return <TotalAmount data={params.data} />;
        },
      },
    ],
    [customer],
  );
  const onOpenModalDetailWallet = (data: TransactionItem) => {
    setDataDetail({
      slug: data.workspaceInformation?.slug ?? '',
      walletId: data.walletId,
      currency: data.currency ?? '',
      workspaceId: data.workspaceId ?? '',
    });
    setIsOpenDetailWallet(true);
  };
  return (
    <div className=" flex-1 overflow-hidden ">
      <DataGrid
        rowData={data || []}
        rowKey="id"
        headerHeight={48}
        rowHeight={68}
        onRowClicked={({ data }) => {
          onOpenModalDetailWallet(data);
        }}
        columnDefs={dataGridColumnTransactions}
        noRowsOverlayComponent={() => (
          <NoDataTable>
            <p className="text-base font-medium leading-6 text-ic-ink-6s">{customer('transactionNoData')}</p>
          </NoDataTable>
        )}
      ></DataGrid>
      {isOenDetailWallet && (
        <TransactionHistoryDetail
          visible={isOenDetailWallet}
          onClose={onCloseModalDetailWallet}
          dataDetail={dataDetail || ({} as DataHistoryDetailTransacion)}
        />
      )}
    </div>
  );
};
export default TableTransaction;
