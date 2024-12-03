import { AxiosResponse } from 'axios';

import { ApiPaginationResponse } from '@/types/common';
import {
  MerchantAccountTypeEnum,
  PaymentTransactionStatusEnum,
  TransactionDestinationEnum,
  TransactionSourceEnum,
  TransactionTypeEnum,
} from '@/types/enums/transaction';
import {
  GetTransactionByWorkspaceRequest,
  GetTransactionWorkspaceResponse,
  TransactionDetail,
  TransactionManagement,
} from '@/types/payment/transaction';

import { transaction } from './endpoints';

import { instance } from '../xhr';

export const getTransactions = (data: {
  pageNumber: number;
  pageSize: number;
  textSearch?: string;
  destination?: TransactionDestinationEnum;
  startDate?: string;
  endDate?: string;
  paymentStartDate?: string;
  paymentEndDate?: string;
  paymentMethods?: MerchantAccountTypeEnum[];
  types?: TransactionTypeEnum[];
  sources?: TransactionSourceEnum;
  createdByIds?: string[];
  fromAmount?: number;
  toAmount?: number;
  receiveAccounts?: string[];
  status?: PaymentTransactionStatusEnum[];
  currencies?: string[];
}): Promise<AxiosResponse<ApiPaginationResponse<TransactionManagement>>> => {
  return instance.get(transaction.getTransactions, { params: data });
};

export const detailTransaction = (data: {
  workspaceId: string;
  transactionId: string;
}): Promise<AxiosResponse<TransactionDetail>> => {
  return instance.get(transaction.detailTransaction, { params: data });
};

export const getTransactionByWorkspace = (
  params: GetTransactionByWorkspaceRequest,
): Promise<AxiosResponse<ApiPaginationResponse<GetTransactionWorkspaceResponse>>> => {
  return instance.get(transaction.getTransactionWorkspace, { params: params });
};
