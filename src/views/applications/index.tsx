import { useState } from 'react';

import { Button, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';

import { FilterData } from '@/components/applications/FilterData';
import TableApplication from '@/components/applications/TableApplication';
import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getManagementApplication } from '@/services/user-management/application';
import { ApplicationManagementRequest } from '@/types/user-management/application';
import { SetStatePropertyFunc } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

const ApplicationManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const navigate = useNavigate();
  const [params, setParams] = useState<ApplicationManagementRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  } as ApplicationManagementRequest);
  const debounceParams = useDebounce(params, 500);

  const applications = useQuery({
    queryKey: ['getApplicationPaging', debounceParams],
    queryFn: () =>
      getManagementApplication({
        pageNumber: debounceParams?.pageNumber,
        pageSize: debounceParams?.pageSize,
        keyword: debounceParams.keyword,
        status: debounceParams.status,
      }),
    retry: true,
  });

  const filterHandler: SetStatePropertyFunc<ApplicationManagementRequest> = (propertyName, value) => {
    setParams((prev) => ({
      ...prev,
      pageNumber: 0,
      [propertyName]: value,
    }));
  };

  const handlePageChange = (page: number) => {
    filterHandler('pageNumber', page - 1);
  };

  const handleSizeChange = (size: number) => {
    filterHandler('pageSize', size);
  };

  const handleCreate = () => {
    navigate('create');
  };

  return (
    <LayoutSection
      label={t('application.applications')}
      right={
        <AccessibleComponent object={OBJECTS.APPLICATIONS} action={ACTIONS.CREATE}>
          <Button onClick={() => handleCreate()}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('create')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={applications.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <FilterData params={params} setParams={setParams}></FilterData>
          {applications.data?.data.items && applications.data?.data.items.length > 0 ? (
            <>
              <TableApplication items={applications.data?.data.items ?? []} isLoading={applications.isLoading} />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={applications.data?.data.totalPages}
                totalRecords={applications.data?.data.totalRecords}
                pageSize={PAGE_SIZE_DEFAULT}
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

export default ApplicationManagement;
