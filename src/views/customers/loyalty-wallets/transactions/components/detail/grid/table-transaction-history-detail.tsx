import { Dispatch, SetStateAction, useMemo } from 'react';

import { DataGrid, GridColumn, Tooltip, selectionColumnDef } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { DateTimeFormatCustom } from '@/pages/cutomers/loyalty-wallets/commons';
import { TransactionHistoryItem } from '@/types/loyalty';
import { formatCurrencyCustom } from '@/utils/common';
import NoDataTable from '@/views/customers/invoices/components/grid/nodata-table';

import HistoryCode from './columns/history-code';
import HistoryReferenceCode from './columns/history-reference-code';
import HistoryStatus from './columns/history-status';
import HistoryType from './columns/history-type';

interface props {
  data: TransactionHistoryItem[];
  setIdTransactionSelected: Dispatch<SetStateAction<string[]>>;
}

const TableTransactionHistoryDetail = ({ data, setIdTransactionSelected }: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);

  const onSelectionChanged = (e: any) => {
    const selectedTransactions = e.api.getSelectedRows() as TransactionHistoryItem[];
    const transactionIds = selectedTransactions.map((transaction) => transaction.id);
    setIdTransactionSelected(transactionIds);
  };
  const dataGridTransaction: GridColumn<TransactionHistoryItem>[] = useMemo(
    () => [
      selectionColumnDef,
      {
        headerName: customer('customer.wallet.history.header.createdAt'),
        align: 'left',
        width: 200,
        cellRenderer: ({ data }) => {
          return <span>{DateTimeFormatCustom(data?.createdAt)}</span>;
        },
      },
      {
        align: 'left',
        width: 150,
        headerName: customer('customer.wallet.history.header.code'),
        cellRenderer: ({ data }) => {
          return <span> {<HistoryCode data={data} />}</span>;
        },
      },
      {
        headerName: customer('customer.wallet.history.header.type'),
        align: 'left',
        width: 140,
        cellRenderer: ({ data }) => {
          return <span> {<HistoryType data={data} />}</span>;
        },
      },
      {
        headerName: customer('customer.wallet.history.header.status'),
        align: 'center',
        width: 140,
        cellRenderer: ({ data }) => {
          return <span> {<HistoryStatus data={data} />}</span>;
        },
      },
      {
        align: 'left',
        width: 200,
        headerName: customer('customer.wallet.history.header.referenceCode'),
        cellRenderer: ({ data }) => {
          return <span> {<HistoryReferenceCode data={data} />}</span>;
        },
      },

      {
        width: 300,
        align: 'left',
        headerName: customer('customer.wallet.history.header.description'),
        cellRenderer: ({ data }) => {
          return (
            <div>
              {data.note && (
                <div className="flex flex-1 w-[200px]">
                  <Tooltip content={data.note}>
                    <div
                      title={data.note}
                      className="overflow-hidden max-w-[280px] text-sm font-normal leading-5 text-ic-ink-6s truncate"
                    >
                      {data.note}
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          );
        },
      },
      {
        width: 225,
        align: 'right',
        headerName: customer('customer.wallet.history.header.amount'),
        cellRenderer: ({ data }) => {
          return <span>{formatCurrencyCustom(data?.amount)}</span>;
        },
      },
    ],
    [customer],
  );
  return (
    <DataGrid
      rowData={data ?? []}
      rowHeight={56}
      className="table-grid-no-border relative flex-1 h-full mt-3"
      columnDefs={dataGridTransaction}
      onSelectionChanged={onSelectionChanged}
      rowKey="id"
      noRowsOverlayComponent={() => (
        <NoDataTable>
          <p className="text-base font-medium leading-6 text-ic-ink-6s">{customer('transactionNoData')}</p>
        </NoDataTable>
      )}
    ></DataGrid>
  );
};
export default TableTransactionHistoryDetail;
