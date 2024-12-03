export enum PeriodType {
  Monthly = 1,
  Quarterly,
  Yearly,
  Customize,
}

export enum PlanStatus {
  Active = 1,
  InActive,
  Expired,
}

export enum PeriodUnit {
  Days,
  Weeks,
  Months,
  Quarters,
  Years,
}

export enum UserPlanStatus {
  Active = 1,
  InActive,
  Block,
  Expired,
}

export enum AllowBidEnum {
  Allowed = 1,
  NotAllowed = 2,
}

export enum BidHistoryStatusEnum {
  Success = 1,
  Fail = 2,
  PriceInValid = 3,
  BidClientBusy = 4,
  Ended = 5,
  CookieInValid = 6,
  IsBlockedBySeller = 7,
  CannotGetValueOfBidSubmitForm = 8,
}

export enum BidLastTimeStatusEnum {
  Pending = 0,
  Success = 1,
  Fail = 2,
  PriceInValid = 3,
  Deleted = 4,
  BidClientBusy = 5,
  CookieInValid = 6,
  IsBlockedBySeller = 7,
  CannotGetValueOfBidSubmitForm = 8,
  AuctionCouldNotBeAccessed = 9,
  Ended = 10,
}

export enum BidMapStatusEnum {
  New = 1,
  Success = 2,
  NotFound = 3,
  Another = 4,
}

export enum BidNickRankingEnum {
  Credibility = 1,
  NoCredibility = 2,
}

export enum BidNickStatusEnum {
  Init = 1,
  Ready = 2,
  Failed = 3,
  Stop = 4,
  BlockedByAuction = 5,
}

export enum BidSourceEnum {
  YahooAuction = 1,
  Ebay = 2,
}

export enum BidStatusEnum {
  Init = 1,
  Bidding = 2,
  HasHighest = 3,
  Fail = 4,
  Ended = 5,
  IsDeleted = 6,
  OutBid = 7,
  CancelledBySeller = 8,
  CancelledBySaleOrder = 9,
}

export enum UserTypeEnum {
  All = 0,
  CodeGenerated = 1,
  CodeNotGeneratedYet = 2,
  Activated = 3,
  NotActivated = 4,
}

export enum UserStatusEnum {
  Active = 0,
  Deactivate = 1,
}

export enum UserGenderEnum {
  Male = 1,
  Female = 2,
  Other = 3,
}

export enum SubStatusPackageEnum {
  // status failed delivery
  WaitingProcess = 0,
  Returning = 1,
  Retunred = 2,
  NonReturn = 3,
  // status instorage
  WaitProcess = 4,
  Processing = 5,
}

export enum ReadyToBidEnum {
  Ready = 1,
  Unready = 2,
}

export enum AuthorizationConfigurationEnum {
  AuthorizationForIchiba = 1,
  WorkspaceForSelfManagedBidAccounts = 2,
}
