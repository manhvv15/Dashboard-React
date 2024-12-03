import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Button, DateRangePicker, DropdownFilter, Input, InputNumber } from '@ichiba/ichiba-core-ui';
import { PickerRange } from '@ichiba/ichiba-core-ui/dist/components/date-range-picker/DateRangePicker';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { Currency, DateFromTo, DateRangeState, IKeyValue } from '@/types';
import { InvoiceStatusEnum, PaymentStatusEnum } from '@/types/enums/payment';
import { MoreFilterInvoice } from '@/types/payment/invoice';
import { formatDate, formatNumber, onlySpaces } from '@/utils/common';

const listPaymentStatus = [
  {
    label: 'notPaid',
    value: PaymentStatusEnum.Unpaid,
  },
  {
    label: 'partialPaid',
    value: PaymentStatusEnum.PartialPaid,
  },
  {
    label: 'paid',
    value: PaymentStatusEnum.Paid,
  },
  {
    label: 'partialRefund',
    value: PaymentStatusEnum.PartialRefunded,
  },
  {
    label: 'refund',
    value: PaymentStatusEnum.Refund,
  },
] as IKeyValue[];

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setCreatedTime: Dispatch<SetStateAction<DateFromTo | undefined>>;
  setPostedTime: Dispatch<SetStateAction<DateFromTo | undefined>>;
  paymentStatus: PaymentStatusEnum[];
  setPaymentStatus: Dispatch<SetStateAction<PaymentStatusEnum[]>>;
  setMoreFilter: Dispatch<SetStateAction<MoreFilterInvoice | undefined>>;
  setStatusFilter: Dispatch<SetStateAction<InvoiceStatusEnum[] | undefined>>;
  setFilterCurrencies: Dispatch<SetStateAction<string[]>>;
  filterCurrencies: string[] | undefined;
  statusFilter: InvoiceStatusEnum[] | undefined;
  type?: 'invoice' | 'refund';
  currencies: Currency[];
}

interface DateState {
  label?: string;
  range: DateRangeState[];
}

