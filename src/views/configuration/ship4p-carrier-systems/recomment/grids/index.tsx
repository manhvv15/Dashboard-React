import { LocaleNamespace } from '@/constants/enums/common';
import { listShippingTypeSearch } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { GetEntriesRecommendedResponse } from '@/types/ship4p/recomented';
import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionRecomented } from './columns/action';
import { TagRecomented } from './columns/tag-recomment';
interface props {
  data?: GetEntriesRecommendedResponse[];
  confirm: () => void;
}
export const TableRecoment = ({ data, confirm }: props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const listShippingRateCarrier = listShippingTypeSearch(tShip4p);
  const columnLabelDefs: GridColumn<GetEntriesRecommendedResponse>[] = useMemo(
    () => [
      {
        headerName: '#',
        align: 'center',
        width: 40,
        cellRenderer: (data) => {
          return <span>{data.data.index}</span>;
        },
      },
      {
        headerName: tShip4p('recomented.table.header.country'),
        width: 200,
        align: 'left',
        cellRenderer: (data) => {
          return <span>{data.data.countryName}</span>;
        },
      },
      {
        headerName: tShip4p('recomented.table.header.shippingtype'),
        width: 200,
        align: 'left',
        cellRenderer: (data) => {
          return <span>{listShippingRateCarrier.find((e) => e.value === data.data.shippingType)?.label}</span>;
        },
      },
      {
        headerName: tShip4p('recomented.table.header.courierAccount'),
        width: 470,
        align: 'left',
        cellRenderer: (data) => {
          return (
            <div className="flex flex-row gap-2 items-center">
              <div>
                <img alt="" src={data.data.imageUrl ?? ''} height={36} width={36} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-ic-ink-6s">{data.data.accountId}</span>
                <span className="text-sm text-ic-ink-5s">{data.data.courierId}</span>
              </div>
            </div>
          );
        },
      },
      {
        headerName: tShip4p('recomented.table.header.tagRecoment'),
        width: 475,
        align: 'left',
        cellRenderer: (data) => {
          return <TagRecomented confirm={confirm} data={data.data} />;
        },
      },

      {
        headerName: tShip4p('recomented.table.header.action'),
        width: 250,
        align: 'left',
        cellRenderer: (data) => {
          return <ActionRecomented data={data.data} confirm={confirm} />;
        },
      },
    ],
    [common],
  );
  return (
    <div className=" flex-1 overflow-hidden [&_.ag-overlay]:pointer-events-auto">
      <DataGrid
        rowData={data || []}
        resetRowDataOnUpdate
        columnDefs={columnLabelDefs}
        rowKey="id"
        headerHeight={48}
        rowHeight={56}
      />
    </div>
  );
};
