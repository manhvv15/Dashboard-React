import { AxiosResponse } from 'axios';

import { ApiPaginationResponse } from '@/types/common';
import {
  ExportTransactionsRequest,
  TransactionHistoryItem,
  TransactionHistorySearchRequest,
  TransactionItem,
  TransactionSearchRequest,
  WalletItem,
  WalletMemberDetailResponse,
  WalletSearchRequest,
} from '@/types/loyalty';

import { loyalty } from './endpoint';

import { instance } from '../xhr';

export const exportTransactionAll = (data: ExportTransactionsRequest): Promise<AxiosResponse<any>> => {
  return instance.get(`${loyalty.exportTransactions}`, { params: data, responseType: 'blob' });
};
export const getWalletPaging = (
  data: WalletSearchRequest,
): Promise<AxiosResponse<ApiPaginationResponse<WalletItem>>> => {
  return instance.get(loyalty.getWalletPaging, {
    params: data,
  });
};
export const getWallets = (): Promise<AxiosResponse<WalletItem[]>> => {
  return instance.get(loyalty.getListWallet, {});
};
export const getTransactionPaging = (
  data: TransactionSearchRequest,
): Promise<AxiosResponse<ApiPaginationResponse<TransactionItem>>> => {
  return instance.get(loyalty.getTransactionPaging, {
    params: data,
  });
};

export const getTransactionHistory = (
  data: TransactionHistorySearchRequest,
): Promise<AxiosResponse<ApiPaginationResponse<TransactionHistoryItem>>> => {
  return instance.get(loyalty.getTransacitonHitoryForWallet, {
    params: data,
  });
};

export const getTransactionCustomer = (data: {
  workspaceId: string;
  walletId: string;
  currency?: string;
}): Promise<AxiosResponse<WalletMemberDetailResponse>> => {
  return instance.get(loyalty.getTransactionForCustomer, {
    params: data,
  });
};
