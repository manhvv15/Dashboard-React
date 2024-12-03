import { useMemo, useState } from 'react';

import { LoadingOverlay, Pagination, SizePagePagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';

import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { useCurrencies } from '@/hooks/commons';
import { getTransactions } from '@/services/payment/transaction';
import { Currency, DateFromTo } from '@/types';
import {
  FilterCodeTransactionEnum,
  MerchantAccountTypeEnum,
  PaymentTransactionStatusEnum,
  TransactionTypeEnum,
} from '@/types/enums/transaction';
import { TransactionManagement } from '@/types/payment/transaction';
import { parseDateLocalToUTC } from '@/utils/common';

import { PAGE_SIZE_100 } from '@/utils/constants';
import FilterDataTransaction from './components/grid/filters/filter-data-transaction';
import TableTransaction from './components/grid/table-transaction';

export interface MoreFilterTransaction {
  amountFrom?: string;
  amountTo?: string;
}
const ManagermentTransaction = () => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);

  const [searchParams] = useSearchParams();

  const searchUrl = searchParams.get('search');

  const [currencies, setCurrencies] = useState<Currency[]>([] as Currency[]);
  const [search, setSearch] = useState<string>(searchUrl ?? '');

  const [listTransaction, setListTransaction] = useState<TransactionManagement[]>();
  const [activePage, setActivePage] = useState<number>(1);
  const [pageSize, setChangePageSize] = useState<SizePagePagination>(PAGE_SIZE_100);
  const [totalPage, setTotalPage] = useState(0);

  const [paymentTime, setPaymentTime] = useState<DateFromTo>();

  const [paymentMethods, setPaymentMethods] = useState<MerchantAccountTypeEnum[]>([]);
  const [filterStatus, setFilterStatus] = useState<PaymentTransactionStatusEnum[]>([
    PaymentTransactionStatusEnum.Completed,
  ]);
  const [filterType, setFilterType] = useState<TransactionTypeEnum[]>([]);
  const [moreFilter, setMoreFilter] = useState<MoreFilterTransaction>();
  const [codeFilter, setCodeFilter] = useState<FilterCodeTransactionEnum>(FilterCodeTransactionEnum.All);
  const [filterCurrencies, setFilterCurrencies] = useState<string[]>([]);

  const parsePaymentTime = useMemo(() => {
    return {
      createFrom: paymentTime?.startDate ? parseDateLocalToUTC(paymentTime.startDate.toISOString()) : undefined,
      createTo: paymentTime?.endDate
        ? parseDateLocalToUTC(
            DateTime.fromISO(paymentTime?.endDate.toISOString()).plus({ days: 1 }).minus({ seconds: 1 }).toString(),
          )
        : undefined,
    };
  }, [paymentTime]);
  const currenciesDebounce = useDebounce(filterCurrencies);
  const activePageDebounce = useDebounce(activePage);
  const pageSizeDebounce = useDebounce(pageSize);
  const searchDebounce = useDebounce(search);
  const paymentTimeDebounce = useDebounce(parsePaymentTime);
  const paymentMethodDebounce = useDebounce(paymentMethods);
  const statusDebounce = useDebounce(filterStatus);
  const typeDebounce = useDebounce(filterType);
  const moreFilterDebounce = useDebounce(moreFilter);
  const codeFilterDebounce = useDebounce(codeFilter);

  const getTransactionPayload = useMemo(
    () => ({
      pageNumber: activePageDebounce,
      pageSize: pageSizeDebounce,
      textSearch: searchUrl ?? searchDebounce,
      currencies: currenciesDebounce,
      paymentMethods: paymentMethodDebounce,
      status: statusDebounce,
      types: typeDebounce,
      ...(paymentTimeDebounce.createFrom && { paymentStartDate: paymentTimeDebounce.createFrom }),
      ...(paymentTimeDebounce.createTo && { paymentEndDate: paymentTimeDebounce.createTo }),
      ...(moreFilterDebounce?.amountFrom && {
        fromAmount: Number(moreFilterDebounce.amountFrom.replaceAll(',', '')),
      }),
      ...(moreFilterDebounce?.amountTo && {
        toAmount: Number(moreFilterDebounce.amountTo.replaceAll(',', '')),
      }),
    }),
    [
      activePageDebounce,
      pageSizeDebounce,
      searchDebounce,
      paymentTimeDebounce,
      moreFilterDebounce,
      codeFilterDebounce,
      currenciesDebounce,
      paymentMethodDebounce,
      statusDebounce,
      typeDebounce,
    ],
  );
  const getListTransaction = useQuery({
    queryKey: [getTransactionPayload],
    keepPreviousData: true,
    queryFn: () => getTransactions(getTransactionPayload),
    onSuccess: (res) => {
      setListTransaction(res.data.items);
      setTotalPage(res.data.totalPages);
    },
  });

  useCurrencies((data: AxiosResponse<Currency[]>) => {
    setCurrencies(data.data);
  });
  return (
    <LayoutSection
      label={customer('customer.transaction.title')}
      children={
        <div className="w-full h-full flex justify-center">
          <LoadingOverlay
            className="flex  h-full justify-center w-full rounded-lg"
            isLoading={getListTransaction.isLoading}
          >
            <div className="bg-ic-white-6s w-full rounded-lg flex h-full flex-col  flex-1">
              <div className="flex">
                <FilterDataTransaction
                  search={search}
                  setPaymentTime={setPaymentTime}
                  setFilterStatus={setFilterStatus}
                  setSearch={setSearch}
                  setMoreFilter={setMoreFilter}
                  codeFilter={codeFilter}
                  setCodeFilter={setCodeFilter}
                  setFilterCurrencies={setFilterCurrencies}
                  filterCurrencies={filterCurrencies}
                  currencies={currencies}
                  setPaymentMethods={setPaymentMethods}
                  paymentMethods={paymentMethods}
                  filterStatus={filterStatus}
                  setFilterType={setFilterType}
                  filterType={filterType}
                />
              </div>
              <div className="flex-1 w-full mt-2 px-2 flex flex-col overflow-hidden">
                <TableTransaction data={listTransaction} />
              </div>
              <div className="flex">
                <Pagination
                  currentPage={activePage}
                  setChangePage={setActivePage}
                  setChangePageSize={setChangePageSize}
                  pageSize={pageSize}
                  totalPage={totalPage}
                  totalRecords={getListTransaction.data?.data.totalRecords ?? 0}
                />
              </div>
            </div>
          </LoadingOverlay>
        </div>
      }
    ></LayoutSection>
  );
};
export default ManagermentTransaction;
