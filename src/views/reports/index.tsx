import LayoutSection from '@/components/layouts/layout-section';
import AccessibleComponent from '@/components/commons/AccessibleComponent';
import { Button, DropdownFilter, Input, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
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
import TableReport from '@/components/reports/TableReport';
import { ReportPagingRequest, ReportStatusEnum } from '@/types/document-service/report';
import { getReportPaging } from '@/services/document-service/report';
const ReportManagement = () => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const navigate = useNavigate();
  const handleCreate = () => {
    navigate('create');
  };
  const filterHandler: SetStatePropertyFunc<ReportPagingRequest> = (propertyName, value) => {
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

  const [params, setParams] = useState<ReportPagingRequest>({
    pageNumber: PAGE_NUMBER_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  } as ReportPagingRequest);
  const report = useQuery({
    queryKey: ['getReportPaging', params],
    queryFn: () =>
      getReportPaging({
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        textSearch: params?.textSearch,
        status: params?.status,
      }),
    retry: true,
  });
  const statusOptions = [
    { value: ReportStatusEnum.Active, label: t('active') },
    { value: ReportStatusEnum.Deactivate, label: t('deactive') },
  ];
  const handleChangeStatus = (val?: number[]) => {
    filterHandler('status', val);
  };

  return (
    <LayoutSection
      label={t('reports.reports')}
      right={
        <AccessibleComponent object={OBJECTS.REPORTS} action={ACTIONS.CREATE}>
          <Button onClick={() => handleCreate()}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{t('create')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={report.isLoading}>
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
            <DropdownFilter
              icon={
                <SvgIcon icon="loading-checkmark-status-circle" width={16} height={16} className="text-ic-ink-6s" />
              }
              name={t('status')}
              placement="bottom-start"
              options={statusOptions}
              size={'40'}
              searchable
              multiple
              allowSelectAll
              value={params.status ?? []}
              onChange={handleChangeStatus}
              className="ml-3 w-[200px]"
            />
          </div>
          {report.data?.data.items && report.data?.data.items.length > 0 ? (
            <>
              <TableReport items={report.data?.data.items ?? []} />
              <Pagination
                currentPage={params.pageNumber + 1}
                setChangePage={handlePageChange}
                totalPage={report.data?.data.totalPages}
                totalRecords={report.data?.data.totalRecords}
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

export default ReportManagement;
