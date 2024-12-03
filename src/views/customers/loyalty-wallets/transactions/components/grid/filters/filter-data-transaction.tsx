import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Button, DateRangePicker, DropdownFilter, Input, InputNumber, Tabs } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { TabItemType } from '@ichiba/ichiba-core-ui/dist/components/tabs/Tabs';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { Currency, DateFromTo, DateRangeState, IKeyValue } from '@/types';
import { FilterCodeTransactionEnum, TransactionTypeLoyaltyEnum } from '@/types/enums/transaction';
import { formatDate, formatNumber, listTypeTransactionLoyalty, onlySpaces } from '@/utils/common';

import { MoreFilterTransaction } from '../../..';
import { TransactionTabEnum } from '../table-transaction';

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setPaymentTime: Dispatch<SetStateAction<DateFromTo | undefined>>;
  setMoreFilter: Dispatch<SetStateAction<MoreFilterTransaction | undefined>>;
  setCodeFilter: Dispatch<SetStateAction<FilterCodeTransactionEnum>>;
  codeFilter: FilterCodeTransactionEnum;
  setFilterCurrencies: Dispatch<SetStateAction<string[]>>;
  setSearchTabTransaction: Dispatch<SetStateAction<string | number | undefined>>;
  filterCurrencies: string[] | undefined;
  currencies: Currency[];
  setFilterTransactionType: Dispatch<SetStateAction<TransactionTypeLoyaltyEnum[]>>;
  filterTransactionType: TransactionTypeLoyaltyEnum[];
  searchTabTransaction: string | number | undefined;
}

