import { useState } from 'react';

import { Button, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { FilterData } from '@/components/users/FilterData';
import TableUser from '@/components/users/TableUser';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getSummaryUserSystem, getUserSystemPaging } from '@/services/user-management/user';
import { RolePagingRequest } from '@/types/user-management/role';
import { UserPagingRequest } from '@/types/user-management/user';
import { SetStatePropertyFunc } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

const UserManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get('roleId');
  const orgId = searchParams.get('organizationId');
  const [params, setParams] = useState<UserPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
    roleIds: roleId ? [roleId] : [],
    organizationIds: orgId ? [orgId] : [],
  } as UserPagingRequest);
  const debounceParams = useDebounce(params, 500);

  const user = useQuery({
    queryKey: ['getUserPaging', debounceParams],
    queryFn: () =>
      getUserSystemPaging({
        pageNumber: debounceParams?.pageNumber,
        pageSize: debounceParams?.pageSize,
        keyword: debounceParams.keyword,
        status: debounceParams.status,
        organizationIds: debounceParams.organizationIds,
        roleIds: debounceParams.roleIds,
      }),
    retry: true,
  });

  const userSummary = useQuery({
    queryKey: ['getSummaryUserSystem'],
    queryFn: () => getSummaryUserSystem(),
    retry: true,
  }).data?.data;

  console.log('userSummary', userSummary);

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

  const handleInviteUsers = () => {
    navigate('invite-users');
  };

  return (
    <LayoutSection
      label={
        <>
          <div>{t('user.users')}</div>
          <div className="flex mt-1">
            <div className="text-xs flex">
              <div className="text-ic-black-5s"> {t('totalUser')}:</div>
              <div className="font-bold ml-1">{userSummary?.totalUser}</div>
            </div>
            <div className="text-xs flex ml-1">
              {' '}
              | <div className="text-ic-black-5s ml-1"> {t('activeUser')}:</div>
              <div className="font-bold ml-1">{userSummary?.activeUsers}</div>
            </div>
          </div>
        </>
      }
      right={
        <AccessibleComponent object={OBJECTS.USERS} action={ACTIONS.INVITE_USERS}>
          <Button onClick={() => handleInviteUsers()}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('user.inviteUsers')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={user.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <FilterData params={params} setParams={setParams}></FilterData>
          {user.data?.data.items && user.data?.data.items.length > 0 ? (
            <>
              <TableUser items={user.data?.data.items ?? []} />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={user.data?.data.totalPages}
                totalRecords={user.data?.data.totalRecords}
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

export default UserManagement;
