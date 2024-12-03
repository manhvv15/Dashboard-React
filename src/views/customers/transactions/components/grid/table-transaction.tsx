import { useMemo } from 'react';

import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { TransactionManagement } from '@/types/payment/transaction';
import NoDataTable from '@/views/customers/invoices/components/grid/nodata-table';

import Method from './grid-columns/method';
import PaymentAccount from './grid-columns/payment-account';
import ReferenceCode from './grid-columns/reference-code';
import Status from './grid-columns/status';
import TotalAmount from './grid-columns/total-amount';
import TransactionCode from './grid-columns/transaction-code';
import Type from './grid-columns/type';
import WorkspaceInformation from './grid-columns/workspace-information';

interface props {
  data?: TransactionManagement[];
}
const TableTransaction = ({ data }: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const dataGridColumnTransactions: GridColumn<TransactionManagement>[] = useMemo(
    () => [
      {
        headerName: customer('customer.transaction.table.header.transactionCode'),
        width: 225,
        cellRenderer: (params) => {
          return <TransactionCode data={params.data} />;
        },
      },
      {
        headerName: customer('customer.transaction.table.header.wpInfomation'),
        width: 300,
        cellRenderer: (params) => {
          return <WorkspaceInformation data={params.data} />;
        },
      },
      {
        headerName: customer('customer.transaction.table.header.type'),
        width: 150,
        align: 'left',
        cellRenderer: (params) => {
          return <Type data={params.data} />;
        },
      },
      {
        headerName: customer('customer.transaction.table.header.status'),
        width: 150,
        align: 'center',
        cellRenderer: (params) => {
          return <Status data={params.data} />;
        },
      },
      {
        headerName: customer('customer.transaction.table.header.referenceCode'),
        width: 235,
        cellRenderer: (params) => {
          return <ReferenceCode data={params.data} />;
        },
      },
      {
        headerName: customer('customer.transaction.table.header.method'),
        width: 200,
        cellRenderer: (params) => {
          return <Method data={params.data} />;
        },
      },
      {
        headerName: customer('customer.transaction.table.header.paymentAccount'),
        width: 200,
        cellRenderer: (params) => {
          return <PaymentAccount data={params.data} />;
        },
      },

      {
        headerName: customer('customer.transaction.table.header.amount'),
        width: 265,
        align: 'right',
        flex: 1,
        cellRenderer: (params) => {
          return <TotalAmount data={params.data} />;
        },
      },
    ],
    [customer],
  );
  return (
    <div className=" flex-1 overflow-hidden ">
      <DataGrid
        rowData={data || []}
        rowKey="id"
        headerHeight={48}
        rowHeight={68}
        columnDefs={dataGridColumnTransactions}
        noRowsOverlayComponent={() => (
          <NoDataTable>
            <p className="text-base font-medium leading-6 text-ic-ink-6s">{customer('transactionNoData')}</p>
          </NoDataTable>
        )}
      ></DataGrid>
    </div>
  );
};
export default TableTransaction;
