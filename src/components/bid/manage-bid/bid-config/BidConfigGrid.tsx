import { AuthorizationConfigurationEnum } from '@/types/bid/enum';
import { GetBidConfigResponse } from '@/types/bid/interface';
import { DataGrid, GridColumn } from '@ichiba/ichiba-core-ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  dataSource?: GetBidConfigResponse[];
  isLoading: boolean;
  previousTotal: number;
}

export const BidConfigGrid = ({ dataSource, isLoading, previousTotal }: Props) => {
  const { t: bid } = useTranslation('bid');

  const columns: GridColumn<GetBidConfigResponse>[] = useMemo(() => {
    const grid: GridColumn<GetBidConfigResponse>[] = [
      {
        headerName: '#',
        width: 200,
        cellRenderer: ({ node }) => {
          return <p>{node.childIndex + 1 + previousTotal}</p>;
        },
      },
      {
        headerName: bid('workspace'),
        field: 'workspaceName',
        flex: 1,
      },
      {
        headerName: 'Authorize bid type',
        field: 'authorizeBidType',
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <p>
              {data.authorizeBidType === AuthorizationConfigurationEnum.AuthorizationForIchiba
                ? bid('authorizationForIchiba')
                : bid('workspaceForSelfManagedBidAccounts')}
            </p>
          );
        },
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
