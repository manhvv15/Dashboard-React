import { useMemo, useState } from 'react';

import { Button, Close, Dialog, DialogBody, DialogHeader, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import saveAs from 'file-saver';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { WORKSPACEBYLV1, dateFormat } from '@/constants/variables/common';
import { useApp } from '@/hooks/use-app';
import { exportTransactionAll, getTransactionCustomer, getTransactionHistory } from '@/services/loyalty';
import { DateRangeState, IKeyValue } from '@/types';
import { ExportTransactionsRequest } from '@/types/loyalty';
import { formatDate, formatNumber, listTypeTransactionLoyalty, parseDateLocalToUTC } from '@/utils/common';

import CustomerInformation from './components/detail/customer-inf';
import FilterTransacionHistory from './components/detail/grid/filters/filter-transacion-history';
import TableTransactionHistoryDetail from './components/detail/grid/table-transaction-history-detail';
import { DataHistoryDetailTransacion } from './components/grid/table-transaction';

interface Props {
  visible: boolean;
  onClose: () => void;
  dataDetail?: DataHistoryDetailTransacion;
}

export default function TransactionHistoryDetail({ visible, onClose, dataDetail }: Props) {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const { showToast } = useApp();

  const [filterKeyword, setFilterSearch] = useState<string>('');
  const [getIdTransactionSelected, setIdTransactionSelected] = useState<string[]>([]);
  const [isLoadingExport, setLoadingExport] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string[]>();
  const [filterTypes, setFilterTypes] = useState<number[]>();
  const [filterCreatedAtTime, setFilterCreatedAtTime] = useState<DateRangeState>();

  const filterValueDebounce = useDebounce(filterKeyword, 500);
  const searchStatusDebounce = useDebounce(filterStatus);
  const searchTypesDebounce = useDebounce(filterTypes);

  const parseFilterCreatedAtTime = useMemo(() => {
    return {
      createFrom: filterCreatedAtTime?.startDate
        ? parseDateLocalToUTC(filterCreatedAtTime.startDate.toISOString())
        : undefined,
      createTo: filterCreatedAtTime?.endDate
        ? parseDateLocalToUTC(
            DateTime.fromISO(filterCreatedAtTime?.endDate.toISOString())
              .plus({ days: 1 })
              .minus({ seconds: 1 })
              .toString(),
          )
        : undefined,
    };
  }, [filterCreatedAtTime]);

  const searchDateCreatedDebounce = useDebounce(parseFilterCreatedAtTime);

  const statusOptions = [
    { value: '0', label: common('onHold') },
    { value: '1', label: common('completed') },
    { value: '2', label: common('canceled') },
  ] as IKeyValue[];

  const transactionDetailPayload = useMemo(
    () => ({
      keyword: filterValueDebounce,
      walletId: dataDetail?.walletId || '',
      status: searchStatusDebounce,
      types: searchTypesDebounce,
      ...(searchDateCreatedDebounce?.createFrom && { createdAtFrom: searchDateCreatedDebounce?.createFrom }),
      ...(searchDateCreatedDebounce?.createTo && { createdAtTo: searchDateCreatedDebounce?.createTo }),
    }),
    [searchStatusDebounce, searchTypesDebounce, filterValueDebounce, searchDateCreatedDebounce, visible],
  );
  const { data: transactionList, isLoading } = useQuery({
    queryKey: [transactionDetailPayload],
    queryFn: () => getTransactionHistory(transactionDetailPayload),
    retry: (failureCount, res: any) => failureCount < 0 && res.status !== 400,
    keepPreviousData: true,
    onSuccess: () => {},
  });
  const { data: walletInfo } = useQuery({
    queryKey: ['GetWalletInfo', visible],
    queryFn: () =>
      getTransactionCustomer({
        workspaceId: WORKSPACEBYLV1,
        walletId: dataDetail?.walletId || '',
        currency: dataDetail?.currency || '',
      }),
    retry: (failureCount, res: any) => failureCount < 0 && res.status !== 400,
    enabled: visible,
    onSuccess: () => {},
  });

  const exportTransactions = useMutation({
    mutationFn: exportTransactionAll,
  });

  const onClickExportExcel = () => {
    setLoadingExport(true);
    const data = {
      workspaceId: dataDetail?.workspaceId,
      keyword: filterValueDebounce,
      walletId: dataDetail?.walletId,
      pointTransactionIds:
        (getIdTransactionSelected || []).length > 0
          ? getIdTransactionSelected
          : transactionList?.data.items.map((e) => e.id),
      status: searchStatusDebounce,
      types: searchTypesDebounce,
      ...(searchDateCreatedDebounce?.createFrom && { createdAtFrom: searchDateCreatedDebounce?.createFrom }),
      ...(searchDateCreatedDebounce?.createTo && { createdAtTo: searchDateCreatedDebounce?.createTo }),
      slug: dataDetail?.slug,
    } as ExportTransactionsRequest;
    exportTransactions.mutate(data, {
      onSuccess: (response: AxiosResponse) => {
        setLoadingExport(false);
        const file = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(file, `TRANSACTION_COIN_${(walletInfo?.data?.fullName || '').toUpperCase()}_${DateTime.local()}.xlsx`);
        showToast({
          type: 'success',
          summary: common('export.success'),
        });
      },
      onError: () => {
        setLoadingExport(false);
        showToast({
          type: 'error',
          summary: error('export.error'),
        });
      },
    });
  };
  return (
    <Dialog handler={onClose} open={visible} size="xl">
      <DialogHeader>
        <div onClick={() => onClose()} className="cursor-pointer h-full flex-1 flex justify-end">
          <Close />
        </div>
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col w-full gap-3 pb-2">
          {(walletInfo?.data?.slug || walletInfo?.data?.workspaceName) && (
            <div className="flex flex-col text-lg font-medium leading-6">
              {walletInfo?.data?.workspaceName && (
                <p className="text-2xl font-medium leading-8 text-ic-ink-6s">{walletInfo?.data?.workspaceName}</p>
              )}
              <div className="flex">
                <span className="text-ic-primary-5s font-medium leading-5 text-sm">{walletInfo?.data.slug}</span>
                <span className=" pl-1 text-sm text-ic-ink-5s font-medium">
                  {walletInfo?.data?.createAt &&
                    ` - ${formatDate({
                      time: walletInfo?.data?.createAt.toString(),
                      dateFormat: dateFormat.MM_DD_YYYY,
                    })} - ${dataDetail?.currency}`}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-row flex-1 gap-8 h-[80px]">
            <div className="block border-r mt-3 pr-20 grow">
              <div className="flex pt-2">
                <SvgIcon icon="total-deposit" width={16} height={16} className="text-ic-green-5s" />
                <span className="ml-2 text-sm text-ic-ink-5s">
                  {customer('customer.transacion.detail.history.totalDeposit')}
                </span>
              </div>
              <div className="pt-4 font-bold text-xl leading-7">{formatNumber(walletInfo?.data?.totalEarned!)}</div>
            </div>
            <div className="block border-r mt-3 pr-20 grow">
              <div className="flex pt-2 pr-10">
                <SvgIcon icon="total-spent" width={18} height={18} className="text-ic-green-5s" />
                <span className="ml-2 text-sm text-ic-ink-5s">
                  {customer('customer.transacion.detail.history.spend')}
                </span>
              </div>
              <div className="pt-4 font-bold text-xl leading-7">{formatNumber(walletInfo?.data?.totalSpent!)}</div>
            </div>
            <div className="block mt-3 pr-20 grow">
              <div className="flex pt-2 ">
                <SvgIcon icon="total-spent" width={18} height={18} className="text-ic-green-5s" />
                <span className="ml-2 text-sm text-ic-ink-5s">
                  {customer('customer.transacion.detail.history.balance')}
                </span>
              </div>
              <div className="pt-4 font-bold text-xl leading-7">{formatNumber(walletInfo?.data?.balance!)}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 flex-col pb-2.5">
          <div className="flex justify-between pt-4 items-center">
            <div className="text-lg text-ic-ink-6s font-medium ">
              {customer('customer.transacion.detail.history.transactionHistory')}
            </div>
            <div>
              <Button
                variant="text"
                className="bg-ic-primary-1s"
                color="primary"
                disabled={exportTransactions.isLoading}
                loading={exportTransactions.isLoading}
                onClick={onClickExportExcel}
              >
                <div className="flex gap-1 items-center">
                  <SvgIcon icon="export-excel" width={20} height={20} />
                  <span className="">{customer('customer.transacion.detail.history.exportExcel')}</span>
                </div>
              </Button>
            </div>
          </div>
          <CustomerInformation transactionList={transactionList} />
          <FilterTransacionHistory
            typeOptions={listTypeTransactionLoyalty}
            statusOptions={statusOptions}
            filterKeyword={filterKeyword}
            setFilterSearch={setFilterSearch}
            setFilterStatus={setFilterStatus}
            setFilterCreatedAtTime={setFilterCreatedAtTime}
            setFilterTypes={setFilterTypes}
          />
        </div>
        <LoadingOverlay className="flex flex-1 h-full w-full" isLoading={isLoadingExport || isLoading}>
          <div className="flex flex-1 flex-col overflow-hidden" style={{ height: 500 }}>
            <TableTransactionHistoryDetail
              data={transactionList?.data.items || []}
              setIdTransactionSelected={setIdTransactionSelected}
            />
          </div>
        </LoadingOverlay>
      </DialogBody>
    </Dialog>
  );
}
