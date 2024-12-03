import { DATE_TIME_FORMAT } from '@/constants/bid';
import { BidSourceEnum } from '@/types/bid/enum';
import { GetBidHistoryResponse } from '@/types/bid/interface';
import { getBidHistoryStatus, getBidItemLink, getSttBtnColor } from '@/utils/bid';
import { formatDate, formatNumber } from '@/utils/common';
import { DataGrid, GridColumn, Tooltip } from '@ichiba/ichiba-core-ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../../common';

interface Props {
  dataSource?: GetBidHistoryResponse[];
  isLoading: boolean;
  previousTotal: number;
}

export const BidHistoryGrid = ({ dataSource, previousTotal }: Props) => {
  const { t: bid } = useTranslation('bid');

  const columns: GridColumn<GetBidHistoryResponse>[] = useMemo(() => {
    const grid: GridColumn<GetBidHistoryResponse>[] = [
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
              {data.productId}
            </a>
          );
        },
      },
      {
        headerName: bid('image'),
        width: 70,
        align: 'left',
        cellRenderer: ({ data }) => {
          return <img src={data.previewImage} alt={data.previewImage} width={36} height={36} className="h-9 w-9" />;
        },
      },
      {
        headerName: bid('productName'),
        field: 'productName',
        flex: 1,
        cellClass: 'break-words whitespace-normal',
      },
      {
        headerName: bid('nick'),
        width: 125,
        align: 'left',
        cellRenderer: ({ data }) => {
          return (
            <Tooltip content={data.bidUsername}>
              <p
                className="
                  text-ellipsis overflow-hidden whitespace-nowrap"
              >
                {data.bidUsername}
              </p>
            </Tooltip>
          );
        },
      },
      {
        headerName: bid('seller'),
        field: 'sellerId',
        width: 125,
      },
      {
        headerName: bid('placedBid'),
        width: 140,
        align: 'left',
        cellRenderer: ({ data }) => {
          return <p>{`${formatNumber(data.placedPrice)} ¥`}</p>;
        },
      },
      {
        headerName: bid('suggestPrice'),
        width: 120,
        align: 'left',
        cellRenderer: ({ data }) => {
          return <>{!!data.suggestedPrice && <p>{`${formatNumber(data.suggestedPrice)} ¥`}</p>}</>;
        },
      },
      {
        headerName: bid('status'),
        width: 120,
        align: 'left',
        cellRenderer: ({ data }) => {
          const value = getBidHistoryStatus(data.status as number);
          const colorType = getSttBtnColor({
            value,
            list: {
              success: 'green',
              fail: 'orange',
            },
          });
          return <StatusButton colorType={colorType}>{bid(value)}</StatusButton>;
        },
      },
      {
        headerName: bid('bidTime'),
        width: 100,
        align: 'left',
        cellRenderer: ({ data }) => {
          const formattedDate = formatDate({
            time: data.bidTime,
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
  return <DataGrid columnDefs={columns} rowKey={'id'} rowData={dataSource} gridId="bid-history_table" rowHeight={60} />;
};
