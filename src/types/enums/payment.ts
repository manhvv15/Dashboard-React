export enum FilterCodeInvoiceEnum {
  ALL,
  InvoiceCode,
  CustomerNameCode,
  ReferenceCode,
}

export enum PaymentStatusEnum {
  Unpaid = 0,
  Paid = 1,
  Refund = 2,
  UnRefund = 3,
  PartialPaid = 4,
  PartialRefunded = 5,
}
export enum InvoiceStatusEnum {
  Draft = 0,
  Final = 1,
  Canceled = 2,
}
export enum InvoiceTypeEnum {
  /// <summary>
  /// Đơn bán trading
  /// </summary>
  TradingOrder = 0,

  /// <summary>
  /// Đơn mua hộ
  /// </summary>
  CrossBorderOrder = 1,

  /// <summary>
  /// Shipment
  /// </summary>
  Shipment = 2,

  /// <summary>
  /// Package
  /// </summary>
  Package = 3,

  /// <summary>
  /// Nạp point
  /// </summary>
  DepositPoint = 4,

  /// <summary>
  /// PO Yêu cầu thanh toán thêm đơn hàng
  /// </summary>
  SaleOrderRequestPayment = 5,

  /// <summary>
  /// PO Yêu cầu thanh toán thêm đơn hàng
  /// </summary>
  SaleOrderCancelPenalty = 6,

  /// <summary>
  /// Hoàn tiền cho khách hàng
  /// </summary>
  SaleOrderRefund = 7,
  /// <summary>
  /// Đơn trả hàng
  /// </summary>
  SaleOrderReturn = 8,
  /// <summary>
  /// Mua Bid credit
  /// </summary>
  BidCredit = 9,
  /// <summary>
  /// Mua Subscription
  /// </summary>
  Subscription = 10,
  /// <summary>
  /// Tính phí theo mức sử dụng
  /// </summary>
  PayAsYouGo = 11,

  /// <summary>
  /// Tính phí shipping shipment ship4p
  /// </summary>
  PayShipmentShip4p = 12,
}
export enum TransactionStatusEnum {
  OnHold = 0,
  Completed = 1,
  Canceled = 2,
}
export enum TransactionPaymentStatusEnum {
  /// <summary>
  /// giao dịch khởi tạo
  /// </summary>
  Created = 0,

  /// <summary>
  /// giao dịch đã hoàn thành
  /// </summary>
  Completed = 1,

  /// <summary>
  /// giao dịch thất bại
  /// </summary>
  Failed = 2,

  /// <summary>
  /// giao dịch đã hoàn tiền
  /// </summary>
  Refunded = 3,

  /// <summary>
  /// giao dịch đã hủy
  /// </summary>
  Canceled = 4,
}
export enum ReferenceTypeEnum {
  /// ITEM
  /// <summary>
  /// Sản phẩm trading
  /// </summary>
  ProductTrading = 0,

  /// <summary>
  /// Sản phẩm crawler
  /// </summary>
  ProductCrawler = 1,

  /// <summary>
  /// Cod
  /// </summary>
  Cod = 7,

  /// <summary>
  /// Nạp point
  /// </summary>
  DepositPoint = 9,

  /// <summary>
  /// Invoice
  /// </summary>
  Invoice = 10,

  /// Service
  /// <summary>
  /// Dịch vụ cho package
  /// </summary>
  PackageService = 2,

  /// <summary>
  /// Phí thanh toán hộ
  /// </summary>
  PaymentFee = 3,

  /// <summary>
  /// Phí sử dụng dịch vụ
  /// </summary>
  ServiceFee = 4,

  /// <summary>
  /// Phí vận chuyển
  /// </summary>
  ShippingFee = 5,

  /// <summary>
  /// Phí dịch vụ cho shipment
  /// </summary>
  ShipmentService = 6,

  /// <summary>
  /// Surcharge
  /// </summary>
  Surcharge = 8,

  /// <summary>
  /// Tiền hoàn
  /// </summary>
  RefundAmount = 11,

  /// <summary>
  /// Tiền phạt hủy đơn
  /// </summary>
  SaleOrderCancelPenaltyAmount = 12,

  /// <summary>
  /// Phí vận chuyển nội địa
  /// </summary>
  DomesticShippingFee = 13,

  /// <summary>
  /// Phí vận chuyển kho thu hộ
  /// </summary>
  ProxyCod = 14,

  /// Promotion
  /// <summary>
  /// Giảm giá hàng bán
  /// </summary>
  DiscountGoodFee = 15,
}
export enum TransactionTypesEnum {
  Add = 0,
  Spend = 1,
  Reward = 2,
  Gift = 3,
  WithDraw = 4,
  Cashback = 5,
  //[Display(Name = "Cancel hold")]
  //CancelOnHold = 6,
  Refund = 7,
}

export enum PaymentMethodEnum {
  Paypal = 0,

  /// <summary>
  /// Thanh toán bằng ví Payme (tiền ngân hàng)
  /// PaymeLink: link thanh toán ở payme
  /// </summary>
  Payme = 1,
  COD = 2,
  BankTransfer = 3,
  VietQR = 4,
  Cash = 5,
  BIDV = 6,
  Stripe = 7,

  /// <summary>
  /// Thanh toán bằng Tiền từ ví Payme
  /// Trả về QR content
  /// </summary>
  PaymeDirect = 80,

  /// <summary>
  /// Thanh toán bằng Tiền từ ví Payme
  /// </summary>
  PaymeWallet = 90,

  /// <summary>
  /// Thanh toán bằng coin
  /// Chỉ dùng với PaymentTransactionClassificationEnum.Point
  /// </summary>
  Point = 100,
}
