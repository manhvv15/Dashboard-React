export enum TransactionDestinationEnum {
  Wallet,
  BankAccount,
  BankCardLink,
  BankCard,
  Paypal,
  MerchantPayme,
  MerchantPaypal,
  BankCardLinkToMerchant,
}

export enum FilterCodeTransactionEnum {
  All,
  TransactionCode,
  CustomerNameOrCode,
  ReferenceCode,
}
export enum MerchantAccountTypeEnum {
  Paypal,
  Payme,
  COD,
  BankTransfer,
  VietQR,
  Cash,
  BIDV,
  PaymeDirect = 80,
  PaymeWallet = 90,
  Point = 100,
}

export enum TransactionTypeLoyaltyEnum {
  Add = 0,
  Spend = 1,
  // Reward = 2,
  // Gift = 3,
  WithDraw = 4,
  Cashback = 5,
  Refund = 7,
}
export enum TransactionTypeEnum {
  /// <summary>
  /// giao dịch thanh toán
  /// </summary>
  Payment = 0,
  /// <summary>
  /// giao dịch hoàn tiền
  /// </summary>
  Refund = 1,
  /// <summary>
  /// giao dịch nạp tiền
  /// </summary>
  Deposit = 2,
  /// <summary>
  /// giao dịch rút tiền
  /// </summary>
  Withdraw = 3,
  /// <summary>
  /// giao dịch ủy quyền (đối với paypal)
  /// </summary>
  Authorize = 4,
  /// <summary>
  /// giao dịch chuyển tiền
  /// </summary>
  Transfer = 5,
  /// <summary>
  /// giao dịch merchant tự động charge tiền theo dạng authorize
  /// </summary>
  AutoCharge = 6,
  /// <summary>
  /// giao dịch capture (đối với paypal), ko lưu giá trị này vào trong DB
  /// </summary>
  Capture = 7,
  /// <summary>
  /// giao dịch merchant tự động charge tiền theo dạng capture
  /// </summary>
  AutoChargeCapture = 8,
}

export enum TransactionSourceEnum {
  Wallet,
  BankAccount,
  BankCardLink,
  AtmCard,
  Paypal,
  MerchantPayme,
  BankCardLinkToMerchant,
}
export enum PaymentTransactionStatusEnum {
  Created = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
  Canceled = 4,
}
