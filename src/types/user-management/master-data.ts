export interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}
export interface CountryApi {
  id: string;
  code: string;
  name: string;
  prefixPhoneNumber: string;
  defaultLanguageCode: string | null;
  defaultCurrencyCode: string | null;
  order: number | null;
}
