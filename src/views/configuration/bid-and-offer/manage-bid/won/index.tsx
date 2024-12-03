import { BidFilter, BidFilterSection, BidFilterTag, NoProduct, WonBidManageGrid } from '@/components/bid';
import DateRangeFilter from '@/components/commons/date-range-filter';
import SvgIcon from '@/components/commons/SvgIcon';
import BidLayout from '@/components/layouts/bid-layout/BidLayout';
import { bidFilter, bidMapStatusValue } from '@/constants/bid';
import { LocaleNamespace } from '@/constants/enums/common';
import { useGetWonBidItems } from '@/hooks-query/bid';
import { BidMapStatusEnum } from '@/types/bid/enum';
import { getBidMapStatus } from '@/utils/bid';
import { convertUTCToLocalDate, onlySpaces } from '@/utils/common';
import NoDataTable from '@/views/customers/invoices/components/grid/nodata-table';
import { Button, Input, Pagination } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

const initPageIndex = 1;

function Index() {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const thirtyDayAgo = new Date();
  thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);

  const [searchValue, setSearchValue] = useState('');
  const [pageIndex, setPageIndex] = useState(initPageIndex);
  const [pageSize, setPageSize] = useState(20);

  const [nicks, setNicks] = useState<string[]>();
  const [mapStatus, setMapStatus] = useState<BidMapStatusEnum[]>();

  const searchDebounce = useDebounce(searchValue);
  const nicksDebounce = useDebounce(nicks);
  const mapStatusDebounce = useDebounce(mapStatus);
  const [orderDateRangePickerShow, setOrderDateRangePickerShow] = React.useState<PickerRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const queryDebounce = [
    searchDebounce,
    nicksDebounce,
    mapStatusDebounce,
    orderDateRangePickerShow.startDate,
    orderDateRangePickerShow.endDate,
  ];

  const {
    data: biddingData,
    isLoading,
    refetch,
  } = useGetWonBidItems({
    queryKey: [pageIndex, pageSize, queryDebounce],
    queryParams: {
      pageNumber: pageIndex,
      pageSize,
      keyword: searchDebounce,
      bidUserName: nicksDebounce,
      mapStatus: mapStatusDebounce,
    },
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setSearchValue('');
      return;
    }
    const val = event.target.value.trim();
    if (onlySpaces(val.charAt(0) || '')) {
      event.target.value = '';
      return;
    }
    setPageIndex(initPageIndex);
    setSearchValue(val);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setPageIndex(initPageIndex);
  };

  const handleClearAllFilter = () => {
    setNicks(undefined);
    setMapStatus(undefined);
    setOrderDateRangePickerShow({ startDate: undefined, endDate: undefined });
  };

  const handleSetPageNumber = (page: number) => {
    setPageIndex(page);
  };

  const handleChangePageSize = (value: number) => {
    if (value > 0) {
      setPageSize(Number(value));
      setPageIndex(1);
    }
  };

  const isFilter = queryDebounce.some((x) => !!x);
  const noProduct = !isFilter && biddingData?.data?.totalRecords === 0;
  const noResult = isFilter && biddingData?.data?.totalRecords === 0;

  function handleOnChangeOrderDate(val: PickerRange): void {
    const startDateShow = val?.startDate ? DateTime.fromISO(val?.startDate.toISOString()).toJSDate() : undefined;
    const endDateShow = val?.endDate ? DateTime.fromISO(val?.endDate.toISOString()).toJSDate() : undefined;
    setOrderDateRangePickerShow({ startDate: startDateShow, endDate: endDateShow });
  }

  return (
    <BidLayout left={<h2 className="text-lg font-medium">{bid('won')}</h2>}>
      <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg">
        <div className="p-3">
          <div className="flex gap-6">
            <div className="w-[600px]">
              <Input
                className="flex-1 w-[600px]"
                type="text"
                onChange={handleSearch}
                onReset={handleClearSearch}
                placeholder={bid('searchWithProductId')}
                icon={<SvgIcon icon="search" />}
              />
            </div>

            <BidFilterSection>
              {/* <BidNickFilter value={nicks} onChange={setNicks} /> */}
              <BidFilter
                title={bid(bidFilter.mapStatus)}
                icon="status"
                value={mapStatus}
                onChange={setMapStatus}
                isSearch
                dropDownList={[
                  {
                    label: bid(bidMapStatusValue.mapped),
                    value: BidMapStatusEnum.Success,
                  },
                  {
                    label: bid(bidMapStatusValue.unmap),
                    value: BidMapStatusEnum.New,
                  },
                  {
                    label: bid(bidMapStatusValue.unableToMap),
                    value: BidMapStatusEnum.NotFound,
                  },
                ]}
              />
              <DateRangeFilter
                maxDate={new Date(Date.now())}
                value={{
                  startDate: orderDateRangePickerShow.startDate,
                  endDate: orderDateRangePickerShow.endDate,
                }}
                onChange={handleOnChangeOrderDate}
                name={bid(bidFilter.orderDate)}
              />
            </BidFilterSection>
          </div>
          <BidFilterTag
            tag={[
              {
                type: bid(bidFilter.nick),
                value: nicks,
                onClear: setNicks,
              },
              {
                type: bid(bidFilter.mapStatus),
                value: mapStatus?.map((s) => bid(getBidMapStatus(s))),
                onClear: setMapStatus,
              },
              {
                type: bid(bidFilter.orderDate),
                tagRender:
                  orderDateRangePickerShow.startDate &&
                  orderDateRangePickerShow.endDate &&
                  common('fieldValueFromTo', {
                    field: bid(bidFilter.endBidTime),
                    from: convertUTCToLocalDate(orderDateRangePickerShow.startDate),
                    to: convertUTCToLocalDate(orderDateRangePickerShow.endDate),
                  }),
                onClear: () => setOrderDateRangePickerShow({ startDate: undefined, endDate: undefined }),
              },
            ]}
            onClearAll={handleClearAllFilter}
            className="mt-2"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 overflow-hidden">
          {noProduct && (
            <div className="flex items-center justify-center h-full">
              <NoProduct text={bid('thereIsNoProduct')} />
            </div>
          )}
          {noResult && (
            <div className="flex items-center justify-center h-full">
              <NoDataTable>
                <Button className="w-[248px]" onClick={handleClearAllFilter}>
                  {bid('reset')}
                </Button>
              </NoDataTable>
            </div>
          )}
          <div className="flex-1 px-3 overflow-hidden">
            <WonBidManageGrid
              dataSource={biddingData?.data?.items}
              isLoading={isLoading}
              previousTotal={(pageIndex - 1) * pageSize}
              refetch={refetch}
            />
          </div>
          <Pagination
            totalPage={biddingData?.data?.totalPages}
            totalRecords={biddingData?.data?.totalRecords}
            setChangePage={handleSetPageNumber}
            pageSize={pageSize}
            setChangePageSize={handleChangePageSize}
            currentPage={pageIndex || 1}
          />
        </div>
      </div>
    </BidLayout>
  );
}

export default Index;
