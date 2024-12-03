import { useMemo } from 'react';

import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { InvoiceManagement } from '@/types/payment/invoice';

import InvoiceCode from './grid/grid-columns/invoice-code';
import PaymentStatus from './grid/grid-columns/payment-status';
import TotalAmount from './grid/grid-columns/total-amount';
import WorkspaceInformation from './grid/grid-columns/workspace-information';
import NoDataTable from './grid/nodata-table';

interface props {
  data?: InvoiceManagement[];
}
const TableInvoice = ({ data }: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const dataGridColumnInvoices: GridColumn<InvoiceManagement>[] = useMemo(
    () => [
      {
        headerName: customer('customer.invoice.table.header.invoiceCode'),
        width: 400,
        cellRenderer: (params) => {
          return <InvoiceCode data={params.data} />;
        },
      },
      {
        headerName: customer('customer.invoice.table.header.wpInfomation'),
        width: 300,
        cellRenderer: (params) => {
          return <WorkspaceInformation data={params.data} />;
        },
      },
      {
        headerName: customer('customer.invoice.table.header.paymentStatus'),
        width: 450,
        align: 'center',
        cellRenderer: (params) => {
          return <PaymentStatus data={params.data} />;
        },
      },
      {
        headerName: customer('customer.invoice.table.header.totalAmount'),
        flex: 1,
        align: 'right',
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
        columnDefs={dataGridColumnInvoices}
        noRowsOverlayComponent={() => (
          <NoDataTable>
            <p className="text-base font-medium leading-6 text-ic-ink-6s">{customer('invoiceNoData')}</p>
          </NoDataTable>
        )}
      ></DataGrid>
    </div>
  );
};
export default TableInvoice;
