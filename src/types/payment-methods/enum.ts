export enum PaymentProviderCodeEnum {
  Paypal = 'paypal',
  Payme = 'payme',
  COD = 'cod',
  Banktransfer = 'banktransfer',
  Vietqr = 'vietqr',
  Cash = 'cash',
  Bidv = 'bidv',
  Stripe = 'stripe',
}

export enum MerchantAccountStatusEnum {
  None = -1,
  Created = 0,
  IntegrationSuccessfull = 1,
  Deactive = 2,
}

export enum StatusMarketEnum {
  Active = 1,
  Deactive = 2,
}

export enum MerchantAccountTypeEnum {
  Paypal,
  Payme,
  COD,
  BankTransfer,
  VietQR,
  Cash,
  BIDV,
  Stripe,
}
