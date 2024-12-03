import { DATE_TIME_FORMAT } from '@/constants/bid';
import { BidSourceEnum } from '@/types/bid/enum';
import { GetBiddingItemsResponse } from '@/types/bid/interface';
import { getBidItemLink, getBidStatus, getSttBtnColor } from '@/utils/bid';
import { formatDate, formatNumber } from '@/utils/common';
import { DataGrid, GridColumn, Tooltip } from '@ichiba/ichiba-core-ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../../common';

interface Props {
  dataSource?: GetBiddingItemsResponse[];
  isLoading: boolean;
  previousTotal: number;
}

export const BiddingManageGrid = ({ dataSource, isLoading, previousTotal }: Props) => {
  const { t: bid } = useTranslation('bid');

  const columns: GridColumn<GetBiddingItemsResponse>[] = useMemo(() => {
    const grid: GridColumn<GetBiddingItemsResponse>[] = [
      {
        headerName: bid('bidId'),
        width: 40,
        cellRenderer: ({ node }) => {
          return <p>{node.childIndex + 1 + previousTotal}</p>;
        },
      },
      {
        headerName: bid('productId'),
        width: 140,
        align: 'left',
        cellRenderer: ({ data }) => {
          return (
            <a
              className="flex text-ic-primary-6s"
              href={getBidItemLink({
                id: data.id,
                source: data.source as BidSourceEnum,
              })}
              target="_blank"
            >
              {data.id}
            </a>
          );
        },
      },
      {
        headerName: bid('image'),
        width: 70,
        align: 'left',
        cellRenderer: ({ data }) => {
          return <img src={data.image} alt={data.image} width={36} height={36} className="h-9 w-9" />;
        },
      },
      {
        headerName: bid('productName'),
        field: 'name',
        flex: 1,
        cellClass: 'break-words whitespace-normal',
      },
      {
        headerName: bid('nick'),
        width: 125,
        align: 'left',
        cellRenderer: ({ data }) => {
          return (
            <Tooltip content={data.bidUserName}>
              <p
                className="
                  text-ellipsis overflow-hidden whitespace-nowrap"
              >
                {data.bidUserName}
              </p>
            </Tooltip>
          );
        },
      },
      {
        headerName: bid('placedBid'),
        width: 140,
        align: 'left',
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
        align: 'left',
        cellRenderer: ({ data }) => {
          return <>{`${formatNumber(data.currentPrice ?? 0)} ¥`}</>;
        },
      },
      {
        headerName: bid('status'),
        width: 120,
        align: 'left',
        cellRenderer: ({ data }) => {
          const value = getBidStatus(data.status as number);
          const colorType = getSttBtnColor({
            value,
            list: {
              highest: 'green',
              outBid: 'red',
            },
          });
          return <StatusButton colorType={colorType}>{bid(value)}</StatusButton>;
        },
      },
      {
        headerName: bid('endTime'),
        width: 100,
        align: 'left',
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
        width: 200,
        align: 'left',
        cellRenderer: ({ data }) => (
          <div className="w-[185px]">
            <p className="text-ellipsis overflow-hidden whitespace-nowrap">{data?.customerCode}</p>
            <p className="text-ellipsis overflow-hidden whitespace-nowrap">{data.customerName}</p>
          </div>
        ),
      },
    ];
    return grid;
  }, [bid]);
  return (
    <DataGrid
      columnDefs={columns}
      rowData={dataSource}
      isLoading={isLoading}
      rowKey={'id'}
      pagination={false}
      rowHeight={60}
      className="relative table-grid-no-border h-full"
    />
  );
};
