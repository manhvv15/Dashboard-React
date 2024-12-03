import { WorkspaceInformationModel } from './invoice';

import { InvoiceTypeEnum, PaymentMethodEnum, TransactionStatusEnum } from '../enums/payment';
import { MerchantAccountTypeEnum, PaymentTransactionStatusEnum, TransactionTypeEnum } from '../enums/transaction';

export interface TransactionManagement {
  id: string; // Mã định danh giao dịch
  amount: number; // Tổng tiền giao dịch
  fee: number; // Phí giao dịch
  currency: string; // Loại tiền tệ
  code: string; // Mã giao dịch
  referenceCode: string; // mã tham chiếu (có thể là mã đơn hàng gói hàng..)
  note: string; // Ghi chú Mô tả
  receiveAccount?: string;
  status: PaymentTransactionStatusEnum; // Trạng thái giao dịch (https://ichiba.atlassian.net/wiki/spaces/PS/pages/165445633/Enums+Constants)
  type: TransactionTypeEnum; // Loại giao dịch (Payment = 0 Refund = 1 Deposit = 2 Withdraw = 3 Authorize = 4 Transfer = 5)
  paymentMethod: MerchantAccountTypeEnum; // Phương thức (paypal = 0 payme = 1)
  createdAt: string; // Ngày tạo
  completionDate: string; // Ngày tạo
  metaData: string;
  applicationId: string; // id của ứng dụng phát sinh giao dịch
  applicationCode: string; // mã của ứng dụng phát sinh giao dịch
  applicationName: string; // tên của ứng dụng phát sinh giao dịch
  customerName: string; // tên của khách hàng
  customerId: string; // id của khách hàng
  customerCode: string; // mã của khách hàng
  invoices: {
    id: string; // id của invoice
    code: string; // mã của invoice
  }[];
  address: AddressTransaction;
  workspaceInformation?: WorkspaceInformationModel;
}
export interface AddressTransaction {
  customerId: string;
  fullName: string;
  countryName: string;
  countryCode: string;
  customerCode: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  phoneNumber: string;
  prefixPhoneNumber: string;
  address: string;
  postCode: string;
  email: string;
}
export interface TransactionDetail {
  id: string;
  amount: null | number;
  fee: null | number;
  createByName: string;
  currency: string;
  customerId: string;
  code: string;
  referenceCode: string;
  note: string;
  refundReason?: string;
  receiveAccount?: string;
  file?: string;
  status: PaymentTransactionStatusEnum;
  type: TransactionTypeEnum;
  merchantAccountType: MerchantAccountTypeEnum;
  paymentMethod: MerchantAccountTypeEnum;
  paymentIntentType: string;
  createdAt: string | null;
  updatedAt: string | null;
  metaData: string | null;
  address: AddressTransaction;
  workspaceInformation?: WorkspaceInformationModel;
  invoices: TransactionInvoices[];
}
export interface TransactionInvoices {
  id: string;
  code: string;
  totalAmount: string | null;
  remainingAmount: number | null;
  paidAmount: number | null;
  type: InvoiceTypeEnum;
  invoiceAllocatedAmt: number | null;
  invoiceAllocatedCoinAmt: number | null;
}

export interface GetTransactionByWorkspaceRequest {
  createdFrom?: string;
  status?: TransactionStatusEnum[];
  createdTo?: string;
  paymentTimeFrom?: string;
  paymentTimeTo?: string;
  transactionTypes?: TransactionTypeEnum[];
  currencies?: string[];
  methods?: PaymentMethodEnum[];
  fromAmount?: number;
  toAmount?: number;
  workspaceId: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface GetTransactionWorkspaceResponse {
  id: string;
  currency: string;
  code: string;
  amount: number;
  referenceCode: string;
  note: string;
  receiveAccount?: string;
  status: TransactionStatusEnum;
  type: TransactionTypeEnum;
  paymentMethod: MerchantAccountTypeEnum;
  createdAt: string;
  completionDate: string;
  metaData: string;
  applicationId: string;
  applicationCode: string;
  applicationName: string;
  customerName: string;
  customerId: string;
  customerCode: string;
  invoices: {
    id: string;
    code: string;
  }[];
  workspaceInformation?: WorkspaceInformationModel;
}
