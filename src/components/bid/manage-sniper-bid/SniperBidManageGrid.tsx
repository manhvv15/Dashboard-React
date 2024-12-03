import { DATE_TIME_FORMAT } from '@/constants/bid';
import { GetSniperBidResponse } from '@/types/bid/interface';
import { getBidItemLink, getSniperBidStatus, getSttBtnColor } from '@/utils/bid';
import { formatDate, formatNumber } from '@/utils/common';
import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../common';

interface Props {
  dataSource?: GetSniperBidResponse[];
  isLoading: boolean;
  previousTotal: number;
}

export const SniperBidManageGrid = ({ dataSource, previousTotal }: Props) => {
  const { t: bid } = useTranslation('bid');

  const columns = useMemo(() => {
    const grid: GridColumn<GetSniperBidResponse>[] = [
      {
        headerName: bid('bidId'),
        width: 40,
        cellRenderer: ({ node }) => {
          return <p>{node.childIndex + 1 + previousTotal}</p>;
        },
      },
      {
        headerName: bid('image'),
        width: 70,
        cellRenderer: ({ data }) => {
          return <>{!!data.image && <img src={data.image} width={36} height={36} className="h-9 w-9" />}</>;
        },
      },
      {
        headerName: bid('productId'),
        width: 140,
        cellRenderer: ({ data }) => {
          return (
            <a
              className="flex"
              href={getBidItemLink({
                id: data.id || '',
                source: data.source as any,
              })}
              target="_blank"
            >
              <p className="p-2 text-primary-6 font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                {data.id}
              </p>
            </a>
          );
        },
      },
      {
        headerName: bid('productName'),
        cellClass: 'break-words whitespace-normal',
        field: 'name',
        flex: 1,
      },
      {
        headerName: bid('placedBid'),
        width: 140,
        cellRenderer: ({ data }) => {
          const formattedDate = formatDate({
            time: data.bidTime,
            dateFormat: DATE_TIME_FORMAT.dateFormatDefault2,
          }).split(' ');
          return (
            <>
              <p>{formatNumber(data.price)} ¥</p>
              <p>
                {formattedDate[0]} {formattedDate[1]}
              </p>
            </>
          );
        },
      },
      {
        headerName: bid('currentPrice'),
        width: 120,
        cellRenderer: ({ data }) => {
          return <>{!!data.price && <p>{`${formatNumber(data.currentPrice)} ¥`}</p>}</>;
        },
      },
      {
        headerName: bid('status'),
        width: 250,
        cellRenderer: ({ data }) => {
          const value = getSniperBidStatus(data.status);
          const colorType = getSttBtnColor({
            value,
            list: {
              pending: 'orange',
              success: 'green',
              fail: 'red',
              deleted: 'red',
              outBid: 'red',
            },
          });
          return <StatusButton colorType={colorType}>{bid(value)}</StatusButton>;
        },
      },
      {
        headerName: bid('endTime'),
        width: 100,
        cellRenderer: ({ data }) => {
          const formattedDate = formatDate({
            time: data.endTime,
            dateFormat: DATE_TIME_FORMAT.dateFormatDefault2,
          }).split(' ');
          return (
            <>
              <p>{formattedDate[0]}</p>
              <p>{formattedDate[1]}</p>
            </>
          );
        },
      },
      {
        headerName: bid('customer'),
        width: 300,
        cellRenderer: ({ data }) => {
          return (
            <div className="w-[185px]">
              <p className="text-ellipsis overflow-hidden whitespace-nowrap">{data?.customerCode}</p>
              <p className="text-ellipsis overflow-hidden whitespace-nowrap">{data.customerName}</p>
            </div>
          );
        },
      },
    ];
    return grid;
  }, [bid]);
  return <DataGrid columnDefs={columns} rowKey={'id'} rowData={dataSource} />;
};
