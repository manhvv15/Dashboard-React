import { StatusButtonColorType } from '@/components/bid';
import {
  allowToBidValue,
  bidHistoryStatusValue,
  bidMapStatusValue,
  bidNickRankingValue,
  bidNickStatusValue,
  bidSniperStatusValue,
  bidSourceValue,
  bidStatusValue,
  janboxItemLink,
  rankThreshold,
  readyForBidValue,
} from '@/constants/bid';
import {
  AllowToBidType,
  BidHistoryStatusType,
  BidMapStatusType,
  BidNickRankingType,
  BidNickStatusType,
  BidSourceType,
  BidStatusType,
  ReadyForBidType,
  SniperBidStatusType,
} from '@/types/bid';
import {
  AllowBidEnum,
  BidHistoryStatusEnum,
  BidLastTimeStatusEnum,
  BidMapStatusEnum,
  BidNickRankingEnum,
  BidNickStatusEnum,
  BidSourceEnum,
  BidStatusEnum,
  PeriodType,
  PlanStatus,
  ReadyToBidEnum,
  UserGenderEnum,
} from '@/types/bid/enum';
import { replaceString } from './common';

export const getBidStatus = (value: number) => {
  let result: BidStatusType;
  switch (value) {
    case BidStatusEnum.Bidding:
      result = bidStatusValue.outBid;
      break;
    case BidStatusEnum.Fail:
      result = bidStatusValue.fail;
      break;
    case BidStatusEnum.HasHighest:
      result = bidStatusValue.highest;
      break;
    case BidStatusEnum.CancelledBySeller:
      result = bidStatusValue.cancelledBySeller;
      break;
    case BidStatusEnum.CancelledBySaleOrder:
      result = bidStatusValue.cancelledBySeller;
      break;
    default:
      result = bidStatusValue.outBid;
      break;
  }
  return result;
};

export const getSniperBidStatus = (value: number) => {
  let result: SniperBidStatusType;
  switch (value) {
    case BidLastTimeStatusEnum.Pending:
      result = bidSniperStatusValue.pending;
      break;
    case BidLastTimeStatusEnum.Fail:
      result = bidSniperStatusValue.fail;
      break;
    case BidLastTimeStatusEnum.Success:
      result = bidSniperStatusValue.success;
      break;
    case BidLastTimeStatusEnum.Deleted:
      result = bidSniperStatusValue.deleted;
      break;
    case BidLastTimeStatusEnum.PriceInValid:
      result = bidSniperStatusValue.priceInvalid;
      break;
    case BidLastTimeStatusEnum.BidClientBusy:
      result = bidSniperStatusValue.bidClientBusy;
      break;
    case BidLastTimeStatusEnum.IsBlockedBySeller:
      result = bidSniperStatusValue.isBlockBySeller;
      break;
    case BidLastTimeStatusEnum.CannotGetValueOfBidSubmitForm:
      result = bidSniperStatusValue.cannotGetValueOfBidSubmitForm;
      break;
    case BidLastTimeStatusEnum.AuctionCouldNotBeAccessed:
      result = bidSniperStatusValue.auctionCouldNotBeAccessed;
      break;
    case BidLastTimeStatusEnum.Ended:
      result = bidSniperStatusValue.bidEnd;
      break;
    default:
      result = bidStatusValue.outBid;
      break;
  }
  return result;
};

export const getBidNickRanking = (rate: number) => {
  if (!rate || rate < rankThreshold) {
    return bidNickRankingValue.error;
  }
  return bidNickRankingValue.good;
};

export const filterList = (list?: any[], totalRecord: number = 2) => {
  if (list && list?.length > 0 && list.length < totalRecord) {
    return list;
  }
  return undefined;
};

export const getBidMapStatus = (value: number) => {
  let result: BidMapStatusType;
  switch (value) {
    case BidMapStatusEnum.Success:
      result = bidMapStatusValue.mapped;
      break;
    case BidMapStatusEnum.New:
      result = bidMapStatusValue.unmap;
      break;
    case BidMapStatusEnum.NotFound:
      result = bidMapStatusValue.unableToMap;
      break;
    default:
      result = bidMapStatusValue.unableToMap;
      break;
  }
  return result;
};

export const getBidSource = (value: number) => {
  let result: BidSourceType;
  switch (value) {
    case BidSourceEnum.YahooAuction:
      result = bidSourceValue.yahooAuction;
      break;
    case BidSourceEnum.Ebay:
      result = bidSourceValue.ebay;
      break;
    default:
      result = bidSourceValue.yahooAuction;
      break;
  }
  return result;
};

