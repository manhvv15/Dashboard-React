import { useState } from 'react';

import { Button, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import DataTable from '@/components/configuration/pricing-models/DataTable';
import { FilterData } from '@/components/configuration/pricing-models/FildterData';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getPricingModel } from '@/services/user-management/configuration';
import { PricingModelRequest, PricingModelResponse } from '@/types/user-management/configuration';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

const PricingModels = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(LocaleNamespace.Common);
  const [params, setParams] = useState<PricingModelRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
    activated: true,
  });

  const [listData, setListData] = useState<PricingModelResponse[]>([]);

  const [debounceParams] = useDebounceValue(params, 500);

  const handleCreateModel = () => {
    navigate('create');
  };

  const { data: tableList, isLoading } = useQuery({
    queryKey: ['getPricingModel', debounceParams],
    queryFn: () => getPricingModel(debounceParams),
    select: (res) => res.data,
    onSuccess: (data) => {
      setListData(data.items);
    },
  });

  const handlePageChange = (idx: number) => {
    setParams((prev) => ({ ...prev, pageNumber: idx }));
  };
  const handleSizeChange = (idx: number) => {
    setParams((prev) => ({ ...prev, pageSize: idx }));
  };

  const isDataAvailabled = listData && listData.length > 0;

  return (
    <LayoutSection
      label={t('configuration.pricingModel')}
      right={
        <AccessibleComponent object={OBJECTS.PRICING_MODEL} action={ACTIONS.CREATE}>
          <Button onClick={handleCreateModel} startIcon={<SvgIcon icon="plus" width={24} height={24} />}>
            {t('configuration.createANewModel')}
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="w-full h-full" isLoading={isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <FilterData params={params} setParams={setParams} />
          {isDataAvailabled ? (
            <>
              <DataTable items={listData ?? []} />
              <Pagination
                currentPage={params.pageNumber + 1}
                pageSize={params.pageSize}
                setChangePage={handlePageChange}
                totalPage={tableList?.totalPages}
                totalRecords={tableList?.totalRecords}
                setChangePageSize={handleSizeChange}
              />
            </>
          ) : (
            <Nodata />
          )}
        </div>
      </LoadingOverlay>
    </LayoutSection>
  );
};

export default PricingModels;
