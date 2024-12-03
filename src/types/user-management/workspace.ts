import { PeriodTypeEnum } from '@/constants/enums/common';
import { PaymentStatusEnum } from '../enums/payment';
import { PaginationRequest } from './common';

export interface WorkspaceBySlug {
  countryCode: string;
  created: string;
  email: string;
  id: string;
  isOwner: boolean;
  name: string;
  slug: string;
}

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  createAt: string;
}

export interface WorkspaceManagementRequest extends PaginationRequest {
  sorting: string | null | undefined;
}
export interface GetContactPointByWorkspaceRequest extends PaginationRequest {
  workspaceId: string;
}

export enum ContactPointEnum {
  Technical = 1,
  Accounting = 2,
  Delivery = 3,
  Administrator = 4,
  CLevel = 5,
  HeadLevel = 6,
  Others = 7,
}

export interface GetContactPointByWorkspaceResponse {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: number;
  contactPoint: ContactPointEnum;
  createdAt: string;
  createdBy: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  prefixPhoneNumber: string;
  isDefault: boolean;
  isReceiveInvoice: boolean;
}
export interface GetManagementWorkspaceQueryResponse {
  id: string;
  slug: string;
  name: string;
  countryCode: string | null;
  countryName: string | null;
  market: string | null;
  billingEmail: string;
  phoneNumber: string | null;
  userCount: number | null;
  customerCount: number | null;
  applicationCount: number | null;
  marketCount: number | null;
  createdAt: string | null;
  createBy: string | null;
  owner: string | null;
  unpaidAmount: number;
  monthlyRecurringRevenue: number;
  netPayment: number;
  currencyCode: string | null;
  subscriptions: SubscriptionInforResponse[];
  markets: MarketResponse[];
  wallets: WalletResponse[];
  status: StatusEnum;
}

export enum SubscriptionStatusEnum {
  Active = 1,
  WattingPayment = 2,
  RequestCancel = 3,
  Canceled = 4,
  Expired = 5,
  Trial = 6,
}

export interface SubscriptionInforResponse {
  id: string;
  workspaceId: string;
  name: string;
  status: SubscriptionStatusEnum;
  amount: number | null;
  currencyCode: string | null;
  periodType: string | null;
}

export interface MarketResponse {
  id: string;
  workspaceId: string;
  name: string;
}

export interface WalletResponse {
  balance: number;
  currency: string;
}

export enum WorkspaceSizeEnum {
  ExtraSmall = 1,
  Small = 2,
  Medium = 3,
  Large = 4,
  ExtraLarge = 5,
}

export enum WorkspaceTypeEnum {
  Private = 1,
  Public = 2,
  MultiNational = 3,
  Government = 4,
  Other = 5,
}

export interface GetCompanyDetailRequest {
  workspaceId: string;
}

export interface GetCompanyDetailByWorkspaceIdResponse {
  workspaceId: string;
  name: string;
  email: string | null;
  prefixPhoneNumber: string | null;
  phoneNumber: string | null;
  logoUrl: string | null;
  address: string | null;
  senderId: string | null;
  countryCode: string | null;
  slug: string;
  size: WorkspaceSizeEnum | null;
  type: WorkspaceTypeEnum | null;
  workspaceName: string;
  countryCodePhoneNumber: string | null;
  createdBy: string | null;
  numberOfUsers: number | null;
  workspaceStatus: StatusEnum;
}

export enum StatusEnum {
  Active = 0,
  Deactive = 1,
}
export interface ApplicationByWorkspaceResponse {
  applicationId: string;
  applicationName: string;
  applicationLogoUrl: string;
  applicationUrl: string;
  applicationUserCount: number;
  planId: string | null;
  planName: string | null;
  subscriptionFixedFee: number;
  subscriptionCurrencyCode: string | null;
  subscriptionPeriodType: string | null;
  subscriptionId: string;
  subscriptionStartDate: string | null;
  subscriptionExpiredDate: string | null;
  subscriptionStatus: SubscriptionStatusEnum;
  url: string;
  paymentStatus: PaymentStatusEnum;
  invoiceId: string;
  subscriptionIsLatter: boolean;
}

export interface DeleteWorkspaceRequest {
  workspaceId: string;
  reason: string;
}

