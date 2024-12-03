import { ChangeEvent, useState } from 'react';

import { Button, Input, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';

import ModalCreateGroupRole from '@/components/group-roles/dialog/ModalCreateGroupRole';
import TableGroupRole from '@/components/group-roles/TableGroupRole';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getOrganizationPaging } from '@/services/user-management/organization';
import { OrganizationPagingRequest } from '@/types/user-management/organization';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT } from '@/utils/constants';

const GroupRoleManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const [isShowModelCreate, setIsShowModelCreate] = useState(false);
  const [params, setParams] = useState<OrganizationPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: 1000,
  } as OrganizationPagingRequest);
  const organization = useQuery({
    queryKey: ['getOrganizationPaging', params],
    queryFn: () =>
      getOrganizationPaging({
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        keyword: params?.keyword,
        workspaceId: '',
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

  // const handlePageChange = (page: number) => {
  //   filterHandler('pageNumber', page - 1);
  // };

  // const handleSizeChange = (size: number) => {
  //   filterHandler('pageSize', size);
  // };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onlySpaces(value)) {
      filterHandler('keyword', '');
      return;
    }
    filterHandler('keyword', value);
  };
  return (
    <LayoutSection
      label={t('groupRole')}
      right={
        <AccessibleComponent object={OBJECTS.GROUP_ROLE} action={ACTIONS.CREATE}>
          <Button onClick={() => setIsShowModelCreate(true)}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('createGroupRole')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={organization.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <div className="mb-2">
            <Input
              onChange={handleSearch}
              placeholder={t('organization.textSearch')}
              classNameContainer="w-[600px]"
              icon={<SvgIcon icon="search" />}
              hiddenClose
              size={40}
            />
          </div>
          {organization.data?.data.items && organization.data?.data.items.length > 0 ? (
            <>
              <TableGroupRole items={organization.data?.data.items ?? []} />
              {/* <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={organization.data?.data.totalPages}
                totalRecords={organization.data?.data.totalRecords}
                pageSize={PAGE_SIZE_DEFAULT}
                setChangePageSize={handleSizeChange}
              /> */}
            </>
          ) : (
            <Nodata />
          )}
        </div>
      </LoadingOverlay>
      <ModalCreateGroupRole open={isShowModelCreate} setOpen={setIsShowModelCreate} />
    </LayoutSection>
  );
};

export default GroupRoleManagement;
