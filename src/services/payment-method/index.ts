import { AxiosResponse } from 'axios';

import { PaymentMethodEnum } from '@/types/enums/payment';
import { MerchantAccountTypeEnum, PaymentProviderCodeEnum } from '@/types/payment-methods/enum';
import {
  ListBidv,
  MerchantAccountActive,
  MerchantAccountPaymeInfo,
  MerchantKeyAccount,
  OverviewQR,
  PaymentMethod,
  Paypal,
  StripeDetail,
} from '@/types/payment-methods/payment-method';
import { compileRequestURL } from '@/utils/common';

import payment from './enpoint';

import { instance } from '../xhr';

export const getAllPaymentMethod = (params: {
  GetActivatedMerchantAccount?: boolean;
  keyword?: string;
}): Promise<AxiosResponse<PaymentMethod[]>> => {
  return instance.get(`${payment.getAllPaymentMethod}`, {
    params: params,
  });
};
export const merchantAccountActive = (): Promise<AxiosResponse<MerchantAccountActive[]>> => {
  return instance.get(compileRequestURL(payment.merchantAccountActive));
};
export const updateMerchantAccount = (data: {
  isActive?: boolean;
  type?: MerchantAccountTypeEnum;
  isDefault?: boolean;
  priorityLevel?: number;
  merchantAccountOrders?: { id: string; order: number }[];
}): Promise<AxiosResponse> => {
  return instance.put(payment.updateMerchantAccount, data);
};

export const deleteMerchantAccount = (data: { type: MerchantAccountTypeEnum }) => {
  return instance.delete(payment.deleteMerchantAccount, { params: data });
};

export const generateMerchantKeyAccount = (): Promise<AxiosResponse<MerchantKeyAccount>> => {
  return instance.get(payment.generateMerchantKey);
};

///PAYPAL
export const getPaypal = (): Promise<AxiosResponse<Paypal>> => {
  return instance.get(payment.getPaypal);
};
export const createPaypal = (data: {
  name: string;
  clientId: string;
  clientSecrect: string;
  paymentFeePercent: number;
  paymentFeeFixed?: number;
  marketIds?: string[];
  isActive?: boolean;
}): Promise<AxiosResponse> => {
  return instance.post(payment.createPaypal, data);
};

export const createStripe = (data: {
  name: string;
  publishableKey: string;
  secretKey: string;
  paymentFeePercent?: number;
  paymentFeeFixed?: number;
  workspaceId: string;
}): Promise<AxiosResponse> => {
  return instance.post(payment.createStripe, data);
};

export const updatePaypal = (data: {
  name: string;
  externalAccountRequest: {
    id: string;
    clientId: string;
    clientSecrect: string;
    paymentFeePercent: number;
    paymentFeeFixed?: number;
    marketIds?: string[];
    isDelete?: boolean;
    isActive?: boolean;
  };
}): Promise<AxiosResponse> => {
  return instance.put(payment.updatePaypal, data);
};
export const activePaypal = (data: { workspaceId: string; type: PaymentProviderCodeEnum; isActive: boolean }) => {
  return instance.put(payment.activePaypal, data);
};

// PAYME
export const getMerchantAccountPayme = (): Promise<AxiosResponse<MerchantAccountPaymeInfo>> => {
  return instance.get(payment.getMerchantAccountPayme);
};

export const updateMerchantAccountPayme = (data: {
  name: string;
  xapiClient: string;
  privateKey: string;
  publicKey: string;
  marketId: string;
  payType: string[];
  countryCode: string;
  isActive?: boolean;
  paymePublicKey: string;
  apiEndPoint: string;
}): Promise<AxiosResponse> => {
  return instance.put(payment.createMerchantAccountPayme, data);
};

export const createMerchantAccountPayme = (data: {
  name: string;
  xapiClient: string;
  privateKey: string;
  publicKey: string;
  marketId: string;
  payType: string[];
  countryCode: string;
  isActive?: boolean;
  paymePublicKey: string;
  apiEndPoint: string;
}): Promise<AxiosResponse> => {
  return instance.post(payment.createMerchantAccountPayme, data);
};

export const deactiveMerchantAccountPayme = (): Promise<AxiosResponse> => {
  return instance.patch(payment.deactiveMerchantAccountPayme, {});
};

//BIDV
export const addBankBidv = (data: {
  note: string;
  bankAccount: {
    accountNumber: string;
    accountHolder: string;
    note: string;
    isDefault?: boolean;
    phoneNumber?: string;
    email?: string | null;
    identification?: string;
  };
}): Promise<AxiosResponse<{ requestId: string }>> => {
  return instance.post(payment.addBanBidv, data);
};

export const getBidvs = (): Promise<AxiosResponse<ListBidv>> => {
  return instance.get<ListBidv>(compileRequestURL(payment.getBidvs));
};

export const overviewQRBidv = (data: {
  useId: string;
  body: {
    amount: number;
    accountNumber: string;
    accountHolder: string;
    bin: string;
  };
}): Promise<AxiosResponse<OverviewQR>> => {
  return instance.post<OverviewQR>(payment.overviewQRBidv, data.body, {
    headers: {
      idempotencyKey: data.useId,
    },
  });
};

export const verifyOtpBidv = (data: {
  note?: string;
  otpNumber: string;
  confirmId: string;
  bankAccount: {
    accountNumber: string;
    accountHolder: string;
    phoneNumber: string;
    email: string;
    identification: string;
    note?: string;
    isDefault: boolean;
  };
}): Promise<AxiosResponse> => {
  return instance.post(payment.verifyOtpBidv, data);
};

export const editBankAccountBidv = (data: {
  id: string;
  isDefault?: boolean;
}): Promise<AxiosResponse<{ requestId: string }>> => {
  return instance.put(payment.editBankAccountBidv, data);
};

export const deleteBidv = (data: { id: string[] }): Promise<AxiosResponse> => {
  return instance.delete(payment.deleteBidv, { params: data });
};

export const deactiveBidv = (): Promise<AxiosResponse> => {
  return instance.patch(payment.deactiveBidv, {});
};

export const updateStatusMerchantAccount = (data: {
  type: PaymentMethodEnum;
  isActive: boolean;
}): Promise<AxiosResponse<{ requestId: string }>> => {
  return instance.put(payment.updateStatusMerchantAccount, data);
};

///Stripe
export const getStripe = (): Promise<AxiosResponse<StripeDetail>> => {
  return instance.get(payment.getStripe);
};

export const updateStripe = (body: {
  name: string;
  workspaceId: string;
  externalAccountRequest: {
    id: string;
    publishableKey: string;
    secretKey: string;
    paymentFeePercent?: number;
    paymentFeeFixed?: number;
    isActive: boolean;
    isDelete: boolean;
  };
}): Promise<AxiosResponse<StripeDetail>> => {
  return instance.put(payment.updateStripe, body);
};
