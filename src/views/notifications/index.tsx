import { useState } from 'react';

import { Button, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { FilterData } from '@/components/notifications/FilterData';
import TableNotification from '@/components/notifications/TableNotification';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getNotificationPaging } from '@/services/user-management/notifiation';
import { NotificationPagingRequest } from '@/types/user-management/notification';
import { RolePagingRequest } from '@/types/user-management/role';
import { SetStatePropertyFunc } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

const NotificationManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const navigate = useNavigate();
  const [params, setParams] = useState<NotificationPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
    applicationIds: [],
    status: null,
    keyword: '',
  } as NotificationPagingRequest);
  const debounceParams = useDebounce(params, 500);

  const notification = useQuery({
    queryKey: ['getNotificationPaging', debounceParams],
    queryFn: () =>
      getNotificationPaging({
        pageNumber: debounceParams?.pageNumber,
        pageSize: debounceParams?.pageSize,
        keyword: debounceParams.keyword,
        status: debounceParams.status,
        notificationGroupIds: debounceParams.notificationGroupIds,
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
      label={t('Notifications')}
      right={
        <AccessibleComponent object={OBJECTS.NOTIFICATIONS} action={ACTIONS.CREATE}>
          <Button onClick={() => handleCreate()}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('Create')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full p-2" isLoading={notification.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <FilterData params={params} setParams={setParams}></FilterData>
          <TableNotification items={notification.data?.data.items ?? []} />
          <Pagination
            currentPage={params.pageNumber + 1}
            setChangePage={handlePageChange}
            totalPage={notification.data?.data.totalPages}
            totalRecords={notification.data?.data.totalRecords}
            pageSize={PAGE_SIZE_DEFAULT}
            setChangePageSize={handleSizeChange}
          />
        </div>
      </LoadingOverlay>
    </LayoutSection>
  );
};

export default NotificationManagement;
