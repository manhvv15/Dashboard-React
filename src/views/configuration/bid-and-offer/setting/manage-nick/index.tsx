import { BidFilterSection, BidFilterTag, BidNickManageGrid, NoProduct } from '@/components/bid';
import { AuthorizationConfigurationDialog } from '@/components/bid/manage-nick/AuthorizationConfigurationDialog';
import SvgIcon from '@/components/commons/SvgIcon';
import BidLayout from '@/components/layouts/bid-layout/BidLayout';
import { allowToBidValue, bidFilter, bidNickRankingValue, bidNickStatusValue, readyForBidValue } from '@/constants/bid';
import { LocaleNamespace } from '@/constants/enums/common';
import { useGetBidNicks } from '@/hooks-query/bid';
import { AllowBidEnum, BidNickRankingEnum, BidNickStatusEnum, ReadyToBidEnum } from '@/types/bid/enum';
import { GetBidNickRequest } from '@/types/bid/interface';
import { getAllowBid, getBidNickRankingFilter, getBidNickStatus, getReadyToBid } from '@/utils/bid';
import { onlySpaces } from '@/utils/common';
import NoDataTable from '@/views/customers/invoices/components/grid/nodata-table';
import { Button, DropdownFilter, Input, Pagination } from '@ichiba/ichiba-core-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';

const initPageIndex = 1;
const initialFilter = {
  keyword: '',
  customer: undefined,
  status: undefined,
  readyToBid: undefined,
  allowToBid: undefined,
  ranking: undefined,
  pageIndex: 1,
  pageSize: 20,
};

