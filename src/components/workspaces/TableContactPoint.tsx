import { useMemo } from 'react';

import { DataGrid, GridColumn, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { getContactPointsByWorkspace } from '@/services/user-management/workspace';
import { ContactPointEnum, GetContactPointByWorkspaceResponse } from '@/types/user-management/workspace';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

interface IProp {
  workspaceId: string;
}

const TableContactPoint = ({ workspaceId }: IProp) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const { data: contactPoints, isLoading } = useQuery({
    queryKey: ['getContactPointsPaging', workspaceId],
    queryFn: () =>
      getContactPointsByWorkspace({
        pageNumber: PAGE_NUMBER_DEFAULT,
        pageSize: PAGE_SIZE_DEFAULT,
        workspaceId: workspaceId,
      }),
    retry: true,
  });

  const getContactPointName = (input: ContactPointEnum) => {
    switch (input) {
      case ContactPointEnum.Technical:
        return common('technical');
      case ContactPointEnum.Accounting:
        return common('accounting');
      case ContactPointEnum.Delivery:
        return common('delivery');
      case ContactPointEnum.Administrator:
        return common('administration');
      case ContactPointEnum.CLevel:
        return common('cLevel');
      case ContactPointEnum.HeadLevel:
        return common('headLevel');
      case ContactPointEnum.Others:
        return common('others');
    }
  };

  const initColumns: GridColumn<GetContactPointByWorkspaceResponse>[] = useMemo(
    () => [
      {
        headerName: common('Contact point'),
        cellClass: 'flex',
        width: 300,
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal h-full flex flex-row w-full cursor-pointer items-center">
              {data.firstName} - {data.lastName}
            </div>
          );
        },
      },
      {
        headerName: common('Contact type'),
        cellClass: 'flex',
        width: 260,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal h-full flex flex-col justify-center w-full">
              {getContactPointName(data.contactPoint)}
            </div>
          );
        },
      },
      {
        headerName: common('email'),
        cellClass: 'flex',
        width: 260,
        cellRenderer: ({ data }) => {
          return <div className="text-sm font-normal h-full flex flex-col justify-center w-full">{data.email}</div>;
        },
      },
      {
        headerName: common('phoneNumber'),
        cellClass: 'flex',
        width: 260,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal h-full flex flex-col justify-center w-full">
              {data.prefixPhoneNumber}
              {data.phoneNumber}
            </div>
          );
        },
      },
    ],
    [common],
  );

  return (
    <LoadingOverlay className="h-full w-full" isLoading={isLoading}>
      <div className="w-full flex flex-col bg-ic-white-6s py-4 rounded-md">
        <DataGrid
          domLayout="autoHeight"
          rowHeight={58}
          rowKey={'id'}
          columnDefs={initColumns}
          rowData={contactPoints?.data.items}
          isLoading={isLoading}
        />
      </div>
    </LoadingOverlay>
  );
};

export default TableContactPoint;
