import React, { Dispatch, SetStateAction, useState } from 'react';

import { Button, DateRangePicker, DropdownFilter, Input } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { DateRangeState, IKeyValue } from '@/types';
import { formatDate } from '@/utils/common';

interface props {
  typeOptions: IKeyValue[];
  statusOptions: IKeyValue[];
  setFilterCreatedAtTime: Dispatch<SetStateAction<DateRangeState | undefined>>;
  setFilterTypes: Dispatch<SetStateAction<number[] | undefined>>;
  setFilterStatus: Dispatch<SetStateAction<string[] | undefined>>;
  filterKeyword: string;
  setFilterSearch: Dispatch<SetStateAction<string>>;
}
const FilterTransacionHistory = ({
  typeOptions,
  statusOptions,
  setFilterCreatedAtTime,
  setFilterStatus,
  setFilterTypes,
  filterKeyword,
  setFilterSearch,
}: props) => {
  const { t: customer } = useTranslation(LocaleNamespace.Customer);
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const [dateFrom, setDateTo] = useState<DateRangeState[]>([]);
  const [typeToView, setTypeToView] = useState<number[]>();
  const [statusToView, setStatusToView] = useState<string[]>();
  const [showCreateAtTime, setShowCreateAtTime] = useState<string>();
  const [showFilterTypes, setShowFilterTypes] = useState<string>('');
  const [showFilterStatus, setShowFilterStatus] = useState<string>('');
  const handleCreateAtTime = ({ startDate, endDate }: PickerRange) => {
    if (!startDate || !endDate) {
      return;
    }
    setDateTo([
      {
        startDate: startDate,
        endDate: endDate,
      },
    ]);

    setFilterCreatedAtTime({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    setShowCreateAtTime(
      `${formatDate({ time: startDate.toISOString() })} - ${formatDate({ time: endDate.toISOString() })}`,
    );
  };
  const onClearCreateTime = () => {
    setShowCreateAtTime(undefined);
    setDateTo([]);
    setFilterCreatedAtTime(undefined);
  };
  const onChangeTypes = (value: number[] | undefined) => {
    if (value) {
      setFilterTypes(value);
      setTypeToView(value);
      const typesName = typeOptions.filter((e) => value.includes(Number(e.value))).map((e) => e.label);
      setShowFilterTypes(typesName.join(', '));
    } else {
      onClearType();
    }
  };
  const onChangeStatus = (value: string[] | undefined) => {
    if (value) {
      setFilterStatus(value);
      setStatusToView(value);
      const statusName = statusOptions.filter((e) => value.includes(e.value.toString())).map((e) => e.label);
      setShowFilterStatus(statusName.join(', '));
    } else {
      onClearStatus();
    }
  };
  const onClearStatus = () => {
    setFilterStatus([]);
    setStatusToView(undefined);
    setShowFilterStatus('');
  };

  const onClearType = () => {
    setFilterTypes([]);
    setTypeToView(undefined);
    setShowFilterTypes('');
  };
  const handleClearAllFilter = () => {
    onClearType();
    onClearStatus();
    onClearCreateTime();
  };
  const onChangeSearch = (value: React.ChangeEvent<HTMLInputElement>) => {
    const searchKey = value.currentTarget.value;
    setFilterSearch(searchKey);
  };
  const onClearSearchKeyword = () => {
    setFilterSearch('');
  };
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 xl:flex-row sm:flex-col sm:items-start md:flex-col md:items-start">
        <div className=" w-[500px] flex items-center lg:w-full mr-2 flex-1">
          <Input
            size={32}
            placeholder={customer('customer.transacion.detail.history.searchPlaceholder')}
            hiddenClose={!filterKeyword}
            value={filterKeyword}
            onChange={onChangeSearch}
            onClearData={onClearSearchKeyword}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[250px]">
            <DropdownFilter
              size="32"
              className="bg-transparent"
              options={typeOptions || []}
              optionKey="value"
              optionValue="value"
              optionLabel={(option) => {
                return common(option.label);
              }}
              searchable
              allowSelectAll
              multiple
              value={typeToView || []}
              icon={<SvgIcon icon="list-check-icon" height={16} width={16} />}
              name={customer('customer.transacion.detail.history.type')}
              onChange={(e) => onChangeTypes(e)}
            />
          </div>
          <div className="w-[250px]">
            <DropdownFilter
              size="32"
              className="bg-transparent"
              options={statusOptions}
              value={statusToView || []}
              optionKey="value"
              optionValue="value"
              optionLabel={(option) => {
                return common(option.label);
              }}
              icon={<SvgIcon icon="filter-sort" height={16} width={16} />}
              multiple
              searchable
              allowSelectAll
              name={customer('customer.transacion.detail.history.status')}
              onChange={(e) => onChangeStatus(e)}
            />
          </div>
          <div>
            <DateRangePicker
              size="32"
              value={dateFrom[0]}
              onChange={handleCreateAtTime}
              placeholder={common('createdAt')}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {showFilterStatus && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg px-1 gap-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('filter.status')}: ${showFilterStatus}`}</p>
            <button onClick={onClearStatus}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showFilterTypes && (
          <div className="inline-flex items-center border border-ic-ink-2s  gap-1 rounded-lg px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('filter.type')}: ${showFilterTypes}`}</p>
            <button onClick={onClearType}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showCreateAtTime && (
          <div className="inline-flex items-center border border-ic-ink-2s  gap-1 rounded-lg px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.createdTime',
            )}: ${showCreateAtTime}`}</p>
            <button onClick={onClearCreateTime}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}

        {(showCreateAtTime || showFilterStatus || showFilterTypes) && (
          <Button variant="text" size="16" color="primary" className="!py-0 !px-2 h-7" onClick={handleClearAllFilter}>
            {common('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
};
export default FilterTransacionHistory;
