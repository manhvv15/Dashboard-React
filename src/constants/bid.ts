import { OptionSelect } from '@/types/bid/interface';

export const MARKET = 'market';
export const CUSTOMER = 'customer';
export const CREATEDATE = 'createDate';
export const UPDATEDATE = 'updateDate';
export const CREATEDPACKAGE = 'createdPackage';
export const CREATESHIPMENT = 'createdShipment';
export const UPDATESHIPMENT = 'updatedShipment';
export const WAREHOUSE = 'warehouse';
export const PACKAGE_STATUS_INSTORAGE = '1';
export const DETAIL_INSTOREGE = 'detail_instorage';
export const SOURCE = 'source';
export const NICK = 'nick';
export const BID_TIME = 'bidTime';
export const END_BID_TIME = 'endBidTime';
export const STATUS = 'status';
export const MAP_STATUS = 'mapStatus';
export const ORDER_DATE = 'orderDate';
export const READY_TO_BID = 'readyToBid';
export const ALLOW_TO_BID = 'allowToBid';
export const RANKING = 'ranking';
export const WAITING = 'waiting';
export const SUCCESS = 'success';
export const WON = 'won';
export const FAIL = 'fail';
export const WAITING_PROCESS = 'waitingProcess';
export const RETURNING = 'returning';
export const RETUNRED = 'returned';
export const NONRETURN = 'nonreturn';
export const CRAWLER_LANGUAGE = 'CRAWLER_LANGUAGE';
export const PERIOD = 'period';
export const EFFECTIVETIME = 'effectiveTime';

export const bidFilter = {
  source: SOURCE,
  nick: NICK,
  bidTime: BID_TIME,
  endBidTime: END_BID_TIME,
  customer: CUSTOMER,
  status: STATUS,
  mapStatus: MAP_STATUS,
  orderDate: ORDER_DATE,
  readyToBid: READY_TO_BID,
  allowToBid: ALLOW_TO_BID,
  ranking: RANKING,
  period: PERIOD,
  effectiveTime: EFFECTIVETIME,
} as const;

export const bidSourceValue = {
  yahooAuction: 'yahooAuction',
  ebay: 'ebay',
} as const;

export const bidStatusValue = {
  outBid: 'outBid',
  fail: 'failed',
  highest: 'highest',
  cancelledBySeller: 'cancelledBySeller',
  cancelledBySaleOrder: 'cancelledBySaleOrder',
} as const;

export const bidSniperStatusValue = {
  pending: 'pending',
  success: 'success',
  fail: 'fail',
  deleted: 'deleted',
  outBid: 'outBid',
  priceInvalid: 'priceInValid',
  bidClientBusy: 'bidClientBusy',
  cookiesInvalid: 'cookiesInvalid',
  isBlockBySeller: 'isBlockBySeller',
  cannotGetValueOfBidSubmitForm: 'cannotGetValueOfBidSubmitForm',
  auctionCouldNotBeAccessed: 'auctionCouldNotBeAccessed',
  bidEnd: 'bidEnd',
} as const;

export const bidHistoryStatusValue = {
  success: 'success',
  fail: 'fail',
  priceInValid: 'priceInValid',
  bidClientBusy: 'bidClientBusy',
  ended: 'ended',
  cookieInValid: 'cookieInValid',
  isBlockedBySeller: 'isBlockedBySeller',
  cannotGetValueOfBidSubmitForm: 'cannotGetValueOfBidSubmitForm',
} as const;

export const bidMapStatusValue = {
  mapped: 'mapped',
  unmap: 'unmap',
  unableToMap: 'unableToMap',
} as const;

export const bidNickStatusValue = {
  init: 'init',
  ready: 'ready',
  failed: 'failed',
  stop: 'stop',
  blockedByAuction: 'blockedByAuction',
} as const;

export const readyForBidValue = {
  ready: 'ready',
  unready: 'unready',
} as const;

export const allowToBidValue = {
  allowed: 'allowed',
  notAllowed: 'notAllowed',
} as const;

export const rankThreshold = 80;

export const bidNickRankingValue = {
  good: 'credibility',
  error: 'noCredibility',
} as const;

export const janboxItemLink = 'https://page.auctions.yahoo.co.jp/jp/auction';

export const initPageIndex = 1;

export const MIN_LENGTH_8: number = 8;
export const MAX_LENGTH_26: number = 26;
export const MAX_LENGTH_30: number = 30;
export const MAX_LENGTH_3: number = 3;
export const MIN_WIDTH_600: number = 600;
export const MIN_HEIGHT_600: number = 600;
export const MAX_LENGTH_100: number = 100;
export const MIN_LENGTH_5: number = 5;
export const MIN_LENGTH_0 = 0;
export const MIN_LENGTH_2 = 2;
export const MAX_LENGTH_10 = 10;
export const MAX_LENGTH_50 = 50;
export const MIN_LENGTH_3 = 3;
export const MAX_LENGTH_199 = 199;
export const MAX_LENGTH_200 = 200;
export const MAX_LENGTH_255 = 255;
export const MAX_LENGTH_500 = 500;
export const MAX_LENGTH_30000 = 30000;
export const MAX_LENGTH_30000_STRING = '30,000';
export const MIN_LENGTH_4: number = 4;
export const MAX_LENGTH_25: number = 25;
export const MIN_LENGTH_1: number = 1;
export const minLengthPhoneNumberVN: number = 9;
export const PO_REFERENCE_MIN_LENGTH = 8;
export const PO_REFERENCE_MAX_LENGTH = 40;

export const PageSizes: OptionSelect[] = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
  { value: '40', label: '40' },
  { value: '50', label: '50' },
  { value: '60', label: '60' },
  { value: '120', label: '120' },
];

export const DATE_TIME_FORMAT = {
  /** 01:09 AM - 20/01/2023 */
  dateFormatDefault: 'MM/dd/yyyy HH:mm',
  dateFormatDefault2: 'dd/MM/yyyy HH:mm',
  dateFormatDefault3: 'HH:mm dd/MM/yyyy',
  dateFormatDefault4: 'dd/MM/yyyy',
  dateFormatDefault5: 'MM/dd/yyyy HH:mm aa',
};
