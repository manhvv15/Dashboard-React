import { ChangeEvent, useState } from 'react';

import { Button, DropdownFilter, Input, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import PlanTable from '@/components/configuration/plan/PlanTable';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace, StatusPlanEnum } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { getApplications, getPlans } from '@/services/configuration';
import { GetPlansPagingQueryResponse } from '@/types/common';
import { onlySpaces } from '@/utils/common';

const Plans = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const navigate = useNavigate();

  const [applicationIds, setApplicationIds] = useDebounceValue<string[] | undefined>(undefined, 300);
  const [status, setStatus] = useDebounceValue<StatusPlanEnum | undefined>(undefined, 300);
  const [search, setSearch] = useDebounceValue<string | undefined>(undefined, 300);

  const [listPlans, setListPlans] = useState<GetPlansPagingQueryResponse[]>();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const { isLoading } = useQuery({
    queryKey: ['getPlans', search, applicationIds, status, currentPage, pageSize],
    queryFn: () =>
      getPlans({
        pageSize: pageSize,
        applicationIds: applicationIds,
        status: status,
        keyword: search,
        pageNumber: currentPage - 1,
      }),
    onSuccess: (data) => {
      setListPlans(data.data.items);
      setTotalPage(data.data.totalPages);
      setTotalRecord(data.data.totalRecords);
    },
  });

  const allApplications =
    useQuery({
      queryKey: ['getApplications'],
      queryFn: getApplications,
    }).data?.data.map((i) => ({ label: i.name, value: i.id })) ?? [];

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onlySpaces(value)) {
      setSearch(undefined);
      return;
    }
    setSearch(value);
  };
  const handleChangeStatus = (e: StatusPlanEnum | undefined) => {
    setStatus(e);
  };

  const handleChangeApplication = (e: string[] | undefined) => {
    setApplicationIds(e);
  };

  const handleCreatePlan = () => {
    navigate('create');
  };

  return (
    <LayoutSection
      label={common('plansManagement')}
      right={
        <AccessibleComponent object={OBJECTS.PLANS} action={ACTIONS.CREATE}>
          <Button onClick={handleCreatePlan}>
            <SvgIcon icon="plus" width={20} height={20} />
            <p>{common('createANewPlan')}</p>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="w-full h-full" isLoading={isLoading}>
        <div className="flex flex-col items-center h-full">
          <div className="flex flex-col h-full p-4 w-full max-w-[1100px] bg-ic-white-6s rounded-lg border border-ic-ink-2s">
            <div className="flex items-center ">
              <div>
                <Input
                  hiddenClose
                  onChange={handleChangeSearch}
                  size={32}
                  placeholder="Search by name/code"
                  icon={<SvgIcon icon="search" width={20} height={20} className="text-ic-ink-6s" />}
                />
              </div>
              <div className="ml-6">
                <DropdownFilter
                  multiple
                  options={allApplications}
                  onChange={handleChangeApplication}
                  name={common('applications')}
                />
              </div>
              <div className="ml-4">
                <DropdownFilter
                  searchable={false}
                  onChange={handleChangeStatus}
                  options={[
                    { label: 'Active', value: StatusPlanEnum.Active },
                    { label: 'Deactivate', value: StatusPlanEnum.Deactivate },
                  ]}
                  name={common('status')}
                />
              </div>
            </div>
            <div className="mt-4 flex-1">
              <PlanTable items={listPlans ?? []} />
            </div>
            <div>
              <Pagination
                totalPage={totalPage}
                totalRecords={totalRecord}
                currentPage={currentPage}
                setChangePage={setCurrentPage}
                pageSize={pageSize}
                setChangePageSize={setPageSize}
              />
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </LayoutSection>
  );
};

export default Plans;
