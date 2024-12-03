import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Button, DateRangePicker, DropdownFilter, Input, InputNumber } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { Currency, DateFromTo, DateRangeState } from '@/types';
import {
  FilterCodeTransactionEnum,
  MerchantAccountTypeEnum,
  PaymentTransactionStatusEnum,
  TransactionTypeEnum,
} from '@/types/enums/transaction';
import { formatDate, formatNumber, listTransactionTypes, onlySpaces } from '@/utils/common';

import { MoreFilterTransaction } from '../../..';

const listPaymentMethod = [
  {
    label: 'BIDV',
    value: MerchantAccountTypeEnum.BIDV,
  },
  {
    label: 'Paypal',
    value: MerchantAccountTypeEnum.Paypal,
  },
  {
    label: 'Payme',
    value: MerchantAccountTypeEnum.Payme,
  },

  {
    label: 'COD',
    value: MerchantAccountTypeEnum.COD,
  },
  {
    label: 'BankTransfer',
    value: MerchantAccountTypeEnum.BankTransfer,
  },
  {
    label: 'Viet QR',
    value: MerchantAccountTypeEnum.VietQR,
  },
  {
    label: 'Cash',
    value: MerchantAccountTypeEnum.Cash,
  },
  {
    label: 'Payme direct',
    value: MerchantAccountTypeEnum.PaymeDirect,
  },
  {
    label: 'Payme wallet',
    value: MerchantAccountTypeEnum.PaymeWallet,
  },
];

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setPaymentTime: Dispatch<SetStateAction<DateFromTo | undefined>>;
  setMoreFilter: Dispatch<SetStateAction<MoreFilterTransaction | undefined>>;
  setCodeFilter: Dispatch<SetStateAction<FilterCodeTransactionEnum>>;
  codeFilter: FilterCodeTransactionEnum;
  setPaymentMethods: Dispatch<SetStateAction<MerchantAccountTypeEnum[]>>;
  paymentMethods: MerchantAccountTypeEnum[];
  setFilterCurrencies: Dispatch<SetStateAction<string[]>>;
  setFilterStatus: Dispatch<SetStateAction<PaymentTransactionStatusEnum[]>>;
  filterCurrencies: string[] | undefined;
  currencies: Currency[];
  filterStatus: PaymentTransactionStatusEnum[] | undefined;
  setFilterType: Dispatch<SetStateAction<TransactionTypeEnum[]>>;
  filterType: TransactionTypeEnum[];
}

