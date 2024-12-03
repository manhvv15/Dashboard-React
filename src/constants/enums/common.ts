export enum Language {
  EN = 'en',
  VI = 'vi',
  JA = 'ja',
}

export enum LocaleNamespace {
  Common = 'common',
  Menu = 'menu',
  Error = 'error',
  Customer = 'customer',
  Ship4p = 'ship4p',
  Pim = 'pim',
  Bid = 'bid',
}

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}
export enum StatusPlanEnum {
  Active = 0,
  Deactivate = 1,
}
export enum StatusApplicationEnum {
  Active = 1,
  Deactivate = 2,
  ComingSoon = 3,
}
export enum UnitServiceModelEnum {
  Weight,
  Package,
  PackageItem,
  PackageValue,
  ShipmentValue,
  Shipment,
  Order,
  OrderValue,
  OrderItem,
  PackageCod,
}

export enum PeriodTypeValueEnum {
  Days = 0,
  Month = 1,
  Quarters = 2,
  Years = 3,
}
export enum TrialTypeValueEnum {
  Days = 0,
  Weeks = 1,
  Months = 2,
  Quarters = 3,
  Years = 4,
}
export enum BillingCycleEnum {
  Start = 0,
  End = 1,
}

export enum ChargeModelEnum {
  PerUnit = 0,
  Fixed = 1,
  Percentage = 2,
  Graduated = 3,
  Volume = 4,
}
export enum PeriodTypeEnum {
  Weekly = 0,
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
  Customize = 4,
}
export enum TrialTypeEnum {
  NoTrial = 0,
  Weekly = 1,
  Monthly = 2,
  Quarterly = 3,
  Yearly = 4,
  Customize = 5,
}
