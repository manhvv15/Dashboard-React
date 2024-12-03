import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { Button, DateRangePicker, DropdownFilter, Input } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { Currency, DateFromTo, DateRangeState } from '@/types';
import { formatDate, onlySpaces } from '@/utils/common';

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setFilterCreatedAtTime: Dispatch<SetStateAction<DateFromTo | undefined>>;
  setFilterPeriodTime: Dispatch<SetStateAction<DateFromTo | undefined>>;
  setFilterCurrencies: Dispatch<SetStateAction<string[]>>;
  filterCurrencies: string[] | undefined;
  currencies: Currency[];
}

export default function FilterDataWallet({
  search,
  setSearch,
  setFilterCreatedAtTime,
  setFilterCurrencies,
  filterCurrencies,
  currencies,
  setFilterPeriodTime,
}: Props) {
  const { t: common } = useTranslation();

  const [showFilterCurrency, setShowFilterCurrency] = useState<string>();

  const [dateFrom, setDateTo] = useState<DateRangeState[]>([]);
  const [periodTime, setPeriodTime] = useState<DateRangeState[]>([]);
  const [showCreateAtTime, setShowCreateAtTime] = useState<string>();
  const [showPeriodTime, setShowPeriodTime] = useState<string>();

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onlySpaces(value)) {
      setSearch('');
      return;
    }
    setSearch(value);
  };

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
  const handlePeriodAtTime = ({ startDate, endDate }: PickerRange) => {
    if (!startDate || !endDate) {
      return;
    }
    setPeriodTime([
      {
        startDate: startDate,
        endDate: endDate,
      },
    ]);
    setFilterPeriodTime({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    setShowPeriodTime(
      `${formatDate({
        time: startDate.toISOString(),
      })} - ${formatDate({
        time: endDate.toISOString(),
      })}`,
    );
  };
  const onClearCreateTime = () => {
    setShowCreateAtTime(undefined);
    setDateTo([]);
    setFilterCreatedAtTime(undefined);
  };
  const onClearPeriodTime = () => {
    setShowPeriodTime(undefined);
    setPeriodTime([]);
    setFilterPeriodTime(undefined);
  };
  const onClearFilterCurrency = () => {
    setFilterCurrencies([]);
    setShowFilterCurrency('');
  };

  const handleClearAllFilter = () => {
    onClearCreateTime();
    onClearFilterCurrency();
    onClearPeriodTime();
  };

  const onChangeCurrency = (value?: string[]) => {
    setFilterCurrencies(value || []);
    setShowFilterCurrency(value?.join(', '));
  };
  const onClearDataSearch = () => {
    setSearch('');
  };
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 xl:flex-row sm:flex-col sm:items-start md:flex-col md:items-start">
        <div className="flex items-center xl:w-[370px] lg:w-full">
          <Input
            hiddenClose={!search}
            onClearData={onClearDataSearch}
            size={32}
            placeholder={common('search')}
            onChange={handleChangeSearch}
            value={search}
            icon={<SvgIcon icon="search" className="text-ic-ink-6s" width={24} height={24} />}
          />
        </div>
        <div className="flex items-center gap-3">
          <div>
            <DropdownFilter
              onChange={(e) => onChangeCurrency(e)}
              value={filterCurrencies}
              size="32"
              icon={<SvgIcon icon="icon-currency" height={16} width={16} />}
              name="Currency"
              options={currencies || []}
              optionValue="code"
              multiple
              allowSelectAll
              searchable
              optionSearchLabel={(e) => e.code}
              optionLabel={(option) => {
                return (
                  <div className="flex items-center ">
                    <span>{option.code}</span>
                  </div>
                );
              }}
            />
          </div>
          <div>
            <DateRangePicker
              onChange={handleCreateAtTime}
              placeholder={common('createdAt')}
              value={dateFrom[0]}
              size="32"
            />
          </div>
          <div>
            <DateRangePicker
              onChange={handlePeriodAtTime}
              placeholder={common('periodAt')}
              value={periodTime[0]}
              size="32"
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {showFilterCurrency && (
          <div className="inline-flex items-center border border-ic-ink-2s gap-1 rounded-lg px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('filter.currency')}: ${showFilterCurrency}`}</p>
            <button onClick={onClearFilterCurrency}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showCreateAtTime && (
          <div className="inline-flex items-center border border-ic-ink-2s gap-1 rounded-lg px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.createdTime',
            )}: ${showCreateAtTime}`}</p>
            <button onClick={onClearCreateTime}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showPeriodTime && (
          <div className="inline-flex items-center border border-ic-ink-2s gap-1 rounded-lg px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.periodTime',
            )}: ${showPeriodTime}`}</p>
            <button onClick={onClearPeriodTime}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {(showCreateAtTime || showPeriodTime || (filterCurrencies || []).length > 0) && (
          <Button variant="text" size="16" color="primary" className="!py-0 !px-2 h-7" onClick={handleClearAllFilter}>
            {common('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
}
