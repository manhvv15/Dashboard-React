import { useMemo, useState } from 'react';

import { LoadingOverlay, Pagination, SizePagePagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';

import { useCurrencies } from '@/hooks/commons';
import { getTransactionPaging } from '@/services/loyalty';
import { Currency, DateFromTo } from '@/types';
import { FilterCodeTransactionEnum, TransactionTypeLoyaltyEnum } from '@/types/enums/transaction';
import { TransactionItem } from '@/types/loyalty';
import { listTypeTransactionLoyalty, parseDateLocalToUTC } from '@/utils/common';

import FilterDataTransaction from './components/grid/filters/filter-data-transaction';
import TableTransaction from './components/grid/table-transaction';

export interface MoreFilterTransaction {
  amountFrom?: string;
  amountTo?: string;
}

const LoyaltyTransactions = () => {
  const [searchParams] = useSearchParams();
  const searchUrl = searchParams.get('search');

  const [search, setSearch] = useState<string>(searchUrl ?? '');
  const [filterTransactionType, setFilterTransactionType] = useState<TransactionTypeLoyaltyEnum[]>(
    listTypeTransactionLoyalty.map((e) => Number(e.value)),
  );
  const [listTransaction, setListTransaction] = useState<TransactionItem[]>();
  const [activePage, setActivePage] = useState<number>(1);
  const [pageSize, setChangePageSize] = useState<SizePagePagination>(20);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paymentTime, setPaymentTime] = useState<DateFromTo>();
  const [moreFilter, setMoreFilter] = useState<MoreFilterTransaction>();
  const [codeFilter, setCodeFilter] = useState<FilterCodeTransactionEnum>(FilterCodeTransactionEnum.All);
  const [filterCurrencies, setFilterCurrencies] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([] as Currency[]);
  const [searchTabTransaction, setSearchTabTransaction] = useState<string | number>();

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
  const activePageDebounce = useDebounce(activePage);
  const pageSizeDebounce = useDebounce(pageSize);
  const searchDebounce = useDebounce(search);
  const paymentTimeDebounce = useDebounce(parsePaymentTime);
  const moreFilterDebounce = useDebounce(moreFilter);
  const codeFilterDebounce = useDebounce(codeFilter);
  const searchTabDebounce = useDebounce(searchTabTransaction);
  const searchCurrencyDebounce = useDebounce(filterCurrencies);
  const searchTransactionTypeDebounce = useDebounce(filterTransactionType);

  useCurrencies((data: AxiosResponse<Currency[]>) => {
    setCurrencies(data.data);
  });
  const transactionPayload = useMemo(
    () => ({
      pageNumber: activePageDebounce,
      pageSize: pageSizeDebounce,
      keyword: searchUrl ?? searchDebounce,
      tabIndex: searchTabDebounce,
      types: searchTransactionTypeDebounce,
      currencies: searchCurrencyDebounce,
      ...(paymentTimeDebounce.createFrom && { paymentAtFrom: paymentTimeDebounce.createFrom }),
      ...(paymentTimeDebounce.createTo && { paymentAtTo: paymentTimeDebounce.createTo }),
      ...(moreFilterDebounce?.amountFrom && {
        amountFrom: Number(moreFilterDebounce.amountFrom.replaceAll(',', '')),
      }),
      ...(moreFilterDebounce?.amountTo && {
        amountTo: Number(moreFilterDebounce.amountTo.replaceAll(',', '')),
      }),
    }),
    [
      activePageDebounce,
      pageSizeDebounce,
      searchDebounce,
      paymentTimeDebounce,
      moreFilterDebounce,
      codeFilterDebounce,
      searchTabDebounce,
      searchCurrencyDebounce,
      searchTransactionTypeDebounce,
    ],
  );
  const getListTransaction = useQuery({
    queryKey: [transactionPayload],
    queryFn: () => getTransactionPaging(transactionPayload),
    onSuccess: (res) => {
      setListTransaction(res.data.items);
      setTotalPage(res.data.totalPages);
      setTotalRecords(res.data.totalRecords);
    },
  });

  const onHandleReset = () => {
    getListTransaction.refetch();
  };
  return (
    <div className="w-full h-full flex justify-center">
      <LoadingOverlay className="flex h-full justify-center w-full rounded-lg" isLoading={getListTransaction.isLoading}>
        <div className="bg-ic-white-6s w-full rounded-lg flex h-full flex-col  px-6 pt-6 flex-1">
          <div className="flex">
            <FilterDataTransaction
              search={search}
              setFilterTransactionType={setFilterTransactionType}
              filterTransactionType={filterTransactionType}
              setPaymentTime={setPaymentTime}
              setSearch={setSearch}
              setMoreFilter={setMoreFilter}
              codeFilter={codeFilter}
              setCodeFilter={setCodeFilter}
              currencies={currencies}
              filterCurrencies={filterCurrencies}
              setFilterCurrencies={setFilterCurrencies}
              setSearchTabTransaction={setSearchTabTransaction}
              searchTabTransaction={searchTabTransaction}
            />
          </div>

          <div className="flex-1 w-full flex flex-col overflow-hidden pt-2">
            <TableTransaction data={listTransaction} reset={onHandleReset} />
          </div>
          <div className="flex">
            <Pagination
              currentPage={activePage}
              setChangePage={setActivePage}
              setChangePageSize={setChangePageSize}
              pageSize={pageSize}
              totalPage={totalPage}
              totalRecords={totalRecords ?? 0}
            />
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
};
export default LoyaltyTransactions;
