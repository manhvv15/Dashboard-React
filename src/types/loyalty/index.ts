import { OptionValue } from '@ichiba/ichiba-core-ui/dist/components/multiple-select/types';

import { TransactionStatusEnum } from '../enums/payment';
import { TransactionTypeLoyaltyEnum } from '../enums/transaction';

export interface WalletSearchRequest {
  workspaceId?: string;
  keyword?: string;
  walletIds?: string[];
  createAtFrom?: string;
  createAtTo?: string;
  periodFrom?: string;
  periodTo?: string;
  currencies?: string[] | null;
  pageSize: number;
  pageNumber?: number;
}

export interface ExportTransactionsRequest {
  keyword?: string;
  walletId: string | null;
  pointTransactionIds?: string[];
  types?: OptionValue[];
  status?: OptionValue[];
  createdAtFrom?: string | null;
  createdAtTo?: string | null;
  pageNumber?: number;
  pageSize?: number;
  currencies?: string[];
  workspaceId: string;
  slug?: string;
}

export interface WalletItem {
  createAt: string;
  id: string;
  currency: string;
  totalSpend: number | null;
  priodDeposit: number | null;
  totalHold: number | null;
  totalWithdraw: number | null;
  balance: number | null;
  memberId: string;
  fullNameMember: string;
  workspaceId: string | null;
  workspaceInformation?: WorkspaceInformationResponse;
}
export interface WorkspaceInformationResponse {
  id: string;
  name: string;
  slug: string;
  companyName: string | null;
  companyAddress: string | null;
  countryCode: string | null;
  countryName: string | null;
  phoneNumber: string | null;
  prefixPhoneNumber: string | null;
  createdAt: Date;
}
export interface TransactionSearchRequest {
  workspaceId?: string;
  keyword?: string | null;
  walletIds?: string[] | null;
  types?: TransactionTypeLoyaltyEnum[] | null;
  createdFrom?: string | null;
  createdTo?: string | null;
  paymentAtFrom?: string | null;
  paymentAtTo?: string | null;
  tabIndex?: number | string | null;
  amountFrom?: number | null;
  amountTo?: number | null;
  currencies?: string[] | null;
  pageSize?: number;
  pageNumber?: number;
}
export interface TransactionItem {
  id: string;
  walletId: string;
  isIncome: boolean | null;
  amount: number | null;
  status: TransactionStatusEnum;
  type: TransactionTypeLoyaltyEnum;
  note: string | null;
  referenceCode: string;
  createdAt: Date | null;
  completionDate: string | null;
  cancellationDate: string | null;
  balance: number | null;
  code: string | null;
  userInfo: string;
  userCode?: string;
  userName?: string;
  currency: string | null;
  workspaceId: string | null;
  workspaceInformation?: WorkspaceInformationResponse;
}

export interface TransactionHistorySearchRequest {
  keyword?: string;
  walletId: string | null;
  types?: OptionValue[];
  status?: OptionValue[];
  createdAtFrom?: string | null;
  createdAtTo?: string | null;
  pageNumber?: number;
  pageSize?: number;
  currencies?: string[];
  workspaceId?: string;
}
export interface TransactionHistoryItem {
  id: string;
  isIncome: boolean | null;
  amount: number | null;
  status: TransactionStatusEnum;
  type: TransactionTypeLoyaltyEnum;
  note: string;
  referenceCode: string;
  createdAt: Date | null;
  completionDate: Date | null;
  cancellationDate: Date | null;
  balance: number | null;
  code: string;
  userInfo: string;
  currency: string;
}
export interface WalletMemberDetailResponse {
  balance: number | null;
  totalEarned: number | null;
  totalSpent: number | null;
  fullName: string;
  userCode: string;
  createAt: Date | null;
  totalHold: number | null;
  realBalance: number | null;
  totalWithdraw: number | null;
  slug: string;
  workspaceName: string;
}
