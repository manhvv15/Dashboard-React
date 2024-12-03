import { UserStatusEnum } from '../user-management/user';
import {
  AuthorizationConfigurationEnum,
  BidHistoryStatusEnum,
  BidLastTimeStatusEnum,
  BidMapStatusEnum,
  BidNickStatusEnum,
  BidSourceEnum,
  BidStatusEnum,
  PeriodType,
  PeriodUnit,
  PlanStatus,
  UserGenderEnum,
  UserPlanStatus,
  UserTypeEnum,
} from './enum';

export interface BidCustomerValueType {
  label: string;
  value: string;
}
export interface ConfirmAccountBlockedRequest {
  userName: string;
}

export interface CreateBiddingAccountRequest {
  type: string;
  alias: string;
  username: string;
  password: string;
  cookie: string;
  isAllowBid: boolean;
  isAutoMap?: boolean;
  note: string;
  isTax: boolean;
  isNoTax: boolean;
  buyer: string | null;
  proxyHost: string | null;
  proxyPort: number | null;
  Proxyusername: string | null;
  Proxypassword: string | null;
  isActive: boolean;
  isAutoGetSuccessfulBid: boolean;
  proxyWorkspaceId: string;
}

export interface DeactivateBidCreditByAdminRequest {
  customerId: string;
}

export interface ExecuteBidAccountRequest {
  username: string;
  isStart: boolean;
}

export interface MapSuccessfulBidRequest {
  successfulBidId: string;
  customerId: string;
  isOnlyCreateOrder: boolean;
}

export interface RemoveBidAccountRequest {
  id: string;
}

export interface UpdateBidAccountRequest {
  id: string;
  cookie?: string;
  note?: string;
  isTax?: boolean;
  isNoTax?: boolean;
  buyer?: string;
  proxyHost?: string;
  proxyPort?: number;
  proxyUsername?: string;
  proxyPassword?: string;
  password?: string;
  isAllowBid?: boolean;
  proxyWorkspaceId: string;
  isAutoGetSuccessfullBid?: boolean;
  typeTimeGetSuccessfull?: number;
}

export interface UpdateBidConfigRequest {
  coinHoldActiveVip: number;
  percentageHoldCoin: number;
  maxBid: number;
  currency: string;
}

export interface GetBiddingItemsRequest {
  pageNumber: number;
  pageSize: number;
  textSearch?: string;
  source?: BidSourceEnum[];
  bidUserName?: string[];
  mapStatus?: BidMapStatusEnum[];
  status?: BidStatusEnum[];
  bidTimeStartDate?: string;
  bidTimeEndDate?: string;
  endBidTimeStartDate?: string;
  endBidTimeEndDate?: string;
  customerId?: string;
}

export interface GetBidHistoryRequest {
  pageNumber: number;
  pageSize: number;
  source?: BidSourceEnum[];
  bidUsername?: string[];
  status?: BidHistoryStatusEnum[];
  fromBidTime?: string;
  toBidTime?: string;
  endBidTimeStartDate?: string;
  endBidTimeEndDate?: string;
  accountId?: string;
  keyword?: string;
  customerId?: string;
}

export interface GetBidNickRequest {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  readyToBid?: number;
  allowBid?: number;
  customerId?: string;
  status?: number[];
  ranking?: number;
}

export interface GetDropdownBidNickRequest {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  sourceCode?: string;
}

export interface GetLoseBidItemsRequest {
  pageNumber: number;
  pageSize: number;
  textSearch?: string;
  source?: BidSourceEnum[];
  bidUserName?: string[];
  mapStatus?: BidMapStatusEnum[];
  status?: BidStatusEnum[];
  bidTimeStartDate?: string;
  bidTimeEndDate?: string;
  endBidTimeStartDate?: string;
  endBidTimeEndDate?: string;
  customerId?: string;
}

export interface GetSniperBidRequest {
  pageNumber: number;
  pageSize: number;
  textSearch?: string;
  source?: BidSourceEnum[];
  bidUserName?: string[];
  status?: BidLastTimeStatusEnum[];
  bidTimeStartDate?: string;
  bidTimeEndDate?: string;
  endBidTimeStartDate?: string;
  endBidTimeEndDate?: string;
  customerId?: string;
}

export interface GetSuccessfulBidNow {
  userName: string;
  isStart: boolean;
}

export interface GetVipUserRequest {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  customerId?: string;
}

export interface GetWonBidItemsRequest {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  source?: BidSourceEnum[];
  bidUserName?: string[];
  mapStatus?: BidMapStatusEnum[];
  status?: BidStatusEnum[];
  bidTimeStartDate?: string;
  bidTimeEndDate?: string;
  endBidTimeStartDate?: string;
  endBidTimeEndDate?: string;
  customerId?: string;
  isOrder?: boolean;
  isBidNow?: boolean;
  isPayCompleted?: boolean;
}

