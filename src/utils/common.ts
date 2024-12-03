import clsx, { ClassValue } from 'clsx';
import { TFunction } from 'i18next';
import { isNumber } from 'lodash';
import { DateTime } from 'luxon';
import { twMerge } from 'tailwind-merge';

import { ACTIONS, MONTH, MONTH_TYPE, OBJECTS } from '@/constants/variables/common';
import { configs } from '@/constants/variables/environment';
import { REGEX_ADDRESS_CONVERT, REGEX_CONVERT_PHONE } from '@/constants/variables/regexException';
import { useAuth } from '@/hooks/use-auth';
import { IKeyValue } from '@/types';
import { ErrorCode } from '@/types/common';
import { MerchantAccountTypeEnum, TransactionTypeEnum, TransactionTypeLoyaltyEnum } from '@/types/enums/transaction';
import { TransactionTabEnum } from '@/views/customers/loyalty-wallets/transactions/components/grid/table-transaction';
import { TabItemType } from '@ichiba/ichiba-core-ui/dist/components/tabs/Tabs';

export default function capitalize(string: string, keyword: string) {
  return string
    .toLowerCase()
    .split(keyword || '')
    .map((val, index) => {
      if (index > 0) return val.charAt(0).toUpperCase() + val.slice(1);
      return val;
    })
    .join('');
}

export function convertToAsciiString(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'));
}

export function convertMessageCodeToCamelCase(data: { [x: string]: string[] }) {
  return Object.keys(data).reduce(
    (obj, val) => {
      obj[val] = capitalize((data[val] as string[])[0] as string, '_');
      return obj;
    },
    {} as { [x: string]: string },
  );
}

export const compileRequestURL = (url: string, data: Dict<string | number> = {}) => {
  let results = url;

  Object.keys(data).forEach((key) => {
    results = results.replace(`{${key}}`, data[key].toString());
  });

  return results;
};
export const listTransactionTypes = [
  {
    label: 'payment',
    value: TransactionTypeEnum.Payment,
  },
  {
    label: 'deposit',
    value: TransactionTypeEnum.Deposit,
  },
  {
    label: 'authorize',
    value: TransactionTypeEnum.Authorize,
  },

  {
    label: 'autoCharge',
    value: TransactionTypeEnum.AutoCharge,
  },
  {
    label: 'autoChargeCapture',
    value: TransactionTypeEnum.AutoChargeCapture,
  },
  {
    label: 'capture',
    value: TransactionTypeEnum.Capture,
  },
  {
    label: 'refund',
    value: TransactionTypeEnum.Refund,
  },
  {
    label: 'transfer',
    value: TransactionTypeEnum.Transfer,
  },
  {
    label: 'withdraw',
    value: TransactionTypeEnum.Withdraw,
  },
] as IKeyValue[];
export const listTypeTransactionLoyalty = [
  { label: 'Top-up', value: TransactionTypeLoyaltyEnum.Add },
  { label: 'Cashback', value: TransactionTypeLoyaltyEnum.Cashback },
  { label: 'Refund', value: TransactionTypeLoyaltyEnum.Refund },
  { label: 'Pay', value: TransactionTypeLoyaltyEnum.Spend },
  { label: 'Withdraw', value: TransactionTypeLoyaltyEnum.WithDraw },
] as IKeyValue[];
export const tabTransactionIndex = (customer: TFunction) => {
  return [
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
  ] as TabItemType[];
};
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export function formatDate({
  time,
  DATE_MED = false,
  dateFormat = '',
  setZone = true,
  defaultValue = '-',
}: {
  time?: string | null;
  DATE_MED?: boolean;
  dateFormat?: string;
  setZone?: boolean;
  defaultValue?: string;
}) {
  if (!time) {
    return defaultValue;
  }
  const formatTime = setZone ? DateTime.fromISO(time).setZone(window.timeZone) : DateTime.fromISO(time);
  const formatString = dateFormat || window.dateFormat || '';

  if (DATE_MED) {
    return formatTime.toLocaleString(DateTime.DATE_MED);
  }
  return formatTime.toFormat(formatString);
}

export type SetStatePropertyFunc<T> = <K extends keyof T, V extends T[K]>(property: K, value: V) => void;

export function onlySpaces(str?: string) {
  return str?.trim().length === 0;
}
export const getDay = (date?: string) => {
  if (date) return DateTime.fromISO(date).setZone(window.timeZone).day;
  return new Date().getDate();
};

export const getMonth = (date?: string) => {
  if (date) return DateTime.fromISO(date).setZone(window.timeZone).month;
  return MONTH[new Date().getMonth()] as MONTH_TYPE;
};

