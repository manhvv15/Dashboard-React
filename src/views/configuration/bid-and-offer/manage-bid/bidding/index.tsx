import { BiddingManageGrid, BidFilter, BidFilterSection, BidFilterTag, NoProduct } from '@/components/bid';
import DateRangeFilter from '@/components/commons/date-range-filter';
import SvgIcon from '@/components/commons/SvgIcon';
import BidLayout from '@/components/layouts/bid-layout/BidLayout';
import { bidFilter, bidStatusValue } from '@/constants/bid';
import { LocaleNamespace } from '@/constants/enums/common';
import { useGetBiddingItems } from '@/hooks-query/bid';
import { BidStatusEnum } from '@/types/bid/enum';
import { getBidStatus } from '@/utils/bid';
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
  const [status, setStatus] = useState<BidStatusEnum[]>();
  const [bidTimeRangePickerShow, setBidRangePickerShow] = React.useState<PickerRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const [endTimeRangePickerShow, setEndTimeRangePickerShow] = React.useState<PickerRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const searchDebounce = useDebounce(searchValue);
  const nicksDebounce = useDebounce(nicks);
  const statusDebounce = useDebounce(status);

  const queryDebounce = [
    searchDebounce,
    nicksDebounce,
    statusDebounce,
    bidTimeRangePickerShow.startDate,
    bidTimeRangePickerShow.endDate,
    endTimeRangePickerShow.endDate,
    endTimeRangePickerShow.startDate,
  ];

  const { data: biddingData, isLoading } = useGetBiddingItems({
    queryKey: [pageIndex, pageSize, queryDebounce],
    queryParams: {
      pageNumber: pageIndex,
      pageSize,
      textSearch: searchDebounce,
      bidUserName: nicksDebounce,
      bidTimeStartDate: bidTimeRangePickerShow?.startDate?.toString(),
      bidTimeEndDate: bidTimeRangePickerShow?.endDate?.toString(),
      endBidTimeStartDate: endTimeRangePickerShow?.startDate?.toString(),
      endBidTimeEndDate: endTimeRangePickerShow?.endDate?.toString(),
      status: statusDebounce,
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
    setSearchValue('');
    setNicks(undefined);
    setStatus(undefined);
    setBidRangePickerShow({ startDate: undefined, endDate: undefined });
    setEndTimeRangePickerShow({ startDate: undefined, endDate: undefined });
    setPageIndex(initPageIndex);
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
  const noProduct = !isLoading && !isFilter && (!biddingData || biddingData?.data?.totalRecords === 0);
  const noResult = !isLoading && isFilter && (!biddingData || biddingData?.data?.totalRecords === 0);

  const handleOnChangeBidTime = (val: PickerRange) => {
    const startDateShow = val?.startDate ? DateTime.fromISO(val?.startDate.toISOString()).toJSDate() : undefined;
    const endDateShow = val?.endDate ? DateTime.fromISO(val?.endDate.toISOString()).toJSDate() : undefined;
    setBidRangePickerShow({ startDate: startDateShow, endDate: endDateShow });
  };

  const handleOnChangeEndTime = (val: PickerRange) => {
    const startDateShow = val?.startDate ? DateTime.fromISO(val?.startDate.toISOString()).toJSDate() : undefined;
    const endDateShow = val?.endDate ? DateTime.fromISO(val?.endDate.toISOString()).toJSDate() : undefined;
    setEndTimeRangePickerShow({ startDate: startDateShow, endDate: endDateShow });
  };

  return (
    <BidLayout left={<h2 className="text-lg font-medium">{bid('bidding')}</h2>}>
      <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg">
        <div className="p-3">
          <div className="flex gap-6">
            <div className="max-w-[600px] w-full">
              <Input
                className="flex-1"
                type="text"
                value={searchValue}
                onChange={handleSearch}
                onReset={handleClearSearch}
                placeholder={bid('searchWithProductId')}
                icon={<SvgIcon icon="search" />}
              />
            </div>
            <BidFilterSection>
              {/* <BidNickFilter value={nicks} onChange={setNicks} /> */}
              <BidFilter
                title={bid(bidFilter.status)}
                icon="status"
                value={status}
                onChange={setStatus}
                isSearch
                dropDownList={[
                  {
                    label: bid(bidStatusValue.outBid),
                    value: BidStatusEnum.Bidding,
                  },
                  {
                    label: bid(bidStatusValue.fail),
                    value: BidStatusEnum.Fail,
                  },
                  {
                    label: bid(bidStatusValue.highest),
                    value: BidStatusEnum.HasHighest,
                  },
                ]}
              />

              <DateRangeFilter
                maxDate={new Date(Date.now())}
                value={{
                  startDate: bidTimeRangePickerShow.startDate,
                  endDate: bidTimeRangePickerShow.endDate,
                }}
                onChange={handleOnChangeBidTime}
                name={bid(bidFilter.bidTime)}
              />
              <DateRangeFilter
                maxDate={new Date(Date.now())}
                value={{
                  startDate: endTimeRangePickerShow.startDate,
                  endDate: endTimeRangePickerShow.endDate,
                }}
                onChange={handleOnChangeEndTime}
                name={bid(bidFilter.endBidTime)}
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
                type: bid(bidFilter.status),
                value: status?.map((s) => bid(getBidStatus(s))),
                onClear: setStatus,
              },
              {
                type: bid(bidFilter.bidTime),
                tagRender:
                  bidTimeRangePickerShow.startDate &&
                  bidTimeRangePickerShow.endDate &&
                  common('fieldValueFromTo', {
                    field: bid(bidFilter.bidTime),
                    from: convertUTCToLocalDate(bidTimeRangePickerShow.startDate),
                    to: convertUTCToLocalDate(bidTimeRangePickerShow.endDate),
                  }),
                onClear: () => setBidRangePickerShow({ startDate: undefined, endDate: undefined }),
              },
              {
                type: bid(bidFilter.endBidTime),
                tagRender:
                  endTimeRangePickerShow.startDate &&
                  endTimeRangePickerShow.endDate &&
                  common('fieldValueFromTo', {
                    field: bid(bidFilter.endBidTime),
                    from: convertUTCToLocalDate(endTimeRangePickerShow.startDate),
                    to: convertUTCToLocalDate(endTimeRangePickerShow.endDate),
                  }),
                onClear: () => setEndTimeRangePickerShow({ startDate: undefined, endDate: undefined }),
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
                <Button size="40" className="w-[248px] mt-4" onClick={handleClearAllFilter}>
                  {bid('reset')}
                </Button>
              </NoDataTable>
            </div>
          )}
          <div className="flex-1 px-3 overflow-hidden">
            <BiddingManageGrid
              dataSource={biddingData?.data?.items}
              isLoading={isLoading}
              previousTotal={(pageIndex - 1) * pageSize}
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