export const getBidNickStatus = (value: number) => {
  let result: BidNickStatusType;
  switch (value) {
    case BidNickStatusEnum.Init:
      result = bidNickStatusValue.init;
      break;
    case BidNickStatusEnum.Ready:
      result = bidNickStatusValue.ready;
      break;
    case BidNickStatusEnum.Failed:
      result = bidNickStatusValue.failed;
      break;
    case BidNickStatusEnum.Stop:
      result = bidNickStatusValue.stop;
      break;
    case BidNickStatusEnum.BlockedByAuction:
      result = bidNickStatusValue.blockedByAuction;
      break;
    default:
      result = bidNickStatusValue.init;
      break;
  }
  return result;
};

export const getPlanStatus = (value: PlanStatus | undefined) => {
  if (!value) {
    return '';
  }
  switch (value) {
    case PlanStatus.Active:
      return 'active';
    case PlanStatus.InActive:
      return 'inactive';
    case PlanStatus.Expired:
      return 'expired';
    default:
      return '';
  }
};

export const getGender = (value: UserGenderEnum | undefined) => {
  if (!value) {
    return '';
  }
  switch (value) {
    case UserGenderEnum.Male:
      return 'male';
    case UserGenderEnum.Female:
      return 'female';
    case UserGenderEnum.Other:
      return 'other';
    default:
      return '';
  }
};

export const getPlanPeriod = (value: PeriodType | undefined) => {
  if (!value) {
    return '';
  }
  switch (value) {
    case PeriodType.Monthly:
      return 'monthly';
    case PeriodType.Quarterly:
      return 'quarterly';
    case PeriodType.Yearly:
      return 'yearly';
    case PeriodType.Customize:
      return 'customize';
    default:
      return '';
  }
};

type SttBtnColorType = Exclude<StatusButtonColorType, undefined | null>;
/**
 *
 * @param value The value that need to be compared
 * @param list List of the value with the corresponding status button color
 * @returns a color of the StatusButton
 */
export const getSttBtnColor = <T extends string | symbol | number>({
  value,
  list,
  defaultColor = 'red',
}: {
  value: T;
  list: { [x in T]?: SttBtnColorType };
  defaultColor?: SttBtnColorType;
}) => {
  return list[value] ?? defaultColor;
};

export const getBidItemLink = ({ id, source }: { id: string; source: BidSourceEnum }) => {
  const bidSource = {
    [BidSourceEnum.YahooAuction]: 'yahoo-auction',
    [BidSourceEnum.Ebay]: 'ebay',
  };
  const url = replaceString(
    [
      {
        valueIsReplace: '{bid-source}',
        newValue: bidSource[source] ?? bidSource[BidSourceEnum.YahooAuction],
      },
    ],
    janboxItemLink,
  );
  return `${url}/${id}`;
};

export const getBidHistoryStatus = (value: number) => {
  let result: BidHistoryStatusType;
  switch (value) {
    case BidHistoryStatusEnum.Success:
      result = bidHistoryStatusValue.success;
      break;
    case BidHistoryStatusEnum.Fail:
      result = bidHistoryStatusValue.fail;
      break;
    case BidHistoryStatusEnum.PriceInValid:
      result = bidHistoryStatusValue.priceInValid;
      break;
    case BidHistoryStatusEnum.BidClientBusy:
      result = bidHistoryStatusValue.bidClientBusy;
      break;
    case BidHistoryStatusEnum.Ended:
      result = bidHistoryStatusValue.ended;
      break;
    case BidHistoryStatusEnum.CookieInValid:
      result = bidHistoryStatusValue.cookieInValid;
      break;
    case BidHistoryStatusEnum.IsBlockedBySeller:
      result = bidHistoryStatusValue.isBlockedBySeller;
      break;
    default:
      result = bidHistoryStatusValue.fail;
      break;
  }
  return result;
};

export const getReadyToBid = (value: number) => {
  let result: ReadyForBidType;
  switch (value) {
    case ReadyToBidEnum.Ready:
      result = readyForBidValue.ready;
      break;
    case ReadyToBidEnum.Unready:
      result = readyForBidValue.unready;
      break;
    default:
      result = readyForBidValue.ready;
      break;
  }
  return result;
};
export const getAllowBid = (value: number) => {
  let result: AllowToBidType;
  switch (value) {
    case AllowBidEnum.Allowed:
      result = allowToBidValue.allowed;
      break;
    case AllowBidEnum.NotAllowed:
      result = allowToBidValue.notAllowed;
      break;
    default:
      result = allowToBidValue.allowed;
      break;
  }
  return result;
};
export const getBidNickRankingFilter = (value: number) => {
  let result: BidNickRankingType;
  switch (value) {
    case BidNickRankingEnum.Credibility:
      result = bidNickRankingValue.good;
      break;
    case BidNickRankingEnum.NoCredibility:
      result = bidNickRankingValue.error;
      break;
    default:
      result = bidNickRankingValue.good;
      break;
  }
  return result;
};
