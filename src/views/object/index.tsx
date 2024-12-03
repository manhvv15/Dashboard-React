import { ChangeEvent, useState } from 'react';

import { Button, Input, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import ModalCreateAndEdit from '@/components/objects/dialog/ModalCreateAndEdit';
import TableObject from '@/components/objects/TableObject';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getObjectPaging } from '@/services/user-management/object';
import { ObjectPagingRequest } from '@/types/user-management/object';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';

const ObjectManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const [isShowModelCreate, setIsShowModelCreate] = useState(false);
  const [params, setParams] = useState<ObjectPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  } as ObjectPagingRequest);
  const object = useQuery({
    queryKey: ['getObjectPaging', params],
    queryFn: () =>
      getObjectPaging({
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        keyword: params?.keyword,
      }),
    retry: true,
  });

  const filterHandler: SetStatePropertyFunc<ObjectPagingRequest> = (propertyName, value) => {
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
      label={t('objects')}
      right={
        <AccessibleComponent object={OBJECTS.PERMISSIONS} action={ACTIONS.CREATE}>
          <Button onClick={() => setIsShowModelCreate(true)}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('create')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={object.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <div className="mb-2">
            <Input
              onChange={handleSearch}
              placeholder={t('object.textSearch')}
              classNameContainer="w-[600px]"
              icon={<SvgIcon icon="search" />}
              hiddenClose
              size={40}
            />
          </div>
          {object.data?.data.items && object.data?.data.items.length > 0 ? (
            <>
              <TableObject items={object.data?.data.items ?? []} />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={object.data?.data.totalPages}
                totalRecords={object.data?.data.totalRecords}
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

export default ObjectManagement;
