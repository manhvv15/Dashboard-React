import {
  InvoiceStatusEnum,
  InvoiceTypeEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  ReferenceTypeEnum,
  TransactionStatusEnum,
} from '../enums/payment';
import { TransactionTypeEnum } from '../enums/transaction';

export interface GetInvoicesRequest {
  pageNumber: number;
  pageSize: number;
  search?: string;
  createdFrom?: string | null;
  createdTo?: string | null;
  postedDateFrom?: string | null;
  postedDateTo?: string | null;
  customerId?: string;
  currencies?: string[];
  paymentStatus?: PaymentStatusEnum[];
  status?: InvoiceStatusEnum[];
  type?: InvoiceTypeEnum[];
  includeTransaction?: boolean;
  includeTransactionInComplete?: boolean;
  referenceId?: string[];
  fromTotalAmount?: number;
  toTotalAmount?: number;
  fromPaidAmount?: number;
  toPaidAmount?: number;
  fromRemainingAmount?: number;
  toRemainingAmount?: number;
  fromRefundAmount?: number;
  toRefundAmount?: number;
}
export interface InvoiceManagement {
  id: string;
  workspaceId: string;
  referenceId: string;
  referenceCode: string;
  customerId: string;
  marketId: null | string;
  createdAt?: string;
  code: string;
  currencyCode: string;
  status: InvoiceStatusEnum; // InvoiceStatusEnum
  paymentStatus: PaymentStatusEnum; // PaymentStatusEnum
  type: InvoiceTypeEnum; // InvoiceTypeEnum
  subTotalAmount: number; // [1] - Tổng tiền InvoiceItem
  discountGoodsFeeAmount: null | number; // [2] -  Giá trị chiết khấu cho sản phẩm
  totalTaxAmount: number; // [5] -  tổng tiền thuế
  paidAmount: number; // [3] -  Số tiền đã thanh toán (đã bao gồm coin [11])
  remainingAmount: number; // [4] - Tổng tiền cần thanh toán (TotalAmount - PaidAmount)
  totalAmount: number; // Tổng tiền phải thu ban đầu: ( Đã trả + chưa trả )  ([1] + [5] + [6] - [2] - [9] - [10] ]
  paymentDate: null | string; // Thời điểm thanh toán
  totalShippingFeeAmount: null | number; // [6] Tổng tiền phí vận chuyển
  discountShippingFeeAmount: null | number; // [9] Giá trị chiết khấu cho phí vận chuyển
  discountServicesFeeAmount: null | number; // [10] Giá trị chiết khấu cho phí dịch vụ
  paidCoinQuantity: null | number; // Số coin đã thanh toán
  paidCoinAmount: null | number; // [11]  Số  tiền đã thanh toán bằng coin
  billingAddress: {
    AddressBookId: string;
    FullName: string;
    CountryId: string;
    CountryName: string;
    CountryCode: string;
    ProvinceId: string;
    ProvinceName: string;
    DistrictId: string;
    DistrictName: string;
    WardId: string;
    WardName: string;
    PhoneNumber: string;
    PrefixPhoneNumber: string;
    Address: string;
    PostCode: string;
    TaxNumber: string;
    Email: string;
  };
  customer: {
    id: string;
    code: null | string;
    fullName: string;
    prefixPhoneNumber: string;
    phoneNumber: string;
    email: string;
  };
  transactions: TransactionStatusEnum[]; // https://ichiba.atlassian.net/wiki/spaces/PS/pages/341442652/Enums#InvoiceTransactionViewModel;
  workspaceInformation?: WorkspaceInformationModel;
}
export interface WorkspaceInformationModel {
  id: string;
  name: string;
  slug: string;
  companyName: string | null;
  companyAddress: string | null;
  countryCode: string | null;
  countryName: string | null;
  phoneNumber: string | null;
  prefixPhoneNumber: string | null;
  createdAt?: Date;
}
export interface InvoiceDetail {
  id: string;
  createdByName: string;
  referenceId: string;
  referenceCode: string;
  customerId: string;
  marketId: string;
  code: string;
  note: string;
  currencyCode: string;
  status: InvoiceStatusEnum;
  paymentStatus: PaymentStatusEnum;
  type: InvoiceTypeEnum;
  subTotalAmount: number;
  discountValueExchangeAmount?: number;
  totalTaxAmount: number;
  paidAmount: number;
  totalRefunded: number;
  totalAmount: number;
  remainingAmount: number;
  totalShippingFeeAmount: number;
  discountShippingFeeAmount?: number;
  discountServicesFeeAmount?: number;
  paidCoinQuantity: null | number;
  paidCoinAmount: null | number;
  paymentDate: null | string;
  createdAt: string;
  updateAt: string;
  createdBy: string;
  updatedBy: string;
  transactionActiveId: string;
  items: ItemInvoice[] | null;
  invoiceTransactions: null | InvoiceTransaction[];
  billingAddress: BillingAddress | null;
  workspaceInformation?: WorkspaceInformationModel;
  postedDate?: string;
}
export interface ItemInvoice {
  id?: string | null;
  invoiceId?: null | string;
  referenceId?: null | string;
  referenceCode: null | string;
  referenceType: null | ReferenceTypeEnum;
  note: null | string;
  price: null | number;
  quantity: null | number;
  taxAmount?: null | number;
  content: null | string;
  amount: null | number;
  index?: number;
}
export interface BillingAddress {
  id: string;
  invoiceId: string;
  addressBookId: string;
  fullName: string;
  countryId: string;
  countryName: string;
  countryCode: string;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  wardId: string;
  wardName: string;
  phoneNumber: string;
  prefixPhoneNumber: string;
  address: string;
  postCode: null | string;
  taxNumber: null | number;
  email: null | string;
  customerCode: string;
}
export interface InvoiceTransaction {
  id: string;
  transactionCode: string;
  paymentIntentId: string;
  type: TransactionTypeEnum;
  status: TransactionStatusEnum;
  method: PaymentMethodEnum;
  matchingTime: null | string;
  referenceCode: string;
  description: string;
  requestBy: string;
  customerId: string;
  amount: number;
  content: string;
  contentType: number;
  qrContent: null | string;
  qrContentURL: null | string;
  paymentUrl: null | string;
  bankName: null | string;
  bankNumber: null | string;
  fullName: null | string;
  branch: null | string;
  partnerContent: null | string;
  createdAt: null | string;
  updateAt: null | string;
  createdBy: null | string;
  updatedBy: null | string;
  cash: null | number;
  coin: null | number;
  failedUrl: null | string;
  redirectUrl: null | string;
}

export interface MoreFilterInvoice {
  totalFrom?: string;
  totalTo?: string;
}
export interface IInvoiceFilerParams {
  workspaceId: string;
  pageNumber: number;
  pageSize: number;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  postedDateFrom?: string;
  postedDateTo?: string;
  paymentStatus?: PaymentStatusEnum[];
  status?: InvoiceStatusEnum[];
  fromTotalAmount?: number;
  toTotalAmount?: number;
  fromPaidAmount?: number;
  toPaidAmount?: number;
  fromRemainingAmount?: number;
  toRemainingAmount?: number;
  fromRefundAmount?: number;
  toRefundAmount?: number;
}
