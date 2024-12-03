import { useState } from 'react';

import { Button, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { FilterData } from '@/components/roles/FilterData';
import TableRole from '@/components/roles/TableRole';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getRolePaging } from '@/services/user-management/role';
import { RolePagingRequest } from '@/types/user-management/role';
import { SetStatePropertyFunc } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

const RoleManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const navigate = useNavigate();
  const [params, setParams] = useState<RolePagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  } as RolePagingRequest);
  const debounceParams = useDebounce(params, 500);

  const role = useQuery({
    queryKey: ['getRolePaging', debounceParams],
    queryFn: () =>
      getRolePaging({
        pageNumber: debounceParams?.pageNumber,
        pageSize: debounceParams?.pageSize,
        keyword: debounceParams.keyword,
        applicationIds: debounceParams.applicationIds,
        status: debounceParams.status,
        workspaceId: '',
      }),
    retry: true,
  });

  const filterHandler: SetStatePropertyFunc<RolePagingRequest> = (propertyName, value) => {
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
      label={t('role.roles')}
      right={
        <AccessibleComponent object={OBJECTS.ROLES} action={ACTIONS.CREATE}>
          <Button onClick={() => handleCreate()}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('role.create')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={role.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <FilterData params={params} setParams={setParams}></FilterData>
          {role.data?.data.items && role.data?.data.items.length > 0 ? (
            <>
              <TableRole items={role.data?.data.items ?? []} />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={role.data?.data.totalPages}
                totalRecords={role.data?.data.totalRecords}
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

export default RoleManagement;
