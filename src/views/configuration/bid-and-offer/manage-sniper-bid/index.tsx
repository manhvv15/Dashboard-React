import { BidFilter, BidFilterSection, BidFilterTag, NoProduct, SniperBidManageGrid } from '@/components/bid';
import DateRangeFilter from '@/components/commons/date-range-filter';
import SvgIcon from '@/components/commons/SvgIcon';
import BidLayout from '@/components/layouts/bid-layout/BidLayout';
import { bidFilter, bidSniperStatusValue, DATE_TIME_FORMAT, initPageIndex } from '@/constants/bid';
import { LocaleNamespace } from '@/constants/enums/common';
import { useGetSniperBidItems } from '@/hooks-query/bid';
import { BidDateType } from '@/types/bid';
import { BidLastTimeStatusEnum } from '@/types/bid/enum';
import { getBidStatus } from '@/utils/bid';
import { formatDate, onlySpaces } from '@/utils/common';
import NoDataTable from '@/views/customers/invoices/components/grid/nodata-table';
import { Button, Input, Pagination } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

function Index() {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const [searchValue, setSearchValue] = useState('');
  const [pageIndex, setPageIndex] = useState(initPageIndex);
  const [pageSize, setPageSize] = useState(20);

  const [status, setStatus] = useState<BidLastTimeStatusEnum[]>();
  const [bidTime, setBidTime] = useState<BidDateType | undefined>();
  const [endBidTime, setEndBidTime] = useState<BidDateType | undefined>();

  const searchDebounce = useDebounce(searchValue);
  const statusDebounce = useDebounce(status);

  const [bidTimeRangePickerShow, setBidRangePickerShow] = React.useState<PickerRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const [endTimeRangePickerShow, setEndTimeRangePickerShow] = React.useState<PickerRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const queryDebounce = [
    searchDebounce,
    statusDebounce,
    bidTimeRangePickerShow.startDate,
    bidTimeRangePickerShow.endDate,
    endTimeRangePickerShow.endDate,
    endTimeRangePickerShow.startDate,
  ];
  const { data: biddingData, isLoading } = useGetSniperBidItems({
    queryKey: [pageIndex, pageSize, queryDebounce],
    queryParams: {
      pageNumber: pageIndex,
      pageSize,
      textSearch: searchDebounce,
      bidTimeStartDate: bidTimeRangePickerShow.startDate?.toString(),
      bidTimeEndDate: bidTimeRangePickerShow.endDate?.toString(),
      endBidTimeStartDate: endTimeRangePickerShow.startDate?.toString(),
      endBidTimeEndDate: endTimeRangePickerShow.endDate?.toString(),
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
    setStatus(undefined);
    setPageIndex(initPageIndex);
    setBidRangePickerShow({ startDate: undefined, endDate: undefined });
    setEndTimeRangePickerShow({ startDate: undefined, endDate: undefined });
  };

  const handleSetPageNumber = (page: number) => {
    setPageIndex(page);
  };

  const handleChangePageSize = (value: number) => {
    if (Number(value) > 0) {
      setPageSize(Number(value));
    }
  };

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

  const isFilter = queryDebounce.some((x) => !!x);
  const noProduct = !isLoading && !isFilter && (!biddingData || biddingData?.data?.totalRecords === 0);
  const noResult = !isLoading && isFilter && (!biddingData || biddingData?.data?.totalRecords === 0);

  return (
    <BidLayout left={<h2 className="text-lg font-medium">{bid('sniperBid')}</h2>}>
      <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg">
        <div className="p-3">
          <div className="flex gap-6">
            <div className="w-[600px]">
              <Input
                className="max-w-[600px] flex-1"
                type="text"
                value={searchValue}
                onChange={handleSearch}
                onReset={handleClearSearch}
                placeholder={bid('searchWithProductId')}
                icon={<SvgIcon icon="search" />}
              />
            </div>
            <BidFilterSection>
              <BidFilter
                title={bid(bidFilter.status)}
                icon="status"
                value={status}
                onChange={setStatus}
                isSearch
                dropDownList={[
                  {
                    label: bid(bidSniperStatusValue.pending),
                    value: BidLastTimeStatusEnum.Pending,
                  },
                  {
                    label: bid(bidSniperStatusValue.success),
                    value: BidLastTimeStatusEnum.Success,
                  },
                  {
                    label: bid(bidSniperStatusValue.fail),
                    value: BidLastTimeStatusEnum.Fail,
                  },
                  {
                    label: bid(bidSniperStatusValue.deleted),
                    value: BidLastTimeStatusEnum.Deleted,
                  },
                  {
                    label: bid(bidSniperStatusValue.priceInvalid),
                    value: BidLastTimeStatusEnum.PriceInValid,
                  },
                  {
                    label: bid(bidSniperStatusValue.bidClientBusy),
                    value: BidLastTimeStatusEnum.BidClientBusy,
                  },
                  {
                    label: bid(bidSniperStatusValue.cookiesInvalid),
                    value: BidLastTimeStatusEnum.CookieInValid,
                  },
                  {
                    label: bid(bidSniperStatusValue.isBlockBySeller),
                    value: BidLastTimeStatusEnum.IsBlockedBySeller,
                  },
                  {
                    label: bid(bidSniperStatusValue.cannotGetValueOfBidSubmitForm),
                    value: BidLastTimeStatusEnum.CannotGetValueOfBidSubmitForm,
                  },
                  {
                    label: bid(bidSniperStatusValue.auctionCouldNotBeAccessed),
                    value: BidLastTimeStatusEnum.AuctionCouldNotBeAccessed,
                  },
                  {
                    label: bid(bidSniperStatusValue.bidEnd),
                    value: BidLastTimeStatusEnum.Ended,
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
                type: bid(bidFilter.status),
                value: status?.map((s) => bid(getBidStatus(s))),
                onClear: setStatus,
              },
              {
                type: bid(bidFilter.bidTime),
                tagRender:
                  bidTime &&
                  common('fieldValueFromTo', {
                    field: bid(bidFilter.bidTime),
                    from: formatDate({
                      time: bidTime.start,
                      setZone: false,
                      dateFormat: DATE_TIME_FORMAT.dateFormatDefault4,
                    }),
                    to: formatDate({
                      time: bidTime.end,
                      setZone: false,
                      dateFormat: DATE_TIME_FORMAT.dateFormatDefault4,
                    }),
                  }),
                onClear: setBidTime,
              },
              {
                type: bid(bidFilter.endBidTime),
                tagRender:
                  endBidTime &&
                  common('fieldValueFromTo', {
                    field: bid(bidFilter.endBidTime),
                    from: formatDate({
                      time: endBidTime.start,
                      setZone: false,
                      dateFormat: DATE_TIME_FORMAT.dateFormatDefault4,
                    }),
                    to: formatDate({
                      time: endBidTime.end,
                      setZone: false,
                      dateFormat: DATE_TIME_FORMAT.dateFormatDefault4,
                    }),
                  }),
                onClear: setEndBidTime,
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
                <Button className="w-[248px] mt-4" onClick={handleClearAllFilter}>
                  {bid('reset')}
                </Button>
              </NoDataTable>
            </div>
          )}
          <div className="flex-1 px-3 overflow-hidden">
            <SniperBidManageGrid
              dataSource={biddingData?.data?.items}
              previousTotal={(pageIndex - 1) * pageSize}
              isLoading={isLoading}
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
