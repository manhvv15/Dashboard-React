import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { listShippingTypeSearch } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { getRecommentedEntry, getTagRecomented } from '@/services/ship4p/recommented';
import { getAllCountries } from '@/services/user-management/master-data';
import { ShippingRateEnum } from '@/types/enums/carrier';
import { FilterRecommendParams, GetEntriesRecommendedResponse, TagsRecomented } from '@/types/ship4p/recomented';
import { CountryApi } from '@/types/user-management/master-data';
import { Button, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { OptionValue } from '@ichiba/ichiba-core-ui/dist/components/multiple-select/types';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';
import { FilterRecomented } from './filters/filter';
import { ShowFilterRecoment } from './filters/show-filter';
import { TableRecoment } from './grids';
import { CreateRecomentedEntry } from './modals/create';

export const Recomment = () => {
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [countries, setCountries] = useState<CountryApi[]>([]);
  const [tagRecomments, setTagRecomments] = useState<TagsRecomented[]>();
  const [searchRecomentEntry, setSearchRecomentEntry] = useState<FilterRecommendParams>({
    keyword: '',
    countryIds: [],
    shippingTypies: [],
    tagIds: [],
  });
  const listShippingRateCarrier = listShippingTypeSearch(tShip4p);
  const searchDebounce = useDebounce(searchRecomentEntry);
  const [recomentEntries, setRecomentEntries] = useState<GetEntriesRecommendedResponse[]>();
  const { t } = useTranslation(LocaleNamespace.Common);
  const onHandleOpenModalCreate = () => {
    setVisibleCreate(true);
  };
  const {
    isLoading,
    isSuccess,
    refetch: refetchRecommentEntry,
  } = useQuery({
    queryKey: ['getRecommentEntry', searchDebounce],
    queryFn: () => getRecommentedEntry(searchDebounce),
    keepPreviousData: true,
    onSuccess: (res) => {
      setRecomentEntries(res.data);
    },
  });
  useQuery({
    queryKey: ['getCountries'],
    queryFn: getAllCountries,
    onSuccess: (res) => {
      setCountries(res.data);
    },
  });
  useQuery({
    queryKey: ['getTagRecommentForCreate'],
    queryFn: () =>
      getTagRecomented({
        keyword: '',
      }),
    onSuccess: (res) => {
      setTagRecomments(res.data);
    },
  });
  const elementCreateTag = (
    <AccessibleComponent object={OBJECTS.MANAGE_RECOMMENDS} action={ACTIONS.CREATE}>
      <Button size="40" onClick={onHandleOpenModalCreate}>
        <SvgIcon icon="plus" height={24} width={24} />
        <span>{tShip4p('create.entry.recomment.title')}</span>
      </Button>
    </AccessibleComponent>
  );
  const onHandleCloseModalCreate = () => {
    onConfirm();
    setVisibleCreate(false);
  };
  const onConfirm = () => {
    refetchRecommentEntry();
  };
  const onChangeSearchInput = (value?: string) => {
    setSearchRecomentEntry((prev) => ({
      ...prev,
      keyword: value ?? '',
    }));
  };

  const onHandleChangeSearchCountry = (options: OptionValue[]) => {
    setSearchRecomentEntry((prevState) => ({
      ...prevState,
      countryIds: options?.map((e) => e.toString()),
    }));
  };
  const onHandleChangeSearchShippingType = (options: ShippingRateEnum[]) => {
    setSearchRecomentEntry((prevState) => ({
      ...prevState,
      shippingTypies: options,
    }));
  };
  const onHandleChangeTags = (value: string[] | undefined) => {
    setSearchRecomentEntry((prev) => ({
      ...prev,
      tagIds: value,
    }));
  };
  const onClearSearchCountry = () => {
    setSearchRecomentEntry((prevState) => ({
      ...prevState,
      countryIds: undefined,
    }));
  };
  const onClearSearchShippingType = () => {
    setSearchRecomentEntry((prevState) => ({
      ...prevState,
      shippingTypies: undefined,
    }));
  };
  const onClearTasSearch = () => {
    setSearchRecomentEntry((prev) => ({
      ...prev,
      tagIds: undefined,
    }));
  };
  const onClickResetAll = () => {
    setSearchRecomentEntry((prev) => ({
      ...prev,
      countryIds: undefined,
      shippingTypies: undefined,
      tagIds: undefined,
    }));
  };
  const isResetAll = useMemo(() => {
    return (
      (searchRecomentEntry.countryIds || []).length > 0 ||
      (searchRecomentEntry.shippingTypies || []).length > 0 ||
      (searchRecomentEntry.tagIds || []).length > 0
    );
  }, [searchRecomentEntry]);
  const isSearch = useMemo(() => {
    return (
      (searchRecomentEntry.countryIds || []).length > 0 ||
      (searchRecomentEntry.shippingTypies || []).length > 0 ||
      (searchRecomentEntry.tagIds || []).length > 0 ||
      searchRecomentEntry.keyword
    );
  }, [searchDebounce]);
  return (
    <LayoutSection label={tShip4p('configuration.entry.recomment')} right={elementCreateTag}>
      <LoadingOverlay isLoading={isLoading} className="h-full w-full">
        <div className="flex flex-1 w-full h-full bg-white px-5 rounded-lg pt-3 pb-6 gap-4">
          {((recomentEntries || []).length > 0 || isSearch) && isSuccess && (
            <div className="flex flex-col h-full w-full overflow-hidden">
              {!isSearch && (recomentEntries || []).length < 1 ? (
                <></>
              ) : (
                <div className="flex flex-col gap-2">
                  <FilterRecomented
                    recomentedFilters={searchRecomentEntry}
                    countries={countries}
                    listShippingRateCarrier={listShippingRateCarrier}
                    onChangeSearchInput={onChangeSearchInput}
                    onHandleChangeSearchCountry={onHandleChangeSearchCountry}
                    onHandleChangeSearchShippingType={onHandleChangeSearchShippingType}
                    onHandleChangeTags={onHandleChangeTags}
                    tags={tagRecomments}
                  />
                  <ShowFilterRecoment
                    countries={countries}
                    isResetAll={isResetAll}
                    listShippingRateCarrier={listShippingRateCarrier}
                    onClearSearchCountry={onClearSearchCountry}
                    onClearSearchShippingType={onClearSearchShippingType}
                    onClearTasSearch={onClearTasSearch}
                    onClickResetAll={onClickResetAll}
                    recomentedFilters={searchRecomentEntry}
                    tags={tagRecomments}
                  />
                </div>
              )}
              {(recomentEntries || []).length > 0 ? (
                <div className="flex flex-col h-full w-full p-1">
                  <div className="flex flex-col flex-1 overflow-hidden h-full">
                    <TableRecoment confirm={onConfirm} data={recomentEntries} />
                  </div>
                </div>
              ) : (
                isSearch && (
                  <div className="flex w-full h-full gap-2 items-center flex-col justify-center">
                    <SvgIcon icon="empty-search" width="168" height="168" />
                    <span>{t('noResultsFound.tag')}</span>
                    {elementCreateTag}
                  </div>
                )
              )}
            </div>
          )}

          {(recomentEntries || []).length < 1 && !isSearch && isSuccess && !isLoading && (
            <div className="flex w-full h-full">
              <div className="flex w-full h-full gap-2 items-center flex-col justify-center">
                <SvgIcon icon="empty" width="168" height="168" />
                <span className="font-medium text-base leading-6 text-ic-ink-6s">{t('noResultsFound.tag')}</span>
                <span className="text-sm leading-6 text-ic-ink-5s">{t('noResultsFound.entry.description')}</span>
                {elementCreateTag}
              </div>
            </div>
          )}
        </div>
      </LoadingOverlay>
      {visibleCreate && (
        <Suspense>
          <CreateRecomentedEntry
            open={visibleCreate}
            onClose={onHandleCloseModalCreate}
            type="create"
            tagRecomments={tagRecomments}
          />
        </Suspense>
      )}
    </LayoutSection>
  );
};
