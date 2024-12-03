import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { formatNumber } from '@/utils/common';

import ServiceName from './grid/columns/service-name';

import { ItemInvoice } from '@/types/payment/invoice';
import NoDataTable from '../grid/nodata-table';

interface props {
  data?: ItemInvoice[];
  currency: string;
}
const TableServices = ({ data, currency }: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const columnDefs: GridColumn<ItemInvoice>[] = [
    {
      headerName: customer('customer.invoice.detail.table.header.serviceName'),
      width: 400,
      cellRenderer: (params) => {
        return <ServiceName data={params.data} />;
      },
    },
    {
      headerName: customer('customer.invoice.detail.table.header.quantity'),
      width: 310,
      cellRenderer: (params) => {
        return <p>{params.data.amount}</p>;
      },
    },
    {
      headerName: customer('customer.invoice.detail.table.header.price'),
      width: 310,
      cellRenderer: (params) => {
        return <p>{`${formatNumber(params.data?.amount ?? 0)} ${currency}`}</p>;
      },
    },
    {
      headerName: customer('customer.invoice.detail.table.header.subtotal'),
      width: 306,
      cellRenderer: (params) => {
        return <p>{`${formatNumber(params.data?.amount ?? 0)} ${currency}`}</p>;
      },
    },
  ];
  return (
    <div className="flex-1 overflow-hidden max-h-72 border border-ic-ink-2s rounded-lg">
      <DataGrid
        noRowsOverlayComponent={() => (
          <NoDataTable>
            <p className="text-base font-medium leading-6 text-ic-ink-6s">
              {customer('customer.detail.invoice.services.noData')}
            </p>
          </NoDataTable>
        )}
        rowData={data || []}
        rowKey="id"
        headerHeight={48}
        rowHeight={52}
        columnDefs={columnDefs}
      ></DataGrid>
    </div>
  );
};

export default TableServices;
