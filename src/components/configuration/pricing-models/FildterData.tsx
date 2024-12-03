import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { Button, DateRangePicker, DropdownFilter, Input } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { find, map } from 'lodash';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace, PeriodTypeEnum, TrialTypeEnum } from '@/constants/enums/common';
import { getPlans } from '@/services/configuration';
import { PricingModelRequest } from '@/types/user-management/configuration';
import { formatDate, onlySpaces } from '@/utils/common';
import { useQuery } from '@tanstack/react-query';

interface Props {
  params: PricingModelRequest;
  setParams: Dispatch<SetStateAction<PricingModelRequest>>;
}

export const FilterData = ({ params, setParams }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { keyword, periods, effectiveDateStart, effectiveDateEnd, trialTypes, activated, planIds } = params;

  const statusOptions = [
    { value: 1, label: t('active') },
    { value: 2, label: t('deactive') },
  ];
  const periodOptions = [
    { value: PeriodTypeEnum.Weekly, label: t('Weekly') },
    { value: PeriodTypeEnum.Monthly, label: t('Monthly') },
    { value: PeriodTypeEnum.Quarterly, label: t('Quarterly') },
    { value: PeriodTypeEnum.Yearly, label: t('Yearly') },
    { value: PeriodTypeEnum.Customize, label: t('Customize ') },
  ];
  const trialOptions = [
    { value: TrialTypeEnum.NoTrial, label: t('No Trial') },
    { value: TrialTypeEnum.Weekly, label: t('Weekly') },
    { value: TrialTypeEnum.Quarterly, label: t('Quarterly') },
    { value: TrialTypeEnum.Yearly, label: t('Yearly') },
    { value: TrialTypeEnum.Customize, label: t('Customize') },
  ];

  const setValue = <T extends keyof PricingModelRequest>(params: { [x in T]: PricingModelRequest[T] }) => {
    setParams((prev) => ({
      ...prev,
      pageNumber: 0,
      ...params,
    }));
  };

  const listPlan =
    useQuery({
      queryKey: ['getPlans'],
      queryFn: () =>
        getPlans({
          pageSize: 1000,
          pageNumber: 0,
        }),
    }).data?.data.items.map((i) => ({ label: i.name, value: i.id })) ?? [];

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onlySpaces(value)) {
      setValue({ keyword: '' });
      return;
    }
    setValue({ keyword: value });
  };

  const handleChangePeriod = (val?: number[]) => {
    setValue({ periods: val });
  };
  const handleChangeEffectiveTime = (val: PickerRange) => {
    setValue({ effectiveDateStart: val.startDate, effectiveDateEnd: val.endDate });
  };
  const handleChangeTrial = (val?: number[]) => {
    setValue({ trialTypes: val });
  };
  const handleChangeStatus = (val?: number) => {
    setValue({ activated: val === 1 ? true : false });
  };
  const handleChangePlan = (val?: string[]) => {
    setValue({ planIds: val });
  };

  const handleClearAllFilters = () => {
    setValue({
      periods: undefined,
      effectiveDateStart: undefined,
      effectiveDateEnd: undefined,
      trialTypes: undefined,
      activated: undefined,
      planIds: undefined,
    });
  };

  const selectedPeriod = map(periods, (id) => find(periodOptions, { value: id }))
    .map((i) => i?.label)
    .join(', ');

  const selectedStatus = activated === false ? 'Deactive' : 'Active';

  const selectedTrial = map(trialTypes, (id) => find(trialOptions, { value: id }))
    .map((i) => i?.label)
    .join(', ');

  const selectedPlans = map(planIds, (id) => find(listPlan, { value: id }))
    .map((i) => i?.label)
    .join(', ');

  const filters = [
    {
      show: !!selectedPeriod.length,
      name: 'status',
      value: `${t('status')}: ${selectedPeriod}`,
      onClose: () => setValue({ periods: undefined }),
    },
    {
      show: !!(effectiveDateStart && effectiveDateEnd),
      name: 'effectiveTime',
      value: `${t('effectiveTime')}: ${effectiveDateStart} -> ${effectiveDateEnd}`,
      onClose: () => setValue({ effectiveDateStart: undefined, effectiveDateEnd: undefined }),
    },
    {
      show: !!selectedTrial.length,
      name: 'trial',
      value: `${t('trial')}: ${selectedTrial}`,
      onClose: () => setValue({ trialTypes: undefined }),
    },
    {
      show: activated,
      name: 'Status',
      value: `${t('status')}: ${selectedStatus}`,
      onClose: () => setValue({ activated: undefined }),
    },
    {
      show: !!planIds?.length,
      name: 'Plans',
      value: `${t('Plans')}: ${selectedPlans}`,
      onClose: () => setValue({ planIds: undefined }),
    },
  ];

  return (
    <div>
      <div className="flex gap-4">
        <div className="w-[300px]">
          <Input
            size={32}
            value={keyword}
            onChange={handleSearch}
            placeholder={t('search')}
            icon={<SvgIcon icon="search" />}
            hiddenClose
          />
        </div>
        <DropdownFilter
          onChange={handleChangePlan}
          allowSelectAll
          size={'32'}
          value={planIds}
          options={listPlan}
          multiple
          name="Plans"
        />
        <DropdownFilter
          icon={<SvgIcon icon="group-user" width={16} height={16} className="text-ic-ink-6s" />}
          name={t('period')}
          options={periodOptions}
          size={'32'}
          searchable
          multiple
          allowSelectAll
          value={periods}
          onChange={handleChangePeriod}
        />
        <DateRangePicker placeholder={t('effectiveTime')} size={'32'} onChange={handleChangeEffectiveTime} />
        <DropdownFilter
          icon={<SvgIcon icon="loading-checkmark-status-circle" width={16} height={16} className="text-ic-ink-6s" />}
          name={t('trial')}
          options={trialOptions}
          size={'32'}
          searchable
          multiple
          allowSelectAll
          value={trialTypes}
          onChange={handleChangeTrial}
        />
        <DropdownFilter
          icon={<SvgIcon icon="loading-checkmark-status-circle" width={16} height={16} className="text-ic-ink-6s" />}
          name={t('status')}
          options={statusOptions}
          size={'32'}
          searchable
          allowSelectAll
          value={activated ? 1 : 2}
          onChange={handleChangeStatus}
        />
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {[
          {
            show: selectedPeriod,
            name: 'Period',
            value: `${t('Period')}: ${selectedPeriod}`,
            onClose: () => setValue({ periods: undefined }),
          },
          {
            show: !!(effectiveDateStart && effectiveDateEnd),
            name: 'effectiveTime',
            value: `${t('effectiveTime')}: ${formatDate({ time: effectiveDateStart?.toISOString() })} -> ${formatDate({ time: effectiveDateEnd?.toISOString() })}`,
            onClose: () => setValue({ effectiveDateStart: undefined, effectiveDateEnd: undefined }),
          },
          {
            show: !!selectedTrial.length,
            name: 'trial',
            value: `${t('trial')}: ${selectedTrial}`,
            onClose: () => setValue({ trialTypes: undefined }),
          },
          {
            show: activated,
            name: 'Status',
            value: `${t('status')}: ${selectedStatus}`,
            onClose: () => setValue({ activated: undefined }),
          },
          {
            show: !!planIds?.length,
            name: 'Plans',
            value: `${t('Plans')}: ${selectedPlans}`,
            onClose: () => setValue({ planIds: undefined }),
          },
        ].map((o) => {
          if (!o.show) {
            return;
          }
          return (
            <div className="flex items-center text-xs font-normal text-ic-ink-6s bg-ic-light px-1 py-[1px] rounded-md">
              <p>{o.value}</p>
              <button className="ml-2" onClick={o.onClose}>
                x
              </button>
            </div>
          );
        })}

        {filters.some((o) => o.show) && (
          <Button
            className="text-ic-primary-6s cursor-pointer ml-2 text-xs"
            variant="text"
            onClick={handleClearAllFilters}
          >
            {t('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
};
