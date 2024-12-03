import { DATE_TIME_FORMAT } from '@/constants/bid';
import { BidSourceEnum } from '@/types/bid/enum';
import { GetWonBidItemsResponse } from '@/types/bid/interface';
import { getBidItemLink, getBidMapStatus, getSttBtnColor } from '@/utils/bid';
import { formatDate, formatNumber } from '@/utils/common';
import { DataGrid, GridColumn, Tooltip } from '@ichiba/ichiba-core-ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../../common';

interface Props {
  dataSource?: GetWonBidItemsResponse[];
  isLoading: boolean;
  previousTotal: number;
  refetch?: () => void;
}

export const WonBidManageGrid = ({ dataSource, previousTotal }: Props) => {
  const { t: bid } = useTranslation('bid');

  const columns = useMemo(() => {
    const grid: GridColumn<GetWonBidItemsResponse>[] = [
      {
        headerName: bid('bidId'),
        width: 40,
        cellRenderer: ({ node }) => {
          return <p>{node.childIndex + 1 + previousTotal}</p>;
        },
      },
      {
        headerName: bid('orderCode'),
        width: 120,
        cellRenderer: ({ data }) => {
          return data.orderCode ? (
            <p className=""> {data?.orderCode}</p>
          ) : (
            <StatusButton colorType="red">Updating</StatusButton>
          );
        },
      },
      {
        headerName: bid('image'),
        width: 70,
        cellRenderer: ({ data }) => {
          return (
            <>{!!data.previewImage && <img src={data.previewImage} width={36} height={36} className="h-9 w-9" />}</>
          );
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
                id: data.productId || '',
                source: data.source as BidSourceEnum,
              })}
              target="_blank"
            >
              <p className="p-2 text-primary-6 font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                {data.productId}
              </p>
            </a>
          );
        },
      },
      {
        headerName: bid('productName'),
        cellClass: 'break-words whitespace-normal',
        field: 'title',
        flex: 1,
      },
      {
        headerName: bid('nick'),
        width: 200,
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
        headerName: bid('currentPrice'),
        width: 120,
        cellRenderer: ({ data }) => {
          return <>{!!data.price && <p>{`${formatNumber(data.price)} ¥`}</p>}</>;
        },
      },
      {
        headerName: bid('tax'),
        width: 120,
        cellRenderer: ({ data }) => {
          return <p className="">{data?.taxRate !== null && data?.taxRate !== 0 ? `${data?.taxRate} %` : ''}</p>;
        },
      },
      {
        headerName: bid('mapStatus'),
        width: 140,
        cellRenderer: ({ data }) => {
          const value = getBidMapStatus(data.mapStatus);
          const colorType = getSttBtnColor({
            value,
            list: {
              mapped: 'green',
              unmap: 'orange',
              unableToMap: 'red',
            },
          });
          return <StatusButton colorType={colorType}>{bid(value)}</StatusButton>;
        },
      },
      {
        headerName: bid('orderDate'),
        width: 100,
        cellRenderer: ({ data }) => {
          const formattedDate = formatDate({
            time: data.bidTime,
            dateFormat: DATE_TIME_FORMAT.dateFormatDefault2,
            defaultValue: '',
          }).split(' ');
          return (
            <>
              <p>{formattedDate[0]}</p>
              <p>{formattedDate[1]}</p>
            </>
          );
        },
      },
    ];
    return grid;
  }, [bid]);
  return <DataGrid columnDefs={columns} rowKey={'id'} rowData={dataSource} rowHeight={60} />;
};