function Index() {
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState(initPageIndex);
  const [pageSize, setPageSize] = useState(20);

  const [filter, setFilter] = useState<GetBidNickRequest>({} as GetBidNickRequest);
  const [keywordDebounde] = useDebounceValue(filter.keyword, 500);
  const [readyToBidDebounde] = useDebounceValue(filter.readyToBid, 500);
  const [allowBidDebounde] = useDebounceValue(filter.allowBid, 500);
  const [rankingDebounde] = useDebounceValue(filter.ranking, 500);
  const [statusDebounde] = useDebounceValue(filter.status, 500);

  const {
    data: bidNickData,
    isLoading,
    isFetching,
    refetch,
  } = useGetBidNicks({
    queryKey: [
      pageIndex,
      pageSize,
      keywordDebounde,
      readyToBidDebounde,
      allowBidDebounde,
      rankingDebounde,
      statusDebounde,
    ],
    queryParams: {
      pageIndex,
      pageSize,
      keyword: keywordDebounde?.toString(),
      readyToBid: readyToBidDebounde,
      allowBid: allowBidDebounde,
      ranking: rankingDebounde,
      status: statusDebounde,
    },
  });

  const queryDebounce = [keywordDebounde, readyToBidDebounde, allowBidDebounde, rankingDebounde, statusDebounde];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setPageIndex(initPageIndex);
      setFilter({ ...filter, keyword: '' });
      return;
    }
    const val = event.target.value.trim();
    if (onlySpaces(val.charAt(0) || '')) {
      event.target.value = '';
      return;
    }
    setPageIndex(initPageIndex);
    setFilter({ ...filter, keyword: val });
  };

  const handleClearSearch = () => {
    setFilter({ ...filter, keyword: '' });
    setPageIndex(initPageIndex);
  };

  const handleSetPageNumber = (page: number) => {
    setPageIndex(page);
  };

  const handleChangePageSize = (value: number) => {
    if (Number(value) > 0) {
      setPageSize(Number(value));
    }
  };

  const handleAddNick = () => {
    navigate('/configuration/bid-and-offer/setting/manage-nick/add-nick');
  };

  const isFilter = queryDebounce.some((x) => !!x);
  const noProduct = !isLoading && !isFilter && (!bidNickData || bidNickData?.data.totalRecords === 0);
  const noResult = !isLoading && isFilter && (!bidNickData || bidNickData?.data.totalRecords === 0);

  function handleChangeStatus(value?: number[]): void {
    setFilter({ ...filter, status: value });
  }
  function handleClearAllFilter(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.stopPropagation();
    setFilter({
      ...initialFilter,
    });
  }

  function handleChangeReadyToBid(value?: number | undefined): void {
    setFilter({ ...filter, readyToBid: value });
  }

  function handleChangeAllowBid(value?: number | undefined): void {
    setFilter({ ...filter, allowBid: value });
  }
  function handleChangeRanking(value?: number | undefined): void {
    setFilter({ ...filter, ranking: value });
  }

  const [openAuthorizationConfigurations, setOpenAuthorizationConfigurations] = useState(false);
  const handleOpenAuthorizationConfigurations = () => {
    setOpenAuthorizationConfigurations(true);
  };
  const handleCloseAuthorizationConfigurations = () => {
    setOpenAuthorizationConfigurations(false);
  };

  return (
    <BidLayout
      left={<h2 className="text-lg font-medium">{bid('manageNick')}</h2>}
      right={
        <div className="flex items-center gap-3">
          <Button variant="outlined" onClick={handleOpenAuthorizationConfigurations}>
            <p>{bid('authorizationConfiguration')}</p>
          </Button>
          <Button onClick={handleAddNick} className="flex items-center justify-between gap-2">
            <SvgIcon icon="plus" width={24} height={24}></SvgIcon>
            <p>{bid('addNick')}</p>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg">
        <div className="p-3">
          <div className="flex gap-6">
            <BidFilterSection>
              <div className="w-[600px]">
                <Input
                  className="flex-1"
                  value={filter.keyword}
                  onChange={handleSearch}
                  onClearData={handleClearSearch}
                  placeholder={bid('searchWithNickBidAlias')}
                  icon={<SvgIcon icon="search" />}
                  hiddenClose={!filter.keyword}
                />
              </div>
              <DropdownFilter
                name={bid(bidFilter.status)}
                icon={<SvgIcon icon="status" />}
                onChange={handleChangeStatus}
                searchable={false}
                multiple
                size="40"
                clearable
                options={[
                  {
                    label: bid(bidNickStatusValue.init),
                    value: BidNickStatusEnum.Init,
                  },
                  {
                    label: bid(bidNickStatusValue.ready),
                    value: BidNickStatusEnum.Ready,
                  },
                  {
                    label: bid(bidNickStatusValue.failed),
                    value: BidNickStatusEnum.Failed,
                  },
                  {
                    label: bid(bidNickStatusValue.stop),
                    value: BidNickStatusEnum.Stop,
                  },
                ]}
                onReset={() => setFilter({ ...filter, status: undefined })}
              />
              <DropdownFilter
                name={bid(bidFilter.readyToBid)}
                icon={<SvgIcon icon="ready-to-bid" />}
                onChange={handleChangeReadyToBid}
                size="40"
                clearable
                onReset={() => setFilter({ ...filter, readyToBid: undefined })}
                options={[
                  {
                    label: bid(readyForBidValue.ready),
                    value: ReadyToBidEnum.Ready,
                  },
                  {
                    label: bid(readyForBidValue.unready),
                    value: ReadyToBidEnum.Unready,
                  },
                ]}
                multiple={false}
              />
              <DropdownFilter
                name={bid(bidFilter.allowToBid)}
                icon={<SvgIcon icon="allow-to-bid" />}
                onChange={handleChangeAllowBid}
                size="40"
                searchable
                clearable
                options={[
                  {
                    label: bid(allowToBidValue.allowed),
                    value: AllowBidEnum.Allowed,
                  },
                  {
                    label: bid(allowToBidValue.notAllowed),
                    value: AllowBidEnum.NotAllowed,
                  },
                ]}
                multiple={false}
              />
              <DropdownFilter
                name={bid(bidFilter.ranking)}
                icon={<SvgIcon icon="ranking" />}
                onChange={handleChangeRanking}
                size="40"
                searchable
                clearable
                onReset={() => setFilter({ ...filter, ranking: undefined })}
                options={[
                  {
                    label: bid(bidNickRankingValue.good),
                    value: BidNickRankingEnum.Credibility,
                  },
                  {
                    label: bid(bidNickRankingValue.error),
                    value: BidNickRankingEnum.NoCredibility,
                  },
                ]}
                multiple={false}
              />
            </BidFilterSection>
          </div>
          <BidFilterTag
            tag={[
              {
                type: bid(bidFilter.status),
                value: filter.status?.map((s) => bid(getBidNickStatus(s))),
                onClear: () => setFilter({ ...filter, status: undefined }),
              },
              {
                type: bid(bidFilter.readyToBid),
                value: filter.readyToBid ? bid(getReadyToBid(filter.readyToBid!)) : undefined,
                onClear: () => setFilter({ ...filter, readyToBid: undefined }),
              },
              {
                type: bid(bidFilter.allowToBid),
                value: filter.allowBid ? bid(getAllowBid(filter.allowBid!)) : undefined,
                onClear: () => setFilter({ ...filter, allowBid: undefined }),
              },
              {
                type: bid(bidFilter.ranking),
                value: filter.ranking ? bid(getBidNickRankingFilter(filter.ranking!)) : undefined,
                onClear: () => setFilter({ ...filter, ranking: undefined }),
              },
            ]}
            onClearAll={handleClearAllFilter}
            className="mt-2"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 overflow-hidden">
          {noProduct && (
            <div className="flex items-center justify-center h-full">
              <NoProduct text={bid('thereIsNoBidNick')}>
                <Button className="w-[248px] mt-4" onClick={handleAddNick}>
                  {bid('addNick')}
                </Button>
              </NoProduct>
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
            <BidNickManageGrid
              dataSource={bidNickData?.data.items}
              isLoading={isLoading || isFetching}
              handleRefetch={() => refetch()}
            />
          </div>
          <Pagination
            totalPage={bidNickData?.data?.totalPages}
            totalRecords={bidNickData?.data?.totalRecords}
            setChangePage={handleSetPageNumber}
            pageSize={pageSize}
            setChangePageSize={handleChangePageSize}
            currentPage={pageIndex || 1}
          />
        </div>
      </div>

      {openAuthorizationConfigurations && (
        <AuthorizationConfigurationDialog
          opened={openAuthorizationConfigurations}
          onClose={handleCloseAuthorizationConfigurations}
        />
      )}
    </BidLayout>
  );
}

export default Index;