export default function FilterDataTransaction({
  search,
  setSearch,
  setPaymentTime,
  setMoreFilter,
  filterCurrencies,
  currencies,
  setFilterCurrencies,
  setFilterTransactionType,
  setSearchTabTransaction,
  searchTabTransaction,
}: Props) {
  const { t: common } = useTranslation();
  const { t: customer } = useTranslation(LocaleNamespace.Customer);

  const [showFilterCurrency, setShowFilterCurrency] = useState<string>();
  const [amountFrom, setAmountFrom] = useState<string>('');
  const [amountTo, setAmountTo] = useState<string>('');

  const [showTransactionType, setShowTransactionType] = useState<string>(
    listTypeTransactionLoyalty
      .map((e) => {
        return common(`${e.label}`);
      })
      .join(', '),
  );

  const [dateFromToView, setDateFromToView] = useState<DateRangeState[]>([]);
  const [transactionTypeOptions, setTransactionTypeOptions] = useState<IKeyValue[]>(listTypeTransactionLoyalty);

  const [transactionTypeValueSelecteds, setTransactionTypeValueSelecteds] = useState<TransactionTypeLoyaltyEnum[]>(
    listTypeTransactionLoyalty.map((e) => Number(e.value)),
  );
  const [showPaymentTime, setShowPaymentTime] = useState<string>();
  const tabTransactionIndex: TabItemType[] = [
    {
      label: customer('customer.tab.allPoint'),
      value: TransactionTabEnum.AllPoints.toString(),
    },
    {
      label: customer('customer.tab.earn'),
      value: TransactionTabEnum.EarnPoints.toString(),
    },
    {
      label: customer('customer.tab.spent'),
      value: TransactionTabEnum.SpentPoints.toString(),
    },
  ];
  const onChangeTabTransaction = (value: number | string) => {
    setSearchTabTransaction(value);
    let earnPoints: IKeyValue[] = [];
    let spendPoints: IKeyValue[] = [];
    switch (Number(value)) {
      case 0:
        setTransactionTypeOptions(listTypeTransactionLoyalty);
        setFilterTransactionType(listTypeTransactionLoyalty.map((e) => Number(e.value)));
        setTransactionTypeValueSelecteds(listTypeTransactionLoyalty.map((e) => Number(e.value)));
        setShowTransactionType(
          listTypeTransactionLoyalty
            .map((e) => {
              return common(`${e.label}`);
            })
            .join(', '),
        );
        break;
      case 1:
        earnPoints = listTypeTransactionLoyalty.filter(
          (e) =>
            Number(e.value) !== TransactionTypeLoyaltyEnum.Spend &&
            Number(e.value) !== TransactionTypeLoyaltyEnum.WithDraw,
        );
        setTransactionTypeValueSelecteds(earnPoints.map((e) => Number(e.value)));
        setFilterTransactionType(earnPoints.map((e) => Number(e.value)));
        setTransactionTypeOptions(earnPoints);
        setShowTransactionType(
          earnPoints
            .map((e) => {
              return common(`${e.label}`);
            })
            .join(', '),
        );
        break;
      case 2:
        spendPoints = listTypeTransactionLoyalty.filter(
          (e) =>
            Number(e.value) === TransactionTypeLoyaltyEnum.Spend ||
            Number(e.value) === TransactionTypeLoyaltyEnum.WithDraw,
        );
        setFilterTransactionType(spendPoints.map((e) => Number(e.value)));
        setTransactionTypeOptions(spendPoints);
        setTransactionTypeValueSelecteds(spendPoints.map((e) => Number(e.value)));
        setShowTransactionType(
          spendPoints
            .map((e) => {
              return common(`${e.label}`);
            })
            .join(', '),
        );
        break;
      default:
        break;
    }
  };
  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onlySpaces(value)) {
      setSearch('');
      return;
    }
    setSearch(value);
  };

  const handlePaymentTime = ({ startDate, endDate }: PickerRange) => {
    if (!startDate || !endDate) {
      return;
    }

    setDateFromToView([
      {
        startDate: startDate,
        endDate: endDate,
      },
    ]);
    setPaymentTime({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    setShowPaymentTime(
      `${formatDate({ time: startDate.toISOString() })} - ${formatDate({ time: endDate.toISOString() })}`,
    );
  };

  const onClearPaymentTime = () => {
    setShowPaymentTime(undefined);
    setDateFromToView([]);
    setPaymentTime(undefined);
  };

  const handleAmountFrom = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    if (onlySpaces(value)) {
      setAmountFrom('');
      return;
    }
    setAmountFrom(formatNumber(Number(value)));
  };
  const onClearAmountFrom = () => {
    setAmountFrom('');
  };
  const onClearAmountTo = () => {
    setAmountTo('');
  };
  const handleAmountTo = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    if (onlySpaces(value)) {
      setAmountTo('');
      return;
    }
    setAmountTo(formatNumber(Number(value)));
  };

  const handleResetAll = () => {
    setAmountFrom('');
    setAmountTo('');
    setMoreFilter(undefined);
  };

  const onClearTotalAmount = () => {
    setAmountFrom('');
    setAmountTo('');
  };

  const handleClearAllFilter = () => {
    handleResetAll();
    onClearFilterCurrency();
    onClearPaymentTime();
    onClearStatus();
  };

  useEffect(() => {
    setMoreFilter({
      amountFrom: amountFrom,
      amountTo: amountTo,
    });
  }, [amountFrom, amountTo]);

  const onClearDataSearch = () => {
    setSearch('');
  };
  const onChangeCurrency = (value?: string[]) => {
    setFilterCurrencies(value || []);
    setShowFilterCurrency(value?.join(', '));
  };
  const onClearFilterCurrency = () => {
    setFilterCurrencies([]);
    setShowFilterCurrency('');
  };
  const handleTransactionType = (value: TransactionTypeLoyaltyEnum[]) => {
    if (value) {
      setTransactionTypeValueSelecteds(value ?? []);
      setFilterTransactionType(value);
      const status = listTypeTransactionLoyalty.filter((e) => value.includes(Number(e.value)));
      setShowTransactionType(
        status
          .map((e) => {
            return common(`${e.label}`);
          })
          .join(', '),
      );
    } else {
      onClearStatus();
    }
  };
  const onClearStatus = () => {
    setFilterTransactionType([]);
    setTransactionTypeValueSelecteds([]);
    setShowTransactionType('');
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
            <DropdownFilter
              options={transactionTypeOptions || []}
              optionValue="value"
              value={transactionTypeValueSelecteds}
              icon={<SvgIcon icon="status" width={16} height={16} />}
              name={common('transaction.type')}
              size="32"
              optionLabel={(option) => {
                return <span>{common(`${option.label}`)}</span>;
              }}
              multiple
              allowSelectAll
              searchable
              onChange={(e) => handleTransactionType(e as TransactionTypeLoyaltyEnum[])}
            />
          </div>
          <div>
            <DateRangePicker
              onChange={handlePaymentTime}
              placeholder={common('paymentTime')}
              value={dateFromToView[0]}
              size="32"
            />
          </div>
          <div>
            <div className="flex items-center rounded-lg">
              <div className="flex h-8 gap-3 rounded-lg relative">
                <div className="flex">
                  <div className="flex items-center text-sm gap-2 px-3 py-1.5">
                    <SvgIcon icon="filter-sort" width={16} height={16} />
                    <span>{common('amount')}</span>
                  </div>
                  <InputNumber
                    hiddenClose={!amountFrom}
                    onClearData={onClearAmountFrom}
                    size={32}
                    className="w-20"
                    classNameContainer="h border-none shadow-none outline-none focus-within:!shadow-none flex-1 px-0"
                    onChange={handleAmountFrom}
                    placeholder={common('from')}
                    value={amountFrom}
                  />
                </div>
                <div className="flex items-center">
                  <SvgIcon icon="arrow-right" width={20} height={20} className="text-ic-ink-5s mx-3" />
                </div>
                <div className="">
                  <InputNumber
                    hiddenClose={!amountTo}
                    onClearData={onClearAmountTo}
                    size={32}
                    className="w-20"
                    classNameContainer="border-none shadow-none outline-none focus-within:!shadow-none flex-1 pl-0"
                    onChange={handleAmountTo}
                    placeholder={common('to')}
                    value={amountTo}
                    icon={<SvgIcon icon="wallet-money" width={24} height={24} className="text-ic-ink-5s ml-1" />}
                  />
                </div>
                <fieldset className="absolute inset-0 border border-ic-ink-2s rounded-lg pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" mt-2 flex flex-wrap gap-1">
        {showFilterCurrency && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('filter.currency')}: ${showFilterCurrency}`}</p>
            <button onClick={onClearFilterCurrency}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showTransactionType && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg gap-1 px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.type',
            )}: ${showTransactionType}`}</p>
            <button onClick={onClearStatus}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showPaymentTime && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.paymentTime',
            )}: ${showPaymentTime}`}</p>
            <button onClick={onClearPaymentTime}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {(amountFrom || amountTo) && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('totalAmount')}: ${
              amountFrom && `From ${amountFrom}`
            } ${amountTo && `to ${amountTo}`}`}</p>
            <button onClick={onClearTotalAmount}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}

        {(showPaymentTime || showTransactionType || amountFrom || amountTo || showFilterCurrency) && (
          <Button variant="text" size="16" color="primary" className="!py-0 !px-2 h-7" onClick={handleClearAllFilter}>
            {common('clearAll')}
          </Button>
        )}
      </div>
      <div className=" pt-4">
        <Tabs
          items={tabTransactionIndex}
          variant="14R"
          className="border-none text-sm"
          activeValue={searchTabTransaction}
          onChange={onChangeTabTransaction}
        />
      </div>
    </div>
  );
}
