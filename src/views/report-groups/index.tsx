import LayoutSection from '@/components/layouts/layout-section';
import AccessibleComponent from '@/components/commons/AccessibleComponent';
import { Button, Input, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import SvgIcon from '@/components/commons/SvgIcon';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { LocaleNamespace } from '@/constants/enums/common';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from '@/utils/constants';
import { ChangeEvent, useState } from 'react';
import { onlySpaces, SetStatePropertyFunc } from '@/utils/common';
import Nodata from '@/components/commons/Nodata';
import { ReportGroupPagingRequest } from '@/types/document-service/report-group';
import { getReportGroupPaging } from '@/services/document-service/reportGroup';
import TableReportGroup from '@/components/report-groups/TableReportGroup';
const ReportGroupManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const navigate = useNavigate();
  const handleCreate = () => {
    navigate('create');
  };
  const filterHandler: SetStatePropertyFunc<ReportGroupPagingRequest> = (propertyName, value) => {
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
      filterHandler('textSearch', '');
      return;
    }
    filterHandler('textSearch', value);
  };

  const [params, setParams] = useState<ReportGroupPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  } as ReportGroupPagingRequest);
  const reportGroup = useQuery({
    queryKey: ['getReportGroupPaging', params],
    queryFn: () =>
      getReportGroupPaging({
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        textSearch: params?.textSearch,
      }),
    retry: true,
  });

  return (
    <LayoutSection
      label={t('report-groups.report-groups')}
      right={
        <AccessibleComponent object={OBJECTS.REPORT_GROUPS} action={ACTIONS.CREATE}>
          <Button onClick={() => handleCreate()}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('create')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={reportGroup.isLoading}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <div className="flex mb-2">
            <Input
              onChange={handleSearch}
              placeholder={t('reports.textSearch')}
              classNameContainer="w-[600px]"
              icon={<SvgIcon icon="search" />}
              hiddenClose
              size={40}
            />
          </div>
          {reportGroup.data?.data.items && reportGroup.data?.data.items.length > 0 ? (
            <>
              <TableReportGroup items={reportGroup.data?.data.items ?? []} />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={reportGroup.data?.data.totalPages}
                totalRecords={reportGroup.data?.data.totalRecords}
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

export default ReportGroupManagement;
