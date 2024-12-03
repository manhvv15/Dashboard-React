import {
  getBidConfig,
  getBiddingItems,
  getBidHistory,
  getBidingNickList,
  getConfigBid,
  getDropdownBidNick,
  getLoseBidItems,
  getPlanOfBid,
  getPlanOfBidById,
  getSniperBidItems,
  getSubscriberForBids,
  getUserLV2,
  getVipUsers,
  getWonBidItems,
} from '@/services/bid';
import { GetDropdownBidNickResponse } from '@/types/bid';
import {
  GetBidConfigRequest,
  GetBidConfigResponse,
  GetBiddingItemsRequest,
  GetBiddingItemsResponse,
  GetBidHistoryRequest,
  GetBidHistoryResponse,
  GetBidNickRequest,
  GetBidNickResponse,
  GetDropdownBidNickRequest,
  GetLoseBidItemsRequest,
  GetLoseBidItemsResponse,
  GetPlanOfBidRequest,
  GetPlanOfBidResponse,
  GetSniperBidRequest,
  GetSniperBidResponse,
  GetSubscriberForBidsRequest,
  GetSubscriberForBidsResponse,
  GetUserLevel2Request,
  GetVipUserRequest,
  GetVipUserResponse,
  GetWonBidItemsRequest,
  GetWonBidItemsResponse,
  UserLV2,
} from '@/types/bid/interface';
import { PageResponse } from '@/types/pim/proxy';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface ParamsType<TReq, TRes, TErr = any> {
  queryParams: TReq;
  queryKey?: any[];
  enabled?: boolean;
  onSuccess?: (data: AxiosResponse<PageResponse<TRes>>) => void;
  onError?: (error: TErr) => void;
  keepPreviousData?: boolean;
}

/** Get list of bidding item */
export const useGetBiddingItems = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetBiddingItemsRequest, GetBiddingItemsResponse>) => {
  return useQuery({
    queryKey: ['getBiddingItems', ...queryKey],
    queryFn: () => getBiddingItems({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};

export const useGetBiddingConfig = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetBidConfigRequest, GetBidConfigResponse>) => {
  return useQuery({
    queryKey: ['useGetBiddingConfig', ...queryKey],
    queryFn: () => getBidConfig({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};

export function useGetWonBidItems({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetWonBidItemsRequest, GetWonBidItemsResponse>) {
  return useQuery({
    queryKey: ['getWonBidItems', ...queryKey],
    queryFn: () => getWonBidItems({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
}

// Get list of lose bid items
export function useGetLoseBidItems({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
  keepPreviousData,
}: ParamsType<GetLoseBidItemsRequest, GetLoseBidItemsResponse>) {
  return useQuery({
    queryKey: ['getLoseBidItems', ...queryKey],
    queryFn: () => getLoseBidItems({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
    keepPreviousData,
  });
}

/** Get list of bidding nick */
export const useGetBidNicks = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetBidNickRequest, GetBidNickResponse>) => {
  return useQuery({
    queryKey: ['getBidNicks', ...queryKey],
    queryFn: () => getBidingNickList({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};

/** Get list of bidding customer */
export const useGetBidCustomers = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: {
  queryParams: GetUserLevel2Request;
  queryKey?: any[];
  enabled?: boolean;
  onSuccess?: (data: AxiosResponse<PageResponse<UserLV2>>) => void;
  onError?: (error: any) => void;
}) => {
  return useQuery({
    queryKey: ['getCustomer', ...queryKey],
    queryFn: () => getUserLV2(queryParams),
    enabled,
    onSuccess,
    onError,
  });
};

/** Get list of bidding nick using for dropdown */
export const useGetDropdownBidNick = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetDropdownBidNickRequest, GetDropdownBidNickResponse>) => {
  return useQuery({
    queryKey: ['getBidNickDropdown', ...queryKey],
    queryFn: () => getDropdownBidNick({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};

/** Get the bidding history */
export const useGetBidHistory = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetBidHistoryRequest, GetBidHistoryResponse>) => {
  return useQuery({
    queryKey: ['getBidHistory', ...queryKey],
    queryFn: () => getBidHistory({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};

/** Get the bidding config */
export const useGetBidConfig = ({
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: {
  workspaceSlug: string;
  queryKey?: any[];
  enabled?: boolean;
  onSuccess?: (data: AxiosResponse<GetBidConfigResponse>) => void;
  onError?: (error: any) => void;
}) => {
  return useQuery({
    queryKey: ['getConfigBid', ...queryKey],
    queryFn: () => getConfigBid(),
    enabled,
    onSuccess,
    onError,
  });
};

/** Get list of sniper bid item */
export const useGetSniperBidItems = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetSniperBidRequest, GetSniperBidResponse>) => {
  return useQuery({
    queryKey: ['getSniperBidItems', ...queryKey],
    queryFn: () => getSniperBidItems({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};

/** Get list of vip user */
export const useGetVipUser = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetVipUserRequest, GetVipUserResponse>) => {
  return useQuery({
    queryKey: ['getBidNicks', ...queryKey],
    queryFn: () => getVipUsers({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};

/** Get list plan of bid */
export const useGetPlanOfBid = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetPlanOfBidRequest, GetPlanOfBidResponse>) => {
  return useQuery({
    queryKey: ['getPlanOfBid', ...queryKey],
    queryFn: () => getPlanOfBid({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};

export const useGetPlanById = ({
  id,
  queryKey = 'getPlanById',
  enabled = true,
  onSuccess = () => {},
  onError = () => {},
}: {
  slug: string;
  id: string;
  queryKey?: string;
  enabled?: boolean;
  onSuccess?: (data: AxiosResponse<GetPlanOfBidResponse>) => void;
  onError?: (error: any) => void;
}) => {
  return useQuery({
    queryKey: [queryKey, id],
    enabled,
    queryFn: () => {
      return getPlanOfBidById({
        id,
      });
    },
    onSuccess,
    onError,
  });
};

export const useGetSubscriberForBids = ({
  queryParams,
  queryKey = [],
  enabled,
  onSuccess,
  onError,
}: ParamsType<GetSubscriberForBidsRequest, GetSubscriberForBidsResponse>) => {
  return useQuery({
    queryKey: ['getSubscriberForBids', ...queryKey],
    queryFn: () => getSubscriberForBids({ data: queryParams }),
    enabled,
    onSuccess,
    onError,
  });
};
