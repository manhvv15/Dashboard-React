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
import { getInvoiceManagements } from '@/services/payment/invoice';
import { Currency, DateFromTo } from '@/types';
import { InvoiceStatusEnum, PaymentStatusEnum } from '@/types/enums/payment';
import { InvoiceManagement, MoreFilterInvoice } from '@/types/payment/invoice';
import { parseDateLocalToUTC } from '@/utils/common';

import { PAGE_SIZE_100 } from '@/utils/constants';
import FilterDataInvoice from './components/grid/filters/filter-data-invoice';
import TableInvoice from './components/table-invoice';

const ManagermentInvoices = () => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);

  const [searchParams] = useSearchParams();

  const searchUrl = searchParams.get('search');

  const [currencies, setCurrencies] = useState<Currency[]>([] as Currency[]);
  const [search, setSearch] = useState<string>(searchUrl ?? '');
  const [filterCurrencies, setFilterCurrencies] = useState<string[]>([]);
  const [listInvoices, setListInvoices] = useState<InvoiceManagement[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [pageSize, setChangePageSize] = useState<SizePagePagination>(PAGE_SIZE_100);
  const [totalPage, setTotalPage] = useState(0);

  const [createdTime, setCreatedTime] = useState<DateFromTo>();
  const [postedTime, setPostedTime] = useState<DateFromTo>();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusEnum[]>([]);

  const [moreFilter, setMoreFilter] = useState<MoreFilterInvoice>();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusEnum[]>();
  const activePageDebounce = useDebounce(activePage);
  const pageSizeDebounce = useDebounce(pageSize);
  const searchDebounce = useDebounce(search);
  const createdTimeDebounce = useDebounce(createdTime);
  const postedTimeDebounce = useDebounce(postedTime);
  const paymentStatusDebounce = useDebounce(paymentStatus);
  const moreFilterDebounce = useDebounce(moreFilter);
  const statusFilterDebounce = useDebounce(statusFilter);
  const currenciesDebounce = useDebounce(filterCurrencies);

  useCurrencies((data: AxiosResponse<Currency[]>) => {
    setCurrencies(data.data);
  });
  const getInvoicesPayload = useMemo(
    () => ({
      pageNumber: activePageDebounce,
      pageSize: pageSizeDebounce,
      search: searchUrl ?? searchDebounce,
      createdFrom: createdTimeDebounce?.startDate
        ? parseDateLocalToUTC(createdTimeDebounce.startDate.toISOString())
        : undefined,
      createdTo: createdTimeDebounce?.endDate
        ? parseDateLocalToUTC(
            DateTime.fromISO(createdTimeDebounce?.endDate.toISOString())
              .plus({ days: 1 })
              .minus({ seconds: 1 })
              .toString(),
          )
        : undefined,
      postedDateFrom: postedTimeDebounce?.startDate
        ? parseDateLocalToUTC(postedTimeDebounce.startDate.toISOString())
        : undefined,
      postedDateTo: postedTimeDebounce?.endDate
        ? parseDateLocalToUTC(
            DateTime.fromISO(postedTimeDebounce?.endDate.toISOString())
              .plus({ days: 1 })
              .minus({ seconds: 1 })
              .toString(),
          )
        : undefined,
      paymentStatus: paymentStatusDebounce,
      status: statusFilterDebounce,
      currencies: currenciesDebounce,
      ...(moreFilterDebounce?.totalFrom && {
        fromTotalAmount: Number(moreFilterDebounce?.totalFrom.replaceAll(',', '')),
      }),
      ...(moreFilterDebounce?.totalTo && {
        toTotalAmount: Number(moreFilterDebounce?.totalTo.replaceAll(',', '')),
      }),
    }),
    [
      activePageDebounce,
      pageSizeDebounce,
      searchDebounce,
      JSON.stringify(createdTimeDebounce),
      JSON.stringify(postedTimeDebounce),
      JSON.stringify(paymentStatusDebounce),
      JSON.stringify(moreFilterDebounce),
      JSON.stringify(statusFilterDebounce),
      currenciesDebounce,
    ],
  );
  const getListInvoice = useQuery({
    queryKey: [getInvoiceManagements.name, getInvoicesPayload],
    queryFn: () => getInvoiceManagements(getInvoicesPayload),
    onSuccess: (res) => {
      setListInvoices(res.data.items);
      setTotalPage(res.data.totalPages);
    },
  });

  return (
    <LayoutSection label={customer('customer.invoice.title')}>
      <div className="w-full h-full flex justify-center">
        <LoadingOverlay className="flex  h-full justify-center w-full rounded-lg" isLoading={getListInvoice.isLoading}>
          <div className="bg-ic-white-6s w-full rounded-lg flex h-full flex-col  flex-1">
            <div className="flex">
              <FilterDataInvoice
                paymentStatus={paymentStatus}
                search={search}
                setCreatedTime={setCreatedTime}
                setPostedTime={setPostedTime}
                setPaymentStatus={setPaymentStatus}
                setSearch={setSearch}
                setMoreFilter={setMoreFilter}
                setFilterCurrencies={setFilterCurrencies}
                filterCurrencies={filterCurrencies}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                type="invoice"
                currencies={currencies}
              />
            </div>
            <div className="flex-1 w-full mt-2 px-2 flex flex-col overflow-hidden">
              <TableInvoice data={listInvoices} />
            </div>
            <div className="flex">
              <Pagination
                currentPage={activePage}
                setChangePage={setActivePage}
                setChangePageSize={setChangePageSize}
                pageSize={pageSize}
                totalPage={totalPage}
                totalRecords={getListInvoice.data?.data.totalRecords ?? 0}
              />
            </div>
          </div>
        </LoadingOverlay>
      </div>
    </LayoutSection>
  );
};
export default ManagermentInvoices;