export interface UpdateMaxBidRequest {
  customerId: string;
  maxBid: number;
}

export interface GetBiddingItemsResponse {
  id: string;
  name: string;
  bidId: string | null;
  source: string | number | null;
  bidUserName: string;
  price: number;
  currentPrice: number;
  endTime: string;
  bidTime: string;
  customerCode: string;
  customerName: string;
  image: string;
  status: BidStatusEnum | null;
  mapStatus: BidMapStatusEnum | null;
}

export interface GetWonBidItemsResponse {
  id: string;
  productId: string | null;
  source: BidSourceEnum | null;
  bidUsername: string | null;
  title: string | null;
  price: number;
  sellerId: string | null;
  endDateAndTime: string | null;
  lastMessage: string | null;
  accountId: string | null;
  endDate: string | null;
  bidPrice: number | null;
  priceIncludeTax: number | null;
  userBidProductId: string | null;
  quantity: number | null;
  bids: number | null;
  mapStatus: BidMapStatusEnum;
  bidTime: string | null;
  previewImage: string | null;
  images: string | null;
  categoryCode: string | null;
  taxRate: number | null;
  createdOrder: boolean | null;
  orderCode: string | null;
  orderId: string | null;
  isCancel: boolean | null;
  isBidItNow: boolean | null;
  isPayCompleted: boolean;
  bidAccountId: string | null;
  customerName: string | null;
  customerCode: string | null;
  createdAt: string | null;
}

export interface GetLoseBidItemsResponse {
  id: string;
  name: string;
  bidId: string;
  source: string;
  bidUserName: string;
  price: number;
  currentPrice: number;
  endTime: string;
  bidTime: string;
  customerCode: string;
  customerName: string;
  image: string;
  status: BidStatusEnum;
  mapStatus: BidMapStatusEnum;
}

export interface GetBidNickResponse {
  id: string;
  type: BidSourceEnum;
  alias: string;
  username: string;
  password: string;
  status: BidNickStatusEnum;
  cookie: string;
  isAllowBid: boolean;
  isAutoMap: boolean;
  note: string;
  isTax: boolean;
  isNoTax: boolean;
  createdAt: string;
  buyer?: string;
  proxyHost?: string;
  proxyPort?: number;
  proxyUsername?: string;
  proxyPassword?: string;
  proxyWorkspaceId?: string;
  isActive: boolean;
  successfullCount: number | null;
  biddingCount: number | null;
  accountRate: number | null;
  isAutoGetSuccessfulBid: boolean;
  auctionResponse: string | null;
  typeTimeGetSuccessfull: number | null;
  customerName?: string;
  customerCode?: string;
  period?: number;
}

export interface GetBidHistoryResponse {
  id: string;
  productId?: string;
  previewImage?: string;
  title?: string;
  sellerId?: string;
  source: BidSourceEnum;
  bidUsername?: string;
  placedPrice: number;
  suggestedPrice?: number;
  status: any; //State;
  bidTime: string;
  accountId: string;
  customerCode?: string;
  customerName?: string;
  auctionResponse?: string;
  isBuyItNow: boolean;
  productName: string | null;
}

export interface GetBidConfigResponse {
  coinHoldActiveVip: number;
  percentageHoldCoin: number;
  maxBid: number;
}

export interface GetSniperBidResponse {
  id: string;
  name: string;
  bidId: string;
  source: string;
  bidUserName: string;
  price: number;
  currentPrice: number;
  endTime: string;
  bidTime: string;
  customerCode: string;
  customerName: string;
  image: string;
  status: BidLastTimeStatusEnum;
  mapStatus: BidMapStatusEnum;
}

export interface GetVipUserResponse {
  customerId: string;
  phoneNumber: string;
  fullName: string;
  userCode: string;
  email: string;
  totalBidCredit: number;
  totalBidLastTimeCredit: number;
  maxBid: number;
}

export interface GetPlanOfBidRequest {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  periodType?: PeriodType[];
  status?: PlanStatus[];
  marketId?: string;
}

export interface GetSubscriberForBidsRequest {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  periodType?: PeriodType[];
  status?: PlanStatus[];
  customerId?: string;
  marketId?: string;
}

export interface GetPlanOfBidResponse {
  id: string;
  workspaceId: string;
  planName: string;
  currency: string;
  marketId: string;
  price: number;
  startDate: string;
  endDate: string;
  period: number;
  periodUnit: PeriodUnit;
  periodType: PeriodType;
  includeVat: boolean;
  bidCount: number;
  isLimitBidCount: boolean;
  status: number;
  numberOfBuyers: number;
  createdAt: string;
  countBuy: number;
  isCountBuy: boolean;
  customerIds: string[];
}

