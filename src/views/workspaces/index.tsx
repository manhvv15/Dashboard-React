import { useState } from 'react';

import { LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

import Nodata from '@/components/commons/Nodata';
import LayoutSection from '@/components/layouts/layout-section';
import { FilterData } from '@/components/workspaces/FilterData';
import TableWorkspace from '@/components/workspaces/TableWorkspace';
import { LocaleNamespace } from '@/constants/enums/common';
import { getManagementWorkspace } from '@/services/user-management/workspace';
import { WorkspaceManagementRequest } from '@/types/user-management/workspace';
import { SetStatePropertyFunc } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_100 } from '@/utils/constants';

const WorkspaceManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const [params, setParams] = useState<WorkspaceManagementRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_100,
  } as WorkspaceManagementRequest);
  const debounceParams = useDebounce(params, 500);

  const workspaces = useQuery({
    queryKey: ['getWorkspacePaging', debounceParams],
    queryFn: () =>
      getManagementWorkspace({
        pageNumber: debounceParams?.pageNumber,
        pageSize: debounceParams?.pageSize,
        keyword: debounceParams.keyword,
        sorting: params.sorting != '' ? params.sorting : undefined,
      }),
    retry: true,
  });

  const filterHandler: SetStatePropertyFunc<WorkspaceManagementRequest> = (propertyName, value) => {
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

  return (
    <LayoutSection label={t('workspaces')}>
      <LoadingOverlay className="h-full w-full px-2" isLoading={workspaces.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <FilterData params={params} setParams={setParams}></FilterData>
          {workspaces.data?.data.items && workspaces.data?.data.items.length > 0 ? (
            <>
              <TableWorkspace
                items={workspaces.data?.data.items ?? []}
                isLoading={workspaces.isLoading}
                setParams={setParams}
              />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={workspaces.data?.data.totalPages}
                totalRecords={workspaces.data?.data.totalRecords}
                pageSize={PAGE_SIZE_100}
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

export default WorkspaceManagement;
