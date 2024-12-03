import { DATE_TIME_FORMAT } from '@/constants/bid';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import {
  confirmAccountBlocked,
  executeBidAccount,
  getSuccessfulBidNow,
  registerGetSuccessfulBidReminder,
  removeBidAccount,
  updateBidAccount,
} from '@/services/bid';
import { BidNickStatusEnum } from '@/types/bid/enum';
import { GetBidNickResponse, RemoveBidAccountRequest } from '@/types/bid/interface';
import { getBidNickRanking, getBidNickStatus, getSttBtnColor } from '@/utils/bid';
import { formatDate } from '@/utils/common';
import { Button, DataGrid, GridColumn, Switch, Tooltip } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../common';
import ActionColRender from './ActionColRender';
import { ConfirmBlockedDialog } from './ConfirmBlockedDialog';
import { ConfirmGetSuccessfulBidDialog } from './ConfirmGetSucessfulBidDialog';
import type { EditNickRequestType } from './UpdateSessionModal';
import { UpdateSessionModal } from './UpdateSessionModal';

interface Props {
  dataSource?: GetBidNickResponse[];
  isLoading: boolean;
  handleRefetch: () => void;
}

export const BidNickManageGrid = ({ dataSource, handleRefetch }: Props) => {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const { showToast } = useApp();
  const { t: error } = useTranslation('error');

  // const [activeRowKey, setActiveRowKey] = useState<number>();
  const [configureModal, setConfigureModal] = useState<GetBidNickResponse>();
  const [configureAutoGetSuccessModal, setConfigureAutoGetSuccessModal] = useState<GetBidNickResponse>();
  const [configureConfirmDialog, setConfigureConfirmDialog] = useState<GetBidNickResponse>();

  const [configureConfirmSuccessfulBidDialog, setConfigureConfirmSuccessfulBidDialog] = useState<boolean>(false);

  const mutateBidAccount = useMutation({
    mutationFn: updateBidAccount,
  });

  const handleUpdate = (params: GetBidNickResponse) => {
    setConfigureModal(params);
  };

  // const handleConfirmDialog = (params: GetBidNickResponse) => {
  //   setConfigureConfirmDialog(params);
  // };

  const mutateRemoveBidAccount = useMutation({
    mutationFn: removeBidAccount,
  });

  const mutateExecuteBidAccount = useMutation({
    mutationFn: executeBidAccount,
  });

  const mutateConfirmAccountBlocked = useMutation({
    mutationFn: confirmAccountBlocked,
  });

  const handleRemove = (data: GetBidNickResponse) => {
    const payload: RemoveBidAccountRequest = {
      id: data.id,
    };
    mutateRemoveBidAccount.mutate(
      { data: payload },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: bid('removeAccountSuccessfully'),
          });
          handleRefetch();
        },
        onError: (err: any) => {
          const { errorNormal } = err;

          if (errorNormal) {
            showToast({
              type: 'error',
              summary: error(errorNormal),
            });
          }
        },
      },
    );
  };

  const getSuccessfulBidNowAsync = useMutation({
    mutationFn: getSuccessfulBidNow,
  });
  const handleGetSuccessfulBidNow = (params: GetBidNickResponse) => {
    getSuccessfulBidNowAsync.mutate(
      {
        data: {
          userName: params.username,
          isStart: !params.isAutoGetSuccessfulBid,
        },
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: bid('success'),
          });
          handleRefetch();
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: 'error',
          });
        },
      },
    );
  };

  const handleSaveConfigure = (params: EditNickRequestType) => {
    mutateBidAccount.mutate(
      {
        data: {
          id: params.id,
          cookie: params.cookie,
          proxyHost: params.proxyHost,
          proxyPort: params.proxyPort,
          proxyUsername: params.proxyUsername,
          proxyPassword: params.proxyPassword,
          buyer: params.customer?.value,
          password: params.password,
          note: params.note,
          isTax: params.isTax,
          isNoTax: params.isNoTax,
          isAllowBid: params.isAllowBid,
          proxyWorkspaceId: params.proxyWorkspaceId ?? '',
        },
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: bid('success'),
          });
          setConfigureModal(undefined);
          handleRefetch();
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: 'error',
          });
        },
      },
    );
  };

  const handleExecuteBidAccount = (params: GetBidNickResponse) => {
    mutateExecuteBidAccount.mutate(
      {
        data: {
          username: params.username,
          isStart: params.status !== BidNickStatusEnum.Ready,
        },
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: bid('success'),
          });
          setConfigureModal(undefined);
          handleRefetch();
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: 'error',
          });
        },
      },
    );
  };
  const mutateRegisterGetSuccessfulBidReminder = useMutation({
    mutationFn: registerGetSuccessfulBidReminder,
  });

  const handleConfirmAutoGetSuccessfulBid = (params: GetBidNickResponse) => {
    mutateRegisterGetSuccessfulBidReminder.mutate(
      {
        data: {
          userName: params.username,
          isAutoGetSuccessfulBid: params.isAutoGetSuccessfulBid,
          period: params.period,
        },
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: bid('success'),
          });
          setConfigureModal(undefined);
          handleRefetch();
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: 'error',
          });
        },
      },
    );
    setConfigureConfirmSuccessfulBidDialog(false);
  };

  const onSwitch = (data: GetBidNickResponse) => {
    setConfigureAutoGetSuccessModal(data);
    if (data.isAutoGetSuccessfulBid) {
      setConfigureConfirmSuccessfulBidDialog(true);
    } else {
      data.period = 60;
      data.isAutoGetSuccessfulBid = true;
      handleConfirmAutoGetSuccessfulBid(data);
    }
  };

  const handleConfirmAccountBlocked = (params: GetBidNickResponse) => {
    mutateConfirmAccountBlocked.mutate(
      {
        data: {
          userName: params.username,
        },
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: bid('success'),
          });
          setConfigureConfirmDialog(undefined);
          handleRefetch();
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: 'error',
          });
        },
      },
    );
  };

  // const handleContextMenu = (e: any) => {
  //   const rowItem = e.row;
  //   if (e.target === 'header' || !rowItem) {
  //     return;
  //   }
  //   if (!e.items) {
  //     e.items = [];
  //   }
  //   setActiveRowKey(rowItem.rowIndex);
  //   const conTextList = [
  //     {
  //       icon: 'custom-icon icon-bid',
  //       text: bid('contextMenu.stopBidding'),
  //       onItemClick: () => handleExecuteBidAccount(rowItem.data),
  //       isShow: rowItem.data.status === BidNickStatusEnum.Ready,
  //     },
  //     {
  //       icon: 'custom-icon icon-bid',
  //       text: bid('contextMenu.startBidding'),
  //       onItemClick: () => handleExecuteBidAccount(rowItem.data),
  //       isShow:
  //         rowItem.data.status !== BidNickStatusEnum.Ready && rowItem.data.status !== BidNickStatusEnum.BlockedByAuction,
  //     },
  //     {
  //       icon: 'download',
  //       text: bid('contextMenu.autoGetSuccessfulBid'),
  //       onItemClick: () => handleGetSuccessfulBidNow(rowItem.data),
  //       isShow: !rowItem.data.isAutoGetSuccessfulBid,
  //     },
  //     {
  //       icon: 'remove',
  //       text: bid('contextMenu.cancelGetSuccessfulBid'),
  //       onItemClick: () => handleGetSuccessfulBidNow(rowItem.data),
  //       isShow: rowItem.data.isAutoGetSuccessfulBid,
  //     },
  //     {
  //       icon: 'check',
  //       text: bid('contextMenu.confirmAccountBlocked'),
  //       onItemClick: () => handleConfirmDialog(rowItem.data),
  //       isShow: rowItem.data.status !== BidNickStatusEnum.BlockedByAuction,
  //     },
  //   ].filter((item) => item.isShow);
  //   e.items.push(...conTextList);
  // };
  const columns: GridColumn<GetBidNickResponse>[] = useMemo(() => {
    const grid: GridColumn<GetBidNickResponse>[] = [
      {
        headerName: bid('nickBid'),
        width: 200,
        align: 'left',
        cellRenderer: ({ data }) => {
          const isShowTooltip = data.accountRate ?? 0 < 80;
          const value = getBidNickRanking(data.accountRate ?? 0);
          const colorType = getSttBtnColor({
            value,
            list: {
              credibility: 'green',
              noCredibility: 'red',
            },
          });
          return isShowTooltip ? (
            <Tooltip content={bid('accountHasLowReputation')}>
              <div className="flex items-center justify-between">
                <p className="overflow-hidden text-ellipsis whitespace-nowrap" title={data.username}>
                  {data.username}
                </p>
                <StatusButton colorType={colorType}>{data.accountRate ? `${data.accountRate}%` : 'N/A'}</StatusButton>
              </div>
            </Tooltip>
          ) : (
            <div className="flex items-center justify-between">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap" title={data.username}>
                {data.username}
              </p>
              <StatusButton colorType={colorType}>{data.accountRate ? `${data.accountRate}%` : 'N/A'}</StatusButton>
            </div>
          );
        },
      },
      {
        headerName: bid('alias'),
        width: 200,
        align: 'left',
        cellRenderer: ({ data }) => {
          return (
            <p className="overflow-hidden text-ellipsis whitespace-nowrap" title={data.alias}>
              {data.alias}
            </p>
          );
        },
      },
      {
        headerName: bid('status'),
        width: 120,
        cellClass: 'break-words whitespace-normal',
        cellRenderer: ({ data }) => {
          const value = getBidNickStatus(data.status);
          const content = `bidAccount.${value}`;
          const colorType = getSttBtnColor({
            value,
            list: {
              init: 'blue',
              ready: 'green',
              failed: 'red',
              stop: 'orange',
              blockedByAuction: 'gray',
            },
          });
          return (
            <Tooltip content={bid(content)}>
              <div>
                <StatusButton colorType={colorType}>{bid(value)}</StatusButton>
              </div>
            </Tooltip>
          );
        },
      },
      {
        headerName: bid('roundRobin'),
        width: 120,
        align: 'left',
        cellRenderer: ({ data }) => {
          const value = data.isAllowBid as any;
          const colorType = getSttBtnColor({
            value,
            list: {
              true: 'red',
              false: 'green',
            },
          });
          return (
            <Tooltip content={data.isAllowBid ? bid('cannotAllowBid') : bid('allowBid')}>
              <div className="flex items-center justify-center">
                <StatusButton colorType={colorType}>{data.isAllowBid ? 'False' : 'True'}</StatusButton>
              </div>
            </Tooltip>
          );
        },
      },
      {
        headerName: bid('automaticallyAssignOrders'),
        minWidth: 300,
        align: 'left',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center" title={data.customerName}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">{data.customerCode}</p>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">{data.customerName}</p>
              {[data.customerCode, data.customerName].every((x) => !x) && <p>N/A</p>}
            </div>
          );
        },
      },
      {
        headerName: bid('autoGetSuccessfullBid'),
        width: 200,
        align: 'left',
        cellRenderer: ({ data }) => {
          return data.isAllowBid ? (
            <div className="flex items-center p-2">
              <Switch checked={data.isAutoGetSuccessfulBid === true} onChange={() => onSwitch(data)} />
              <span className="ml-4">{bid('getSuccessfulBid1h')}</span>
            </div>
          ) : (
            <b>Automatic</b>
          );
        },
      },
      {
        headerName: bid('note'),
        width: 140,
        align: 'left',
        cellRenderer: ({ data }) => {
          return (
            <div className="flex items-center" title={data.note}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">{data.note}</p>
            </div>
          );
        },
      },
      {
        headerName: bid('createdDate'),
        width: 120,
        align: 'left',
        cellRenderer: ({ data }) => {
          const formattedDate = formatDate({
            time: data.createdAt,
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
        headerName: bid('error'),
        width: 100,
        cellRenderer: ({ data }) => {
          const errorHtml = data.auctionResponse as any;
          const handleClick = () => {
            window?.open()?.document.write(errorHtml);
          };
          return (
            <>
              {errorHtml ? (
                <Button onClick={handleClick} color="danger">
                  {bid('view')}
                </Button>
              ) : (
                <div>-</div>
              )}
            </>
          );
        },
      },
      {
        headerName: bid('action'),
        width: 200,
        cellRenderer: ({ data }) => {
          return (
            <ActionColRender
              data={data}
              onRemove={() => handleRemove(data)}
              onEdit={() => handleUpdate(data)}
              onStopBidding={() => handleExecuteBidAccount(data)}
              onConfirmAccountBlocked={() => handleConfirmAccountBlocked(data)}
              onGetSuccessfullBidNow={() => handleGetSuccessfulBidNow(data)}
            />
          );
          // return (
          //   <div className="flex justify-between gap-2 h-full mr-[6px]">
          //     <div
          //       className="flex-1 py-2 font-medium text-center bg-white border rounded-lg cursor-pointer border-ic-ink-3s text-ic-ink-6s hover:bg-ic-ink-1s"
          //       onClick={() => handleUpdate(data)}
          //     >
          //       {bid('edit')}
          //     </div>

          //     <div className="flex justify-center flex-1 py-2 bg-white border rounded-lg cursor-pointer border-ic-ink-3s hover:bg-ic-ink-1s">
          //       <SvgIcon icon="trash-delete-bin-2" width={22} height={22} onClick={() => handleRemove(data)} />
          //     </div>
          //   </div>
          // );
        },
      },
    ];
    return grid;
  }, [bid]);
  return (
    <>
      <DataGrid rowData={dataSource} columnDefs={columns} rowKey={'id'} rowHeight={60} />
      <UpdateSessionModal
        visible={!!configureModal}
        dataSource={configureModal}
        onClose={() => setConfigureModal(undefined)}
        onSave={handleSaveConfigure}
        isLoading={mutateBidAccount.isLoading}
      />
      <ConfirmBlockedDialog
        visible={!!configureConfirmDialog}
        dataSource={configureConfirmDialog}
        onClose={() => setConfigureConfirmDialog(undefined)}
        onSave={handleConfirmAccountBlocked}
        isLoading={false}
      />
      <ConfirmGetSuccessfulBidDialog
        visible={configureConfirmSuccessfulBidDialog}
        dataSource={configureAutoGetSuccessModal!}
        onClose={() => setConfigureConfirmSuccessfulBidDialog(false)}
        onSave={handleConfirmAutoGetSuccessfulBid}
        isLoading={false}
      />
    </>
  );
};
