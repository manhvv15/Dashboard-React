import { ApiPaginationPayload } from '../common';
import { InvoiceStatusEnum, InvoiceTypeEnum, PaymentStatusEnum } from '../enums/payment';

export interface InvoicePagingResponse {
  id: string;
  code: string;
  totalAmount: number;
  currencyCode: string;
  paymentStatus: PaymentStatusEnum;
  type: InvoiceTypeEnum;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceByIdResponse {
  id: string;
  code: string;
  isDefault: boolean;
  isSystem: boolean;
  name: string;
  applicationId: string;
  description: string;
  workspaceId: string;
  permissionIds: string[];
}

export interface InvoicePagingRequest extends ApiPaginationPayload {
  workspaceId: string | null | undefined;
  createdFrom: string | null | undefined;
  createdTo: string | null | undefined;
  currencyCode: string | null | undefined;
  fromTotalAmount: number | null | undefined;
  toTotalAmount: number | null | undefined;
  paymentStatus: PaymentStatusEnum[] | null | undefined;
  types: InvoiceTypeEnum[] | null | undefined;
}

export interface DeleteRoleResponse {
  isSuccess: boolean;
  numberOfUsers: number;
}

export interface GetInvoiceDetailRequest {
  invoiceId: string;
  workspaceId: string;
}

export interface InvoiceDetailResponse {
  id: string;
  referenceId: string | null;
  referenceCode: string;
  customerId: string;
  marketId: string | null;
  code: string;
  currencyCode: string;
  status: InvoiceStatusEnum;
  paymentStatus: PaymentStatusEnum;
  type: InvoiceTypeEnum;
  subTotalAmount: number | null;
  discountValueExchangeAmount: number | null;
  totalTaxAmount: number | null;
  paidAmount: number | null;
  totalAmount: number | null;
  remainingAmount: number | null;
  totalRefunded: number | null;
  totalShippingFeeAmount: number | null;
  discountShippingFeeAmount: number | null;
  discountServicesFeeAmount: number | null;
  paidCoinQuantity: number | null;
  paidCoinAmount: number | null;
  paymentDate: string | null;
  createdAt: string;
  updateAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  transactionActiveId: string | null;
  items: InvoiceDetailItemModel[];
  billingAddress: InvoiceAddressResponse | null;
  postedDate: string | null;
}

export interface InvoiceAddressResponse {
  id: string | null;
  invoiceId: string | null;
  addressBookId: string | null;
  fullName: string | null;
  countryId: string | null;
  countryName: string | null;
  countryCode: string | null;
  provinceId: string | null;
  provinceName: string | null;
  districtId: string | null;
  districtName: string | null;
  wardId: string | null;
  wardName: string | null;
  phoneNumber: string | null;
  prefixPhoneNumber: string | null;
  address: string | null;
  postCode: string | null;
  taxNumber: string | null;
  email: string | null;
}

export interface InvoiceDetailItemModel {
  id: string;
  invoiceId: string;
  referenceId: string | null;
  referenceCode: string;
  referenceType: InvoiceItemTypeEnum | null;
  note: string;
  price: number | null;
  quantity: number | null;
  taxAmount: number | null;
  content: string | null;
  amount: number | null;
}
export enum InvoiceItemTypeEnum {
  /// <summary>
  /// Sản phẩm trading
  /// </summary>
  ProductTrading = 0,

  /// <summary>
  /// Sản phẩm crawler
  /// </summary>
  ProductCrawler = 1,

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
  /// Cod
  /// </summary>
  Cod = 7,

  /// <summary>
  /// Surcharge
  /// </summary>
  Surcharge = 8,

  /// <summary>
  /// Nạp point
  /// </summary>
  DepositPoint = 9,

  /// <summary>
  /// Invoice
  /// </summary>
  Invoice = 10,

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
  /// <summary>
  /// Giảm giá hàng bán
  /// </summary>
  DiscountGoodFee = 15,

  AdditionalFee = 16,

  PoService = 17,
  /// <summary>
  /// Sản phẩm kĩ thuật số
  /// </summary>
  ProductDigital = 18,
}