export const getYear = (date?: string) => {
  if (date) return DateTime.fromISO(date).setZone(window.timeZone).year;
  return new Date().getFullYear();
};
export function formatNumber(num?: number, locale = 'en-US') {
  return isNumber(num) ? new Intl.NumberFormat(locale).format(num) : '';
}
export function formatCurrencyCustom(data?: number | null) {
  if (!data || data == null) {
    return 0;
  }
  return new Intl.NumberFormat('en-US').format(data);
}
export function replaceString(data: { valueIsReplace: string; newValue: string }[], stringReplace: string) {
  let newString = stringReplace;
  data.forEach((val) => {
    newString = newString.replace(val.valueIsReplace, val.newValue);
  });
  return newString;
}
export function formatNumberByCurrency(num?: number | null, currencyCode?: string, locale = 'en-US') {
  return isNumber(num) ? new Intl.NumberFormat(locale).format(num) + ` ${currencyCode}` : '';
}
export function responseErrorCode(data: any) {
  const convertObjectToArray = Object.keys(data).reduce((arr: ErrorCode[], val) => {
    arr.push({
      name: (val[0] as string).toLowerCase() + val.slice(1),
      message: data[val],
      type: 'manual',
    });
    return arr;
  }, []);
  return convertObjectToArray;
}

export function isGrantPermission(object: OBJECTS, action: ACTIONS) {
  return true;
  const isApplyPermission = configs.IS_APPLY_PERMISSION;
  if ((isApplyPermission as string) === 'false') return true;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { permissions } = useAuth();
  const isAccess = permissions?.findIndex((x) => x.action == action && x.objectCode == object) != -1;
  return isAccess;
}
export function convertPhoneNumber(phone: string, prefix: string) {
  const tesst = ((prefix ? `(${prefix}) ` : '') + (phone ? phone : '')).replace(REGEX_CONVERT_PHONE, ' ');
  return tesst;
}
export function converAddressDetail(
  address?: string,
  wardName?: string,
  districtName?: string,
  provinceName?: string,
  countryName?: string,
  postalCode?: string,
) {
  const str: string[] = [];
  if (address) {
    str.push(address as string);
  }
  if (wardName) {
    str.push(wardName as string);
  }
  if (districtName) {
    str.push(districtName as string);
  }
  if (provinceName) {
    str.push(provinceName as string);
  }
  if (countryName) {
    str.push(countryName as string);
  }
  if (postalCode) {
    str.push(postalCode as string);
  }
  return str.join(', ').replace(REGEX_ADDRESS_CONVERT, '');
}
export function methodTransaction(method: MerchantAccountTypeEnum, common: TFunction) {
  switch (method) {
    case MerchantAccountTypeEnum.BIDV:
      return common('bidv');
    case MerchantAccountTypeEnum.BankTransfer:
      return common('bankTransfer');
    case MerchantAccountTypeEnum.COD:
      return common('cod');
    case MerchantAccountTypeEnum.Cash:
      return common('cash');
    case MerchantAccountTypeEnum.Payme:
      return common('payme');
    case MerchantAccountTypeEnum.PaymeDirect:
      return common('paymeDirect');
    case MerchantAccountTypeEnum.PaymeWallet:
      return common('paymeWallet');
    case MerchantAccountTypeEnum.Paypal:
      return common('paypal');
    case MerchantAccountTypeEnum.Point:
      return common('point');
    case MerchantAccountTypeEnum.VietQR:
      return common('vietQR');
    default:
      break;
  }
}

export const parseDateLocalToUTC = (data: string) => {
  const d = DateTime.fromISO(data);
  return d.toUTC().toISO();
};

export const parseDateUTCToLocal = (data: string) => {
  const d = DateTime.fromISO(data).toLocal().toISO();
  return d?.toString();
};

export const convertUTCToLocalDate = (utcDate?: Date) => {
  if (!utcDate) return '';
  const date: Date = new Date(utcDate.toLocaleDateString());
  const day: string = String(date.getDate()).padStart(2, '0');
  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const year: number = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export interface IOptionValidate {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  limitCapacity: number;
  type: string[];
}
export interface IErrorValidate {
  isValid: boolean;
  message: string;
}
export const exportEnum = (enumObject: any) => {
  const values = [];

  const keys = Object.keys(enumObject);
  const checkEnum = keys.every((i) => isNaN(Number(i)));

  if (checkEnum) {
    for (const key of keys) {
      values.push({ key: key, value: enumObject[key] });
    }
    return values;
  }

  for (const key in enumObject) {
    if (isNaN(Number(key))) {
      values.push({ key: key, value: enumObject[key] });
    }
  }
  return values;
};

export function removeNullProps(params: any): any {
  if (Object.keys(params).length === 0) return {};
  const result = { ...(params || {}) };

  Object.keys(result).forEach((key) => {
    if (result[key] === null || result[key] === undefined || result[key].length === 0 || result[key] === '') {
      delete result[key];
    }
  });
  return result;
}
