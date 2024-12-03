export interface PageResult<T> {
  items: Array<T>;
  totalPages: number;
  totalRecords: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
}

export interface LanguageResponse {
  name: string;
  code: string;
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  exchangeRateFromUSDToCurrency: string | null;
}

export enum NotificationChanelEnum {
  SMS = 1,
  Email = 2,
  WebApp = 3,
  MobileApp = 4,
  Telegram = 5,
  Zalo = 6,
  Slack = 7,
}

export interface PageFilter {
  [key: string]: string | number[] | string[] | null | number | undefined;
  totalPages?: number;
  totalRecords?: number;
  pageIndex?: number;
  pageNumber?: number;
  pageSize?: number;
}
