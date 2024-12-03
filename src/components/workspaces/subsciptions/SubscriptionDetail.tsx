import { useMemo, useState } from 'react';

import { Button, DataGrid, GridColumn, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { getSubscriptionDetail } from '@/services/user-management/workspace';
import {
  CurrentUsageDataByPlanItem,
  GetCurrentUsageDataBySubscriptionResponse,
} from '@/types/user-management/workspace';
import { formatDate, formatNumber } from '@/utils/common';
import SvgIcon from '../../commons/SvgIcon';
import ModalCancelSubscription from '../dialog/ModalCancelSubscription';
import ModalServiceModelDetail from '../dialog/ModalServiceModelDetail';
import Progress from './Progress';

interface IProp {
  workspaceId: string;
  subscriptionId: string;
  applicationId: string;
}
const SubscriptionDetail = ({ workspaceId, subscriptionId }: IProp) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [isCancel, setIsCancelSubscription] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [currentFee, setCurrentFee] = useState<CurrentUsageDataByPlanItem>();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<GetCurrentUsageDataBySubscriptionResponse>();
  const [fixedFee, setFixedFee] = useState<CurrentUsageDataByPlanItem>();
  const { isLoading } = useQuery({
    queryKey: ['getSubscriptionDetail', subscriptionId, workspaceId],
    queryFn: () =>
      getSubscriptionDetail({
        subscriptionId: subscriptionId,
        workspaceId: workspaceId,
      }),
    onSuccess: (res) => {
      const fixed = res.data.items.filter((x) => x.isFixed)[0];
      setFixedFee(fixed);
      setSubscription(res.data);
    },
    retry: true,
    enabled: !!subscriptionId,
  });

  const onHandleBack = () => {
    navigate(`/workspaces/${workspaceId}/detail`);
  };

  const onHandleCancel = () => {
    setIsCancelSubscription(true);
  };

  const onHandleDetailFee = (data: CurrentUsageDataByPlanItem) => {
    if (data.amount == 0 || !data.amount) return;
    setIsDetail(true);
    setCurrentFee(data);
  };

  const initColumns: GridColumn<CurrentUsageDataByPlanItem>[] = useMemo(
    () => [
      {
        headerName: common('#'),
        cellClass: 'flex justify-center',
        headerClass: 'text-center',
        width: 50,
        cellRenderer: ({ node }) => {
          return (
            <div className="text-sm  font-normal leading-5  text-ic-ink-6s h-full flex flex-col justify-center text-center">
              {node.childIndex + 1}
            </div>
          );
        },
      },
      {
        headerName: common('service'),
        cellClass: 'flex',
        width: 260,
        flex: 1,
        cellRenderer: ({ data }) => {
          return (
            <div
              className="text-sm font-normal h-full flex leading-5 text-ic-primary-6s flex-col justify-center w-full cursor-pointer"
              aria-hidden="true"
              onClick={() => onHandleDetailFee(data)}
            >
              {data.name}
            </div>
          );
        },
      },
      {
        headerName: common('startOfPeriod'),
        cellClass: 'flex',
        width: 200,
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('startOfPeriod')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal h-full flex flex-col justify-center w-full text-center">
              {data.startDate && formatDate({ time: data.startDate, dateFormat: 'MM/dd/yyyy' })}
            </div>
          );
        },
      },
      {
        headerName: common('endOfPeriod'),
        cellClass: 'flex',
        width: 200,
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('endOfPeriod')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal h-full flex flex-col justify-center w-full text-center">
              {data.endDate && formatDate({ time: data.endDate, dateFormat: 'MM/dd/yyyy' })}
            </div>
          );
        },
      },
      {
        headerName: common('usage'),
        width: 200,
        cellClass: 'flex',
        headerComponent: () => {
          return <div className="flex justify-center items-center w-full text-center">{common('usage')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex justify-center text-center w-full">
              {data.usageDataItems &&
                data.usageDataItems.map((el) => {
                  return (
                    <>
                      <div className="flex text-sm ">
                        <div className="mr-1">{formatNumber(el.value ?? 0)}</div>
                        <div>{el.subUnit}</div>
                      </div>
                    </>
                  );
                })}
            </div>
          );
        },
      },
      {
        headerName: common('fee'),
        width: 200,
        cellClass: 'flex',
        headerComponent: () => {
          return <div className="flex justify-end items-end w-full text-end">{common('fee')}</div>;
        },
        cellRenderer: ({ data }) => {
          return (
            <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex flex-col justify-center items-end w-full">
              {formatNumber(data.amount ?? 0)} {data.currencyCode}
            </div>
          );
        },
      },
    ],
    [common],
  );
  return (
    <LoadingOverlay className="h-full w-full" isLoading={isLoading}>
      <div className="w-full flex flex-col bg-ic-white-6s rounded-md p-4">
        {subscription && (
          <>
            <div className="flex border-b justify-between items-center pb-4">
              <div className="flex items-center">
                <SvgIcon
                  icon="arrow-left"
                  width={24}
                  height={24}
                  onClick={onHandleBack}
                  className="cursor-pointer mr-2"
                />
                <div className="text-sm text-ic-ink-6s font-normal mr-2">{common('overview')}</div>
              </div>
            </div>

            <div className="p-4">
              <div className="w-full flex justify-between items-center">
                {subscription.applications.map((app) => {
                  return (
                    <>
                      <div className="flex items-center">
                        <img className="w-6 h-6 object-contain" src={app.applicationLogoUrl} alt="" />
                        <div className="text-base font-bold ml-2">{app.applicationName}</div>
                      </div>
                    </>
                  );
                })}
              </div>
              <div className="border-b pb-4">
                <div className="flex text-sm mt-4">
                  <div className="mr-12">
                    <div className="font-medium">{common('basePrice')}</div>
                    <div className="mt-2">
                      {formatNumber(subscription?.subscriptionFixedFee ?? 0)} {subscription?.subscriptionCurrencyCode}
                    </div>
                  </div>
                </div>
                <div className="flex text-sm mt-3">
                  <div className="mr-12">
                    <div className="font-medium">
                      {subscription?.subscriptionPeriodType} {common('billing')}
                    </div>
                    <div className="mt-2">
                      {subscription?.subscriptionRenewDate && (
                        <>
                          {common('renewAt')}{' '}
                          {formatDate({ time: subscription?.subscriptionRenewDate, dateFormat: 'MM/dd/yyyy' })}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b py-4">
                <div className="flex text-sm font-normal mb-2">
                  <div className="flex-1">
                    {fixedFee?.startDate && fixedFee?.endDate && (
                      <>
                        <div className="flex">
                          <div>{subscription.subscriptionPeriodType} cycle</div>
                          <div className="ml-1">
                            ({formatDate({ time: fixedFee?.startDate, dateFormat: 'MM/dd/yyyy' })} -
                            {formatDate({ time: fixedFee?.endDate, dateFormat: 'MM/dd/yyyy' })})
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="lowercase">
                    {fixedFee?.usageDataItems && (
                      <>
                        <div>
                          {fixedFee?.usageDataItems[0].value}/{fixedFee?.usageDataItems[0].limit}{' '}
                          {fixedFee?.usageDataItems[0].subUnit}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Progress
                  total={fixedFee?.usageDataItems ? fixedFee?.usageDataItems[0].limit : 0}
                  value={fixedFee?.usageDataItems ? fixedFee?.usageDataItems[0].value : 0}
                ></Progress>
                <div className="flex text-sm font-normal mb-2 justify-between mt-2">
                  <div>
                    {formatNumber(fixedFee?.amount ?? 0)} {fixedFee?.currencyCode}
                  </div>
                  <div>
                    {formatNumber(subscription?.subscriptionFixedFee ?? 0)} {subscription?.subscriptionCurrencyCode}
                  </div>
                </div>
              </div>
              <div className="">
                <div className="my-4">
                  <div className="text-sm font-medium mb-2">{common('payAsYouGoFeeDetail')}:</div>
                  <DataGrid
                    domLayout="autoHeight"
                    rowHeight={58}
                    rowKey={'id'}
                    columnDefs={initColumns}
                    rowData={subscription.items.filter((x) => !x.isFixed)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                {subscription.autoRenew && (
                  <Button onClick={onHandleCancel} color="danger" className="mr-2">
                    <p className="ml-2">{common('cancelPlan')}</p>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <ModalCancelSubscription
        subscriptionId={subscriptionId}
        workspaceId={workspaceId}
        open={isCancel}
        setOpen={setIsCancelSubscription}
        expirationDate={
          subscription?.subscriptionExpiredDate
            ? formatDate({ time: subscription?.subscriptionExpiredDate, dateFormat: 'MM/dd/yyyy' })
            : ''
        }
      ></ModalCancelSubscription>
      {currentFee && (
        <ModalServiceModelDetail open={isDetail} setOpen={setIsDetail} data={currentFee}></ModalServiceModelDetail>
      )}
    </LoadingOverlay>
  );
};

export default SubscriptionDetail;
