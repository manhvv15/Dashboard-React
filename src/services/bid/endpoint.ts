const BIDDING = '/bidding';
const COMMERCE_LAYER = '/ecommerce-layer';
export const bidding = {
  createAccount: `${BIDDING}/accounts`,
  getBiddingItems: `${BIDDING}/user-bid-product/dashboard/bidding`,
  getWonBidItems: `${BIDDING}/successful-bid`,
  getLoseBidItems: `${BIDDING}/user-bid-product/dashboard/lose`,
  getNickList: `${BIDDING}/accounts`,
  getDropdownNick: `${BIDDING}/accounts/search`,
  updateAccount: `${BIDDING}/accounts/update`,
  getSuccessfulBidNow: `${BIDDING}/successful-bid/execute`,
  getBidHistories: `${BIDDING}/bid-histories`,
  getBidConfig: `${BIDDING}/configurations`,
  updateBidConfig: `${BIDDING}/configurations`,
  removeAccount: `${BIDDING}/accounts/remove`,
  getSniperBidItems: `${BIDDING}/user-bid-product/dashboard/sniper-bid`,
  getUserVip: `${BIDDING}/configurations/vip-users`,
  updateMaxBid: `${BIDDING}/configurations/bid-credit`,
  executeAccount: `${BIDDING}/accounts/execute`,
  deactivateBidCreditByAdmin: `${COMMERCE_LAYER}/vip-accounts/deactivate-by-administrator`,
  mapSuccessfulBid: `${BIDDING}/successful-bid/mapping-customer`,
  confirmAccountBlocked: `${BIDDING}/accounts/confirmation-is-blocked`,
  plansOfBid: {
    base: `${BIDDING}/plan-bid-credit`,
    getById: `${BIDDING}/plan-bid-credit/{id}`,
  },
  subscriberForBids: {
    base: `${BIDDING}/user-plan-bid-credit`,
    changeCountBid: `${BIDDING}/user-plan-bid-credit/change-count-bid`,
    updateStatus: `${BIDDING}/user-plan-bid-credit/update-status`,
  },
  registerGetSuccessfulBidReminder: `${BIDDING}/accounts/register-reminder`,
  changeBidType: `${BIDDING}/accounts/change-bid-type`,
  getBidConfigPaging: `${BIDDING}/accounts/get-all-config`,
  getAllWorkpace: `${BIDDING}/accounts/get-all-workspace`,
};
