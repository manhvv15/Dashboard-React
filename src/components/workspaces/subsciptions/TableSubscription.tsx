import { useMemo } from 'react';

import {
  Button,
  DataGrid,
  GridColumn,
  LoadingOverlay,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';

import { userManagement } from '@/services/user-management/endpoints';
import { getApplicationsByWorkspace } from '@/services/user-management/workspace';
import { PaymentStatusEnum } from '@/types/enums/payment';
import { ApplicationByWorkspaceResponse, SubscriptionStatusEnum } from '@/types/user-management/workspace';
import { formatDate, formatNumber } from '@/utils/common';
import SvgIcon from '../../commons/SvgIcon';
interface IProp {
  workspaceId: string;
}
const TableSubscription = ({ workspaceId }: IProp) => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['getApplicationsByWorkspace', workspaceId],
    queryFn: () => getApplicationsByWorkspace(workspaceId),
    retry: true,
  });

  const navigate = useNavigate();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const onHandleManagmentUsers = (applicationId: string) => {
    navigate(`${userManagement}?applicationId=${applicationId}`);
  };
  const renderSubscriptionStatus = (app: ApplicationByWorkspaceResponse) => {
    if (app.subscriptionIsLatter)
      return (
        <div className="ml-2 rounded-3xl border border-ic-black-6s text-xs leading-5 font-normal text-ic-black-6s px-2 bg-ic-white-1s inline-block h-full w-16 text-center">
          {common('future')}
        </div>
      );

    if (app.subscriptionStatus == SubscriptionStatusEnum.Active)
      return (
        <div className="ml-2 rounded-3xl border border-ic-green-6s text-xs leading-5 font-normal text-ic-green-6s px-2 bg-ic-green-1s inline-block h-full w-16 text-center">
          {common('active')}
        </div>
      );

    if (app.subscriptionStatus === SubscriptionStatusEnum.Expired)
      return (
        <>
          <div className="ml-2 rounded-3xl border border-ic-orange-6s bg-red-1 text-xs leading-5 font-normal text-ic-orange-6s px-2 bg-ic-red-1s inline-block h-full w-16 text-center">
            {common('expired')}
          </div>
        </>
      );

    if (app.subscriptionStatus === SubscriptionStatusEnum.Canceled)
      return (
        <>
          <div className="ml-2 rounded-3xl border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal text-ic-red-6s px-2 bg-ic-red-1s inline-block h-full w-16 text-center">
            {common('cancel')}
          </div>
        </>
      );
    if (app.subscriptionStatus === SubscriptionStatusEnum.Trial)
      return (
        <>
          <div className="ml-2 rounded-3xl border border-ic-yellow-6s bg-red-1 text-xs leading-5 font-normal text-ic-yellow-6s px-2 bg-ic-yellow-1s inline-block h-full w-16 text-center">
            {common('trial')}
          </div>
        </>
      );
  };
  const onHandleDetailApp = (applicationId: string, subscriptionId: string) => {
    navigate(`?id=${applicationId}&subscriptionId=${subscriptionId}`);
  };
  const initColumns: GridColumn<ApplicationByWorkspaceResponse>[] = useMemo(
    () => [
      {
        headerName: common('application'),
        cellClass: 'flex',
        width: 300,
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal h-full flex flex-row w-full cursor-pointer items-center">
              <img
                src={data.applicationLogoUrl}
                alt={data.applicationName}
                width={32}
                height={32}
                className="mr-3 rounded-full"
              />
              <div
                className="text-sm font-medium leading-5 text-ic-primary-6s flex"
                aria-hidden="true"
                onClick={() => onHandleDetailApp(data.applicationId, data.subscriptionId)}
              >
                {data.applicationName}
                {renderSubscriptionStatus(data)}
                {data.paymentStatus == PaymentStatusEnum.Unpaid && (
                  <>
                    <div className="ml-2 rounded border border-ic-red-6s bg-red-1 text-xs leading-5 font-normal text-ic-red-6s px-2 bg-ic-red-1s inline-block w-16 text-center  justify-center h-fit">
                      {common('unpaid')}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        },
      },
      {
        headerName: common('plan'),
        cellClass: 'flex',
        width: 260,
        cellRenderer: ({ data }) => {
          return <div className="text-sm font-normal h-full flex flex-col justify-center w-full">{data.planName}</div>;
        },
      },
      {
        headerName: common('basePrice'),
        cellClass: 'flex',
        width: 180,
        headerComponent: () => {
          return <div className="flex justify-end items-center w-full text-end">{common('basePrice')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal h-full flex flex-col justify-end w-full text-end">
              {formatNumber(data.subscriptionFixedFee)} {data.subscriptionCurrencyCode}
            </div>
          );
        },
      },
      {
        headerName: common('billingCycle'),
        cellClass: 'flex',
        width: 140,
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('billingCycle')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal h-full flex flex-col justify-center w-full text-center">
              {data.subscriptionPeriodType}
            </div>
          );
        },
      },
      {
        headerName: common('startDate'),
        cellClass: 'flex',
        width: 130,
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('startDate')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal text-center h-full flex flex-col justify-center w-full">
              <p>
                {data.subscriptionStartDate &&
                  formatDate({ time: data.subscriptionStartDate, dateFormat: 'MM/dd/yyyy' })}
              </p>
            </div>
          );
        },
      },
      {
        headerName: common('expirationDate'),
        cellClass: 'flex',
        width: 130,
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('expirationDate')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal text-center h-full flex flex-col justify-center w-full">
              <p>
                {data.subscriptionExpiredDate &&
                  formatDate({ time: data.subscriptionExpiredDate, dateFormat: 'MM/dd/yyyy' })}
              </p>
            </div>
          );
        },
      },
      {
        headerName: common('user'),
        cellClass: 'flex text-center',
        width: 60,
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('user')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div
              className="text-sm font-normal text-ic-primary-6s h-full flex flex-col justify-center w-full cursor-pointer text-center"
              onClick={() => onHandleManagmentUsers(data.applicationId)}
              aria-hidden="true"
            >
              {data.applicationUserCount}
            </div>
          );
        },
      },
      {
        headerName: common('action'),
        width: 80,
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('action')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center w-full justify-center">
              <div className="mx-3">
                <Menu placement="bottom-start">
                  <MenuHandler>
                    <Button color="stroke" variant="outlined" className="px-2 h-9">
                      <SvgIcon icon="dots-menu" width={24} height={24} />
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => onHandleDetailApp(data.applicationId, data.subscriptionId)}>
                      <div className="flex items-center">{common('detail')}</div>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          );
        },
      },
    ],
    [common],
  );

  return (
    <LoadingOverlay className="h-full w-full">
      <div className="w-full flex flex-col bg-ic-white-6s p-4 rounded-md">
        <DataGrid
          domLayout="autoHeight"
          rowHeight={58}
          rowKey={'planId'}
          columnDefs={initColumns}
          rowData={applications?.data}
          isLoading={isLoading}
        />
      </div>
    </LoadingOverlay>
  );
};

export default TableSubscription;
