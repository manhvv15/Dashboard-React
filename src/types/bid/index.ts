import {
  allowToBidValue,
  bidFilter,
  bidHistoryStatusValue,
  bidMapStatusValue,
  bidNickRankingValue,
  bidNickStatusValue,
  bidSniperStatusValue,
  bidSourceValue,
  bidStatusValue,
  readyForBidValue,
} from '@/constants/bid';

export type ObjValueType<T> = T[keyof T];
export type BidDateType = Record<'start' | 'end', string>;
export type BidFilterType = ObjValueType<typeof bidFilter>;
export type BidSourceType = ObjValueType<typeof bidSourceValue>;
export type BidStatusType = ObjValueType<typeof bidStatusValue>;
export type BidHistoryStatusType = ObjValueType<typeof bidHistoryStatusValue>;
export type SniperBidStatusType = ObjValueType<typeof bidSniperStatusValue>;
export type BidMapStatusType = ObjValueType<typeof bidMapStatusValue>;
export type BidNickStatusType = ObjValueType<typeof bidNickStatusValue>;
export type ReadyForBidType = ObjValueType<typeof readyForBidValue>;
export type AllowToBidType = ObjValueType<typeof allowToBidValue>;
export type BidNickRankingType = ObjValueType<typeof bidNickRankingValue>;
export type GetDropdownBidNickResponse = string;
