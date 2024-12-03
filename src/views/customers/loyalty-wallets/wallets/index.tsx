import { useMemo, useState } from 'react';

import { LoadingOverlay, Pagination, SizePagePagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';

import { useCurrencies } from '@/hooks/commons';
import { getWalletPaging } from '@/services/loyalty';
import { Currency, DateFromTo } from '@/types';
import { WalletItem } from '@/types/loyalty';
import { parseDateLocalToUTC } from '@/utils/common';

import FilterDataWallet from './components/grid/filters/filter-data-wallet';
import LoyaltyWalletTable from './components/grid/loyalty-wallet-table';

const LoyatyWallets = () => {
  const [filterCreatedAtTime, setFilterCreatedAtTime] = useState<DateFromTo>();
  const [filterPeriodTime, setFilterPeriodTime] = useState<DateFromTo>();

  const [searchParams] = useSearchParams();

  const searchUrl = searchParams.get('search');
  const [activePage, setActivePage] = useState<number>(1);
  const [search, setSearch] = useState<string>(searchUrl ?? '');

  const [pageSize, setChangePageSize] = useState<SizePagePagination>(20);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [listWallet, setListWallet] = useState<WalletItem[]>();
  const [filterCurrencies, setFilterCurrencies] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([] as Currency[]);

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
  const parseFilterPeriod = useMemo(() => {
    return {
      createFrom: filterPeriodTime?.startDate
        ? parseDateLocalToUTC(filterPeriodTime.startDate.toISOString())
        : undefined,
      createTo: filterPeriodTime?.endDate
        ? parseDateLocalToUTC(
            DateTime.fromISO(filterPeriodTime?.endDate.toISOString())
              .plus({ days: 1 })
              .minus({ seconds: 1 })
              .toString(),
          )
        : undefined,
    };
  }, [filterPeriodTime]);
  const pageNumberDebounce = useDebounce(activePage);
  const searchCreatedAtTimeDebounce = useDebounce(parseFilterCreatedAtTime);
  const searchFilterPeriodDebounce = useDebounce(parseFilterPeriod);
  const searchDebounce = useDebounce(search);
  const pageSizeDebounce = useDebounce(pageSize);
  const searchCurrencyDebounce = useDebounce(filterCurrencies);

  useCurrencies((data: AxiosResponse<Currency[]>) => {
    setCurrencies(data.data);
  });
  const { isLoading, refetch } = useQuery({
    queryKey: [
      getWalletPaging.name,
      pageSizeDebounce,
      searchDebounce,
      searchCreatedAtTimeDebounce,
      searchCurrencyDebounce,
      pageNumberDebounce,
      searchFilterPeriodDebounce,
    ],
    queryFn: () =>
      getWalletPaging({
        pageSize: pageSizeDebounce,
        pageNumber: pageNumberDebounce,
        currencies: searchCurrencyDebounce,
        keyword: searchDebounce,
        ...(searchCreatedAtTimeDebounce.createFrom && { createAtFrom: searchCreatedAtTimeDebounce.createFrom }),
        ...(searchCreatedAtTimeDebounce.createTo && { createAtTo: searchCreatedAtTimeDebounce.createTo }),
        ...(searchFilterPeriodDebounce.createFrom && { periodFrom: searchFilterPeriodDebounce.createFrom }),
        ...(searchFilterPeriodDebounce.createTo && { periodTo: searchFilterPeriodDebounce.createTo }),
      }),
    onSuccess: (res) => {
      setListWallet(res.data.items);
      setTotalPage(res.data.totalPages);
      setTotalRecords(res.data.totalRecords);
    },
  });
  const onHanleReset = () => {
    refetch();
  };
  return (
    <div className="flex w-full h-full justify-center">
      <LoadingOverlay className="flex h-full justify-center w-full rounded-lg" isLoading={isLoading}>
        <div className="bg-ic-white-6s w-full flex-1 rounded-lg flex h-full flex-col px-6 pt-6">
          <div className="flex">
            <FilterDataWallet
              search={search}
              setFilterCreatedAtTime={setFilterCreatedAtTime}
              setSearch={setSearch}
              currencies={currencies}
              filterCurrencies={filterCurrencies}
              setFilterPeriodTime={setFilterPeriodTime}
              setFilterCurrencies={setFilterCurrencies}
            />
          </div>
          <div className="flex h-full overflow-hidden flex-col flex-1 pt-4 ">
            <LoyaltyWalletTable data={listWallet || []} reset={onHanleReset} />
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
export default LoyatyWallets;