export interface GetSubscriberForBidsResponse {
  id: string;
  planCreditId: string;
  marketId: string;
  price: number;
  currency: string;
  startDatePlan: string;
  endDatePlan: string;
  period: number;
  periodUnit: PeriodUnit;
  periodType: PeriodType;
  includeVat: boolean;
  bidCount: number;
  isLimitBidCount: boolean;
  customBidCount: number;
  status: UserPlanStatus;
  invoiceId: string;
  startDateActivePlan: string;
  endDateActivePlan: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  customerPrefixPhoneNumber: string;
  customerGender: UserGenderEnum;
  createdAt: string;
  planName: string;
  isCancelCustomBidCount?: boolean;
}

export interface IPlanOfBidFormType {
  id?: string;
  marketId?: string;
  planName: string;
  startDate: string;
  endDate: string;
  periodType: PeriodType;
  period: number;
  periodUnit: PeriodUnit;
  price?: number | string;
  currency: string;
  includeVat: boolean;
  isLimitBidCount: boolean;
  bidCount?: number;
  status: PlanStatus;
  isUseCustomer?: boolean;
  customerIds?: string[];
  numberOfBuyers?: number;
  isCountBuy?: boolean;
  countBuy?: number;
}
export interface IPlanOfBidRequest {
  id: string;
  marketId: string;
  planName: string;
  startDate: Date | string;
  endDate: Date | string;
  periodType: PeriodType;
  period: number;
  periodUnit: PeriodUnit;
  price?: number | string;
  currency: string;
  includeVat: boolean;
  isLimitBidCount: boolean;
  bidCount?: number;
  status: PlanStatus;
}

export interface UpdateSubscriberForBidsStatus {
  planUserId: string;
  customerId: string;
  status: UserPlanStatus;
  marketId: string;
}

export interface UpdateCustomBidCountRequest {
  planUserId: string;
  customerId: string;
  addBidCustom: number;
  isCancelCustomBidCount?: boolean;
  marketId: string;
}

export interface GetUserLevel2Request {
  pageNumber: number;
  pageSize: number;
  textSearch?: string;
  tagIds?: string[] | null;
  groupIds?: string[] | null;
  gender?: UserGenderEnum | null;
  countryCode?: string[] | null;
  subscribeType?: 1 | 2 | null;
  identification?: boolean | null;
  userCodeGenerationDateFrom?: string | null;
  userCodeGenerationDateTo?: string | null;
  createdAtFrom?: string | null;
  createdAtTo?: string | null;
  statusWallet?: string | null;
  userType?: UserTypeEnum;
}

export interface UserLV2 {
  id: string;
  workSpaceId: string;
  countryCode: string;
  gender: number;
  createdAt: string;
  subscribeType: number;
  userCodeGenerationDate: string;
  identification: boolean;
  code: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  prefixPhoneNumber: string;
  status: UserStatusEnum;
  userRanking: null | string;
  walletStatus: null | string;
  walletName: null | string;
  activedWalletDate: null | string;
  facebookLink: null | string;
  zaloLink: null | string;
  wechatLink: null | string;
  userGroupName: string;
  tagName: string;
  activeAt: null | string;
  note: null | string;
  receiveEmail: null | boolean;
  address: null | ICustomerAddress;
  avatarUrl: null | string;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  verification: boolean;
  activedAt: string;
}

export interface ICustomerAddress {
  countryId: string | null;
  cityId: string | null;
  districtId: string | null;
  wardId: string | null;
  postalCode: string | null;
}

export interface IPageListResult<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  items: T[];
  summaries?: { [key: string]: number | null } | null;
}

export interface GetUserLV2 extends IPageListResult<UserLV2> {}

export type OptionSelect = {
  disabled?: boolean;
  label?: string;
  value?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export interface EditNickFormType {
  source: string;
  nickBid: string;
  alias: string;
  password: string;
  note: string;
  proxyWorkspaceId: string;
  proxyHost: string;
  proxyPort: string;
  proxyUsername: string;
  proxyPassword: string;
  cookie: string;
  customer?: BidCustomerValueType;
  isActive: boolean;
  isAllowBid: boolean;
  isTax: boolean;
  isNoTax: boolean;
  isAutoGetSuccessfulBid: boolean;
}

export interface DataDateRangePicker {
  startDate: Date;
  endDate: Date;
  key: string;
}

export interface RegisterGetSuccessfulBidReminderRequest {
  userName: string;
  isAutoGetSuccessfulBid: boolean;
  period?: number;
}

export interface AuthorizationConfigurationRequest {
  workspaceIds: string[];
  authorizeBidType: AuthorizationConfigurationEnum;
}

export interface GetBidConfigResponse {
  id: string;
  workspaceId: string;
  workspaceName: string;
  authorizeBidType: AuthorizationConfigurationEnum;
}

export interface GetBidConfigRequest {
  authorizeBidType: AuthorizationConfigurationEnum | null;
  workspaceIds: string[] | null;
  pageNumber: number;
  pageSize: number;
}

export interface GetAllWorkspaceResponse {
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  authorizeBidType: AuthorizationConfigurationEnum;
}
