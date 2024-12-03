export interface DateFromTo {
  startDate: null | Date;
  endDate: null | Date;
}
export interface Options {
  [x: string]: any;
  label: string;
  value: string;
}

export interface DateRangeState {
  startDate: Date;
  endDate: Date;
}
export interface Currency {
  id?: string;
  name: string;
  code: string;
  symbol: string;
  exchangeRateFromUSDToCurrency: string | null;
}
export interface Country {
  id: string;
  code: string;
  name: string;
  prefixPhoneNumber: string;
  defaultLanguageCode: string | null;
  defaultCurrencyCode: string | null;
  order: number | null;
}
export interface IKeyValue {
  label: string;
  value: string | number;
}