export default function FilterDataTransaction({
  search,
  setSearch,
  setPaymentTime,
  setMoreFilter,
  setFilterCurrencies,
  filterCurrencies,
  paymentMethods,
  currencies,
  setPaymentMethods,
  setFilterStatus,
  filterType,
  setFilterType,
}: Props) {
  const { t: common } = useTranslation();
  const { t: customer } = useTranslation(LocaleNamespace.Customer);

  const [showFilterCurrency, setShowFilterCurrency] = useState<string>();
  const [amountFrom, setAmountFrom] = useState<string>('');
  const [amountTo, setAmountTo] = useState<string>('');

  const [dateFrom, setDateTo] = useState<DateRangeState[]>([]);

  const [showPaymentTime, setShowPaymentTime] = useState<string>();
  const [showPaymentMethod, setShowPaymentMethod] = useState<string>();
  const [showStatusForSearch, setShowStatusForSearch] = useState<string>();
  const [showTypeForSearch, setShowTypeForSearch] = useState<string>();
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
    setDateTo([
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

  const handlePaymentMethod = (value: MerchantAccountTypeEnum[] | undefined) => {
    if (value) {
      const showData = listPaymentMethod.filter((ite) => value.includes(ite.value));
      setPaymentMethods(value);
      setShowPaymentMethod(showData.map((i) => common(i.label)).join(', '));
    } else {
      setPaymentMethods([]);
      setShowPaymentMethod('');
    }
  };

  const onClearPaymentTime = () => {
    setShowPaymentTime(undefined);
    setDateTo([]);
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
  const onClearFilterCurrency = () => {
    setFilterCurrencies([]);
    setShowFilterCurrency('');
  };
  const onClearPaymentMethod = () => {
    setPaymentMethods([]);
    setShowPaymentMethod('');
  };
  const onClearStatusForSearch = () => {
    setFilterStatus([]);
    setShowStatusForSearch('');
  };
  const onClearTypeForSearch = () => {
    setFilterType([]);
    setShowTypeForSearch('');
  };
  const handleClearAllFilter = () => {
    handleResetAll();
    onClearPaymentMethod();
    onClearPaymentTime();
    onClearFilterCurrency();
    onClearTypeForSearch();
  };

  useEffect(() => {
    setMoreFilter({
      amountFrom: amountFrom,
      amountTo: amountTo,
    });
  }, [amountFrom, amountTo]);
  const onChangeCurrency = (value?: string[]) => {
    setFilterCurrencies(value || []);
    setShowFilterCurrency(value?.join(', '));
  };
  const onClearDataSearch = () => {
    setSearch('');
  };
  // const onChangeStatusSearch = (value: PaymentTransactionStatusEnum[]) => {
  //   if (value) {
  //     setFilterStatus(value);
  //     setShowStatusForSearch(
  //       listTransactionStatus
  //         .filter((e) => value.includes(Number(e.value)))
  //         .map((e) => {
  //           return common(e.label);
  //         })
  //         .join(', '),
  //     );
  //   } else {
  //     onClearStatusForSearch();
  //   }
  // };
  const onChangeTypes = (value: TransactionTypeEnum[] | undefined) => {
    if (value) {
      setFilterType(value);
      setShowTypeForSearch(
        listTransactionTypes
          .filter((e) => value.includes(Number(e.value)))
          .map((e) => {
            return common(e.label);
          })
          .join(', '),
      );
    } else {
      onClearTypeForSearch();
    }
  };
  return (
    <div className="w-full">
      <div className="mx-3 mt-3 flex flex-wrap items-center gap-3 xl:flex-row sm:flex-col sm:items-start md:flex-col md:items-start">
        <div className="flex items-center xl:w-[370px] lg:w-full">
          <Input
            hiddenClose={!search}
            onClearData={onClearDataSearch}
            size={32}
            placeholder={customer('customer.transaction.table.filter.search')}
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
              options={listTransactionTypes || []}
              optionValue="value"
              icon={<SvgIcon icon="list-check-icon" height={16} width={16} />}
              optionLabel={(option) => {
                return (
                  <div className="flex items-center">
                    <span>{common(option.label)}</span>
                  </div>
                );
              }}
              value={filterType}
              name="Type"
              searchable
              multiple
              allowSelectAll
              onChange={(e) => onChangeTypes(e)}
            />
          </div>
          <div>
            <DateRangePicker
              onChange={handlePaymentTime}
              size="32"
              value={dateFrom[0]}
              placeholder={common('paymentTime')}
            />
          </div>
          {/* <div>
            <DropdownFilter
              options={listTransactionStatus || []}
              optionValue="value"
              optionLabel={(option) => {
                return <span>{common(`${option.label}`)}</span>;
              }}
              icon={<SvgIcon icon="filter-sort" width={16} height={16} />}
              multiple
              allowSelectAll
              name="Status"
              value={filterStatus}
              onChange={(e) => onChangeStatusSearch(e as PaymentTransactionStatusEnum[])}
            />
          </div> */}
          <div>
            <DropdownFilter
              size="32"
              icon={<SvgIcon icon="filter-sort" width={16} height={16} />}
              name={common('method')}
              options={listPaymentMethod || []}
              optionValue="value"
              optionLabel={(option) => common(`${option.label}`)}
              multiple
              allowSelectAll
              value={paymentMethods}
              onChange={(e) => handlePaymentMethod(e)}
              searchable
              optionSearchLabel={(e) => e.label}
            />
          </div>
          <div>
            <div className="flex items-center rounded-lg">
              <div className="flex h-8 relative gap-3 rounded-lg">
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
                    classNameContainer="border-none shadow-none outline-none focus-within:!shadow-none flex-1 px-0"
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
                <fieldset className="absolute border border-ic-ink-2s inset-0 rounded-lg pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-3 mt-2 flex flex-wrap gap-1">
        {showFilterCurrency && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg gap-1 px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('filter.currency')}: ${showFilterCurrency}`}</p>
            <button onClick={onClearFilterCurrency}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showPaymentTime && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg gap-1 px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.paymentTime',
            )}: ${showPaymentTime}`}</p>
            <button onClick={onClearPaymentTime}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showStatusForSearch && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg gap-1 px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.status',
            )}: ${showStatusForSearch}`}</p>
            <button onClick={onClearStatusForSearch}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showPaymentMethod && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg gap-1 px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.paymentMethod',
            )}: ${showPaymentMethod}`}</p>
            <button onClick={onClearPaymentMethod}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showTypeForSearch && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg gap-1 px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'filter.type',
            )}: ${showTypeForSearch}`}</p>
            <button onClick={onClearTypeForSearch}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {(amountFrom || amountTo) && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg gap-1 px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('totalAmount')}: ${
              amountFrom && `From ${amountFrom}`
            } ${amountTo && `to ${amountTo}`}`}</p>
            <button onClick={onClearTotalAmount}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}

        {(showPaymentTime ||
          showStatusForSearch ||
          showTypeForSearch ||
          showPaymentMethod ||
          amountFrom ||
          amountTo ||
          (filterCurrencies || []).length > 0) && (
          <Button variant="text" size="16" color="primary" className="!py-0 !px-2 h-7" onClick={handleClearAllFilter}>
            {common('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
}
