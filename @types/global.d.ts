declare global {
  interface Window {
    region?: string;
    currency?: string;
    language?: string;
    dateFormat?: string;
    timeFormat?: string;
    timeZone?: string;
  }

  type Nullable<T> = T | null;

  type Dict<T> = Record<string, T>;
}

export {};