export default function FilterDataInvoice({
  search,
  setSearch,
  setCreatedTime,
  setPostedTime,
  paymentStatus,
  setPaymentStatus,
  setMoreFilter,
  setStatusFilter,
  currencies,
  setFilterCurrencies,
  filterCurrencies,
}: Props) {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: customer } = useTranslation(LocaleNamespace.Customer);

  const [createdDate, setCreatedDate] = useState<DateState>({
    label: undefined,
    range: [],
  });
  const [postedDate, setPostedDate] = useState<DateState>({
    label: undefined,
    range: [
      {
        startDate: new Date(),
        endDate: new Date(),
      },
    ],
  });
  const [showPayment, setShowPayment] = useState<string>();

  const [totalFrom, setTotalFrom] = useState<string>('');
  const [totalTo, setTotalTo] = useState<string>('');

  const [referenceStatus, setReferenceStatus] = useState<string | undefined>();
  const [showFilterCurrency, setShowFilterCurrency] = useState<string>();
  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onlySpaces(value)) {
      setSearch('');
      return;
    }
    setSearch(value);
  };

  const handleCreatedTime = ({ startDate, endDate }: PickerRange) => {
    if (!startDate || !endDate) {
      setCreatedDate({
        label: undefined,
        range: [],
      });
      return;
    }
    setCreatedDate({
      label: `${formatDate({ time: startDate.toISOString() })} - ${formatDate({ time: endDate.toISOString() })}`,
      range: [
        {
          startDate,
          endDate,
        },
      ],
    });
    setCreatedTime({
      startDate,
      endDate,
    });
  };

  const handlePaymentStatus = (index: PaymentStatusEnum[]) => {
    if (index) {
      const showData = listPaymentStatus.filter((ite) => index.includes(Number(ite.value)));
      setPaymentStatus(index);
      setShowPayment(showData.map((i) => common(i.label)).join(', '));
    } else {
      onClearPaymentStatus();
    }
  };

  const onClearFilterCurrency = () => {
    setFilterCurrencies([]);
    setShowFilterCurrency('');
  };
  const onClearCreateTime = () => {
    setCreatedDate({
      label: undefined,
      range: [],
    });
    setCreatedTime(undefined);
  };
  const onClearPostedTime = () => {
    setPostedDate({
      label: undefined,
      range: [
        {
          startDate: new Date(),
          endDate: new Date(),
        },
      ],
    });
    setPostedTime(undefined);
  };

  const onClearPaymentStatus = () => {
    setShowPayment(undefined);
    setPaymentStatus([]);
  };

  const onClearReferenceType = () => {
    setReferenceStatus(undefined);
    setStatusFilter(undefined);
  };

  const handleAmountFrom = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    if (onlySpaces(value)) {
      setTotalFrom('');
      return;
    }
    setTotalFrom(formatNumber(Number(value)));
  };
  const onClearAmountFrom = () => {
    setTotalFrom('');
  };
  const onClearAmountTo = () => {
    setTotalTo('');
  };
  const handleAmountTo = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    if (onlySpaces(value)) {
      setTotalTo('');
      return;
    }
    setTotalTo(formatNumber(Number(value)));
  };

  const handleClearAll = () => {
    setTotalFrom('');
    setTotalTo('');
    setMoreFilter(undefined);
  };

  const handleClearAllFilter = () => {
    handleClearAll();
    onClearCreateTime();
    onClearPostedTime();
    onClearPaymentStatus();
    onClearReferenceType();
    onClearFilterCurrency();
  };

  const onClearTotalAmount = () => {
    setTotalFrom('');
    setTotalTo('');
  };

  useEffect(() => {
    setMoreFilter({
      totalFrom: totalFrom,
      totalTo: totalTo,
    });
  }, [totalFrom, totalTo]);

  const onCleardataTextSearch = () => {
    setSearch('');
  };
  const onChangeCurrency = (value?: string[]) => {
    setFilterCurrencies(value || []);
    setShowFilterCurrency(value?.join(', '));
  };
  return (
    <div className="w-full">
      <div className="mx-3 mt-3 flex flex-wrap items-center gap-3 xl:flex-row sm:flex-col sm:items-start md:flex-col md:items-start">
        <div className="flex items-center xl:w-[370px] lg:w-full">
          <Input
            hiddenClose={!search}
            onClearData={onCleardataTextSearch}
            size={32}
            placeholder={customer('customer.invoice.table.filter.search')}
            onChange={handleChangeSearch}
            className="w-full"
            value={search}
            icon={<SvgIcon icon="search" className="text-ic-ink-6s" width={24} height={24} />}
          />
        </div>
        <div className="flex gap-3 flex-1">
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
          <div className="h-10">
            <DateRangePicker
              size="32"
              onChange={handleCreatedTime}
              value={createdDate.range[0]}
              placeholder={common('createdAt')}
            />
          </div>
          <div>
            <DropdownFilter
              options={listPaymentStatus || []}
              optionValue="value"
              value={paymentStatus}
              icon={<SvgIcon icon="status" width={16} height={16} />}
              name={common('paymentStatus')}
              size="32"
              optionLabel={(option) => {
                return <span>{common(`${option.label}`)}</span>;
              }}
              multiple
              allowSelectAll
              searchable
              onChange={(e) => handlePaymentStatus(e as PaymentStatusEnum[])}
            />
          </div>
          <div>
            <div className="flex items-center rounded-lg">
              <div className="flex h-8 relative  gap-3  rounded-lg ">
                <div className="flex">
                  <div className="flex items-center text-sm gap-2 px-3">
                    <SvgIcon icon="filter-sort" width={16} height={16} />
                    <span>{common('amount')}</span>
                  </div>
                  <InputNumber
                    hiddenClose={!totalFrom}
                    onClearData={onClearAmountFrom}
                    size={32}
                    className="w-20"
                    classNameContainer="border-none shadow-none outline-none focus-within:!shadow-none flex-1 px-0"
                    onChange={handleAmountFrom}
                    placeholder={common('from')}
                    value={totalFrom}
                  />
                </div>
                <div className="flex items-center">
                  <SvgIcon icon="arrow-right" width={20} height={20} className="text-ic-ink-5s mx-3" />
                </div>
                <div className="">
                  <InputNumber
                    hiddenClose={!totalTo}
                    onClearData={onClearAmountTo}
                    size={32}
                    className="w-20"
                    classNameContainer="border-none shadow-none outline-none focus-within:!shadow-none flex-1 pl-0"
                    onChange={handleAmountTo}
                    placeholder={common('to')}
                    value={totalTo}
                    icon={<SvgIcon icon="wallet-money" width={24} height={24} className="text-ic-ink-5s ml-1" />}
                  />
                </div>
                <fieldset className="border border-ic-ink-2s absolute inset-0 rounded-lg pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-3 flex flex-wrap gap-x-2 gap-y-1 mt-2">
        {showFilterCurrency && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg gap-1 px-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('filter.currency')}: ${showFilterCurrency}`}</p>
            <button onClick={onClearFilterCurrency}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {createdDate.label && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg px-1 gap-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('filter.createdTime')}: ${
              createdDate.label
            }`}</p>
            <button onClick={onClearCreateTime}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {postedDate.label && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg px-1 gap-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('postedDate')}: ${
              postedDate.label
            }`}</p>
            <button onClick={onClearPostedTime}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {showPayment && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg px-1 gap-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common(
              'paymentStatus',
            )}: ${showPayment}`}</p>
            <button onClick={onClearPaymentStatus}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {referenceStatus && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg px-1 gap-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('status')}: ${referenceStatus}`}</p>
            <button onClick={onClearReferenceType}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}
        {(totalFrom || totalTo) && (
          <div className="inline-flex items-center border border-ic-ink-2s rounded-lg px-1 gap-1 bg-ic-ink-1s py-[1px]">
            <p className="text-xs font-normal leading-4 text-ic-ink-6s">{`${common('totalAmount')}: ${
              totalFrom && `From ${totalFrom}`
            } ${totalTo && `to ${totalTo}`}`}</p>
            <button onClick={onClearTotalAmount}>
              <SvgIcon icon="close" width={16} height={16} className="text-ic-ink-6s" />
            </button>
          </div>
        )}

        {(createdDate.label ||
          postedDate.label ||
          showPayment ||
          referenceStatus ||
          totalFrom ||
          totalTo ||
          (filterCurrencies || []).length > 0) && (
          <Button size="16" variant="text" color="primary" onClick={handleClearAllFilter} className="!py-0 !px-2 h-7">
            {common('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
}
