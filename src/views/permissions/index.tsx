import { useState } from 'react';

import { Button, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import ModalCreateAndEdit from '@/components/permissions/dialog/ModalCreateAndEdit';
import { FilterData } from '@/components/permissions/FilterData';
import TablePermission from '@/components/permissions/TablePermission';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getPermisisonPaging } from '@/services/user-management/permission';
import { OrganizationPagingRequest } from '@/types/user-management/organization';
import { PermissionPagingRequest } from '@/types/user-management/permission';
import { SetStatePropertyFunc } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

const PermissionManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const [isShowModelCreate, setIsShowModelCreate] = useState(false);
  const [params, setParams] = useState<PermissionPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  } as PermissionPagingRequest);
  const permission = useQuery({
    queryKey: ['getPermissionPaging', params],
    queryFn: () =>
      getPermisisonPaging({
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        keyword: params?.keyword,
        applicationIds: params.applicationIds,
      }),
    retry: true,
  });

  const filterHandler: SetStatePropertyFunc<OrganizationPagingRequest> = (propertyName, value) => {
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
    <>
      <LayoutSection
        label={t('permissions')}
        right={
          <AccessibleComponent object={OBJECTS.PERMISSIONS} action={ACTIONS.CREATE}>
            <Button onClick={() => setIsShowModelCreate(true)}>
              <SvgIcon icon="plus" width={24} height={24} />
              <span className="ml-1">{t('create')}</span>
            </Button>
          </AccessibleComponent>
        }
      >
        <LoadingOverlay className="h-full w-full px-2" isLoading={permission.isLoading}>
          <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
            <FilterData params={params} setParams={setParams}></FilterData>
            {permission.data?.data.items && permission.data?.data.items.length > 0 ? (
              <>
                <TablePermission items={permission.data?.data.items ?? []} />
                <Pagination
                  currentPage={params.pageNumber + 1}
                  setChangePage={handlePageChange}
                  totalPage={permission.data?.data.totalPages}
                  totalRecords={permission.data?.data.totalRecords}
                  pageSize={PAGE_SIZE_DEFAULT}
                  setChangePageSize={handleSizeChange}
                />
              </>
            ) : (
              <Nodata />
            )}
          </div>
        </LoadingOverlay>
        <ModalCreateAndEdit type="create" open={isShowModelCreate} setOpen={setIsShowModelCreate} />
      </LayoutSection>
    </>
  );
};

export default PermissionManagement;
