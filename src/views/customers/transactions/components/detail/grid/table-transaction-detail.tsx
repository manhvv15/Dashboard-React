import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { TransactionInvoices } from '@/types/payment/transaction';
import NoDataTable from '@/views/customers/invoices/components/grid/nodata-table';

import PaymentAmount from './columns/payment-amount';
import TransactionInvoiceCode from './columns/transaction-invoice-code';

interface props {
  data: TransactionInvoices[];
  currency: string;
}
const TableTransactionDetail = ({ data, currency }: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const columnTransactionInvoiceDefs: GridColumn<TransactionInvoices>[] = [
    {
      headerName: customer('customer.transaction.detail.table.invoiceCode'),
      width: 600,
      cellRenderer: (params) => {
        return <TransactionInvoiceCode data={params.data} />;
      },
    },
    {
      headerName: customer('customer.transaction.detail.table.paymentAmount'),
      width: 600,
      cellRenderer: (params) => {
        return <PaymentAmount data={params.data} currency={currency} />;
      },
    },
  ];
  return (
    <DataGrid
      rowHeight={40}
      noRowsOverlayComponent={() => (
        <NoDataTable>
          <p className="text-base font-medium leading-6 text-ic-ink-6s">{customer('transactionInvoiceNoData')}</p>
        </NoDataTable>
      )}
      headerHeight={40}
      rowData={data}
      rowKey="id"
      columnDefs={columnTransactionInvoiceDefs}
    />
  );
};
export default TableTransactionDetail;