export interface GetAvailablePlansByWorkspaceResponse {
  planId: string;
  applicationId: string;
  planName: string;
  applicationName: string;
}
export interface CalculateFeeMultipleRequest {
  planIds: string[];
  includeConfig: boolean;
  currencyCode: string;
  customerId: string | null;
}
export interface CalculateFeeMultipleResponse {
  planId: string;
  planName: string;
  applicationId: string;
  applicationName: string;
  fee: CalculateFeeQueryResponse;
}

export interface CalculateFeeQueryResponse {
  feeId: string;
  feePeriod: CalculateFeePeriodQueryResponse;
  feeByServices: CalculateFeeServiceQueryResponse[];
  billing: BillingResponse;
}
export interface CalculateFeePeriodQueryResponse {
  amount: number | null;
  currencyCode: string | null;
  periodType: PeriodTypeEnum;
  number: number;
  periodTypeValue: PeriodTypeValueEnum;
  periodTypeName: string;
  periodDisplay: string;
}

export enum PeriodTypeValueEnum {
  Days = 0,
  Month = 1,
  Quarters = 2,
  Years = 3,
}

export interface BillingResponse {
  trialType: TrialTypeEnum;
  number: number;
  trialTypeValue: TrialTypeValueEnum;
  billingCycle: BillingCycleEnum;
  autoRenew: boolean;
}

export enum TrialTypeEnum {
  NoTrial = 0,
  Weekly = 1,
  Monthly = 2,
  Quarterly = 3,
  Yearly = 4,
  Customize = 5,
}
export enum TrialTypeValueEnum {
  Days = 0,
  Weeks = 1,
  Months = 2,
  Quarters = 3,
  Years = 4,
}

export enum BillingCycleEnum {
  Start = 0,
  End = 1,
}

export interface CalculateFeeServiceQueryResponse {
  planId: string;
  serviceName: string;
  amount: number | null;
  currencyCode: string | null;
  isSuccess: boolean;
  errorMessage: string | null;
  calculatorResult: CalculatorResult;
}

export interface CalculatorResult {
  chargeModel: ChargeModelEnum;
  chargeModelName: string;
  chargeUnit: string;
  metric: CalculateFeeMetricItem;
  formulaSummary: FormulaSummary;
  tiers: CalculatorResultTierItem[];
}
export interface CalculateFeeMetricItem {
  name: string;
  data: CalculateFeeMetricValue[];
}

export interface CalculateFeeMetricValue {
  value: number;
  unit: string;
}

export interface FormulaSummary {
  value: number | null;
  unit: string;
  formulaOfTiers: FormulaOfTier;
}
export interface FormulaOfTier {
  calculateValue: number | null;
  flatFee: number | null;
  unitFee: number | null;
  total: number | null;
}

export interface CalculatorResultTierItem {
  firstUnit: number | null;
  lastUnit: number | null;
  unit: string | null;
  flatFee: number | null;
  unitFee: number | null;
  currencyCode: string | null;
}
export enum ChargeModelEnum {
  PerUnit = 0,
  Fixed = 1,
  Percentage = 2,
  Graduated = 3,
  Volume = 4,
}

export interface CreateMultipleSubscriptionRequest {
  workspaceId: string;
  plans: {
    applicationId: string;
    planId: string;
    feeId: string;
  }[];
}

export interface CurrentUsageDataByPlanItem {
  referenceId: string | null;
  name: string | null;
  usageDataItems: UsageDataItem[] | null;
  startDate: string | null;
  endDate: string | null;
  amount: number | null;
  currencyCode: string | null;
  isFixed: boolean;
  calculatorResult: CalculatorResult | null;
}
export interface UsageDataItem {
  value: number;
  subUnit: string;
  limit: number;
}

export interface GetCurrentUsageDataBySubscriptionResponse {
  planName: string | null;
  autoRenew: boolean;
  subscriptionFixedFee: number;
  subscriptionCurrencyCode: string | null;
  subscriptionPeriodType: string | null;
  applications: ApplicationDto[];
  subscriptionExpiredDate: string | null;
  subscriptionRenewDate: string | null;
  items: CurrentUsageDataByPlanItem[];
}
export interface ApplicationDto {
  applicationLogoUrl: string;
  applicationName: string;
}
export interface GetSubscriptionDetailRequest {
  workspaceId: string;
  subscriptionId: string;
}
export interface CancelSubscriptionRequest {
  workspaceId: string;
  subscriptionId: string;
}
export interface UpdateStatusWorkspaceRequest {
  workspaceId: string;
  status: StatusEnum;
}
