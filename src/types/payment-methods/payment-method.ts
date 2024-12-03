import { MerchantAccountStatusEnum, MerchantAccountTypeEnum, PaymentProviderCodeEnum } from './enum';

export interface PaymentMethod {
  id: string;
  code: PaymentProviderCodeEnum;
  name: string;
  description: string;
  logo: string;
  payTypeSupports: string[];
  registerMerchantAccountLink: string;
  hasMerchantAccount: boolean;
  isActive: boolean;
  payTypeSelected?: string;
  marketIds: string[];
}
export interface MerchantAccountActive {
  id: string;
  name: string;
  type: MerchantAccountTypeEnum;
  status: MerchantAccountStatusEnum;
  order: number;
  priorityLevel: number;
  isDefault: boolean;
  logo: string;
  bankAccounts: {
    id: string;
    bin: string;
    bankName: string;
    bankShortName: string;
    accountNumber: string;
    accountHolder: string;
    note: string;
    isDefault: true;
    phoneNumber: string;
    email: string;
    identification: string;
    virtualAccount: string;
    isAutoConfirmOrder: boolean;
    merchantAccountId: string;
  }[];
}

export interface Paypal {
  name: string;
  status: MerchantAccountStatusEnum;
  externalAccounts: {
    clientId: string;
    clientSecrect: string;
    id: string;
    isActive: boolean;
    isDefault: boolean;
    marketIds: string;
    paymentFeeFixed: number;
    paymentFeePercent: number;
  }[];
}

export interface MerchantAccountPaymeInfo {
  name?: string;
  xapiClient?: string;
  privateKey?: string;
  publicKey?: string;
  payType?: string;
  workspaceId?: string;
  status: MerchantAccountStatusEnum;
  apiEndPoint: string;
  paymePublicKey: string;
}

export interface ListBidv {
  note: string;
  status: MerchantAccountStatusEnum;
  bankAccounts: BidvDetail[];
}

export interface BidvDetail {
  id: string;
  bin: string;
  bankName: string;
  bankShortName: string;
  accountNumber: string;
  accountHolder: string;
  note: string;
  isDefault: boolean;
  phoneNumber: string;
  email: string;
  identification: string;
  virtualAccount: string;
  isAutoConfirmOrder: boolean;
}

export interface OverviewQR {
  qrContent: string;
  qrContentURL: string;
  transactionId: string;
}

export interface MerchantKeyAccount {
  privateKey?: string;
  publicKey?: string;
}

export interface StripeDetail {
  name: string;
  status: 1;
  externalAccounts: [
    {
      id: string;
      name: string;
      publishableKey: string;
      secretKey: string;
      paymentFeePercent: number;
      paymentFeeFixed: number;
      isDefault: boolean;
      isActive: boolean;
      marketIds: string;
    },
  ];
}
