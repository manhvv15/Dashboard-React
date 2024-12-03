import { ChangeEvent, useState } from 'react';

import { Button, Input, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import ModalCreateAndEdit from '@/components/actions/dialog/ModalCreateAndEdit';
import TableAction from '@/components/actions/TableAction';
import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getActionPaging } from '@/services/user-management/action';
import { ActionPagingRequest } from '@/types/user-management/action';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

const ActionManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const [isShowModelCreate, setIsShowModelCreate] = useState(false);
  const [params, setParams] = useState<ActionPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  } as ActionPagingRequest);
  const action = useQuery({
    queryKey: ['getActionPaging', params],
    queryFn: () =>
      getActionPaging({
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        keyword: params?.keyword,
      }),
    retry: true,
  });

  const filterHandler: SetStatePropertyFunc<ActionPagingRequest> = (propertyName, value) => {
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
      label={t('action.actions')}
      right={
        <AccessibleComponent object={OBJECTS.PERMISSIONS} action={ACTIONS.CREATE}>
          <Button onClick={() => setIsShowModelCreate(true)}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('create')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={action.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <div className="mb-2">
            <Input
              onChange={handleSearch}
              placeholder={t('action.textSearch')}
              classNameContainer="w-[600px]"
              icon={<SvgIcon icon="search" />}
              hiddenClose
              size={40}
            />
          </div>
          {action.data?.data.items && action.data?.data.items.length > 0 ? (
            <>
              <TableAction items={action.data?.data.items ?? []} />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={action.data?.data.totalPages}
                totalRecords={action.data?.data.totalRecords}
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
  );
};

export default ActionManagement;
