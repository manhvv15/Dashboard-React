import { useState } from 'react';

import { LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

import Nodata from '@/components/commons/Nodata';
import { FilterData } from '@/components/customers/FilterData';
import TableCustomer from '@/components/customers/TableCustomer';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { getCustomerPaging } from '@/services/user-management/customer';
import { CustomerPagingRequest } from '@/types/user-management/customer';
import { SetStatePropertyFunc } from '@/utils/common';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_100 } from '@/utils/constants';

const CustomerManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const [params, setParams] = useState<CustomerPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_100,
  } as CustomerPagingRequest);
  const debounceParams = useDebounce(params, 500);

  const customers = useQuery({
    queryKey: ['getCustomerPaging', debounceParams],
    queryFn: () =>
      getCustomerPaging({
        pageNumber: debounceParams?.pageNumber,
        pageSize: debounceParams?.pageSize,
        keyword: debounceParams.keyword,
        status: debounceParams.status,
        countryCodes: debounceParams.countryCodes,
      }),
    retry: true,
  });

  const filterHandler: SetStatePropertyFunc<CustomerPagingRequest> = (propertyName, value) => {
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
    <LayoutSection label={t('userList')}>
      <LoadingOverlay className="h-full w-full px-2" isLoading={customers.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <FilterData params={params} setParams={setParams}></FilterData>
          {customers.data?.data.items && customers.data?.data.items.length > 0 ? (
            <>
              <TableCustomer
                items={customers.data?.data.items ?? []}
                isLoading={customers.isLoading}
                setParams={setParams}
              />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={customers.data?.data.totalPages}
                totalRecords={customers.data?.data.totalRecords}
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

export default CustomerManagement;
