import { GetDropdownBidNickResponse } from '@/types/bid';
import {
  AuthorizationConfigurationRequest,
  ConfirmAccountBlockedRequest,
  CreateBiddingAccountRequest,
  DeactivateBidCreditByAdminRequest,
  ExecuteBidAccountRequest,
  GetAllWorkspaceResponse,
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
  GetSuccessfulBidNow,
  GetUserLevel2Request,
  GetUserLV2,
  GetVipUserRequest,
  GetVipUserResponse,
  GetWonBidItemsRequest,
  GetWonBidItemsResponse,
  IPlanOfBidRequest,
  MapSuccessfulBidRequest,
  RegisterGetSuccessfulBidReminderRequest,
  RemoveBidAccountRequest,
  UpdateBidAccountRequest,
  UpdateBidConfigRequest,
  UpdateCustomBidCountRequest,
  UpdateMaxBidRequest,
  UpdateSubscriberForBidsStatus,
} from '@/types/bid/interface';
import { PageResponse } from '@/types/pim/proxy';
import { replaceString } from '@/utils/common';
import { DEFAULT_GUID } from '@/utils/constants';
import { AxiosResponse } from 'axios';
import { workspace } from '../user-management/endpoints';
import { instance } from '../xhr';
import { bidding } from './endpoint';

interface ParamsType<T> {
  data: T;
}

export const createBiddingAccount = ({ data }: ParamsType<CreateBiddingAccountRequest>): Promise<AxiosResponse> => {
  return instance.post(bidding.createAccount, { ...data, workspaceId: DEFAULT_GUID });
};

export const getBiddingItems = ({
  data,
}: ParamsType<GetBiddingItemsRequest>): Promise<AxiosResponse<PageResponse<GetBiddingItemsResponse>>> => {
  return instance.get(bidding.getBiddingItems, { params: { ...data, isHappy: true } });
};

export const getBidConfig = ({
  data,
}: ParamsType<GetBidConfigRequest>): Promise<AxiosResponse<PageResponse<GetBidConfigResponse>>> => {
  return instance.get(bidding.getBidConfigPaging, { params: { ...data, isHappy: true } });
};

export const getWonBidItems = ({
  data,
}: ParamsType<GetWonBidItemsRequest>): Promise<AxiosResponse<PageResponse<GetWonBidItemsResponse>>> => {
  return instance.get(bidding.getWonBidItems, { params: { ...data, isHappy: true } });
};

export const getLoseBidItems = ({
  data,
}: ParamsType<GetLoseBidItemsRequest>): Promise<AxiosResponse<PageResponse<GetLoseBidItemsResponse>>> => {
  return instance.get(bidding.getLoseBidItems, { params: { ...data, isHappy: true } });
};

export const getBidingNickList = ({
  data,
}: ParamsType<GetBidNickRequest>): Promise<AxiosResponse<PageResponse<GetBidNickResponse>>> => {
  return instance.get(bidding.getNickList, { params: { ...data } });
};

export const getDropdownBidNick = ({
  data,
}: ParamsType<GetDropdownBidNickRequest>): Promise<AxiosResponse<PageResponse<GetDropdownBidNickResponse>>> => {
  return instance.get(bidding.getDropdownNick, { params: { ...data } });
};

export const updateBidAccount = ({ data }: ParamsType<UpdateBidAccountRequest>): Promise<AxiosResponse> => {
  return instance.put(bidding.updateAccount, { ...data });
};

export const getSuccessfulBidNow = ({ data }: ParamsType<GetSuccessfulBidNow>): Promise<AxiosResponse> => {
  return instance.put(bidding.getSuccessfulBidNow, { ...data });
};

export const getBidHistory = ({
  data,
}: ParamsType<GetBidHistoryRequest>): Promise<AxiosResponse<PageResponse<GetBidHistoryResponse>>> => {
  return instance.get(bidding.getBidHistories, { params: { ...data, isHappy: true } });
};

export const getConfigBid = (): Promise<AxiosResponse<GetBidConfigResponse>> => {
  return instance.get(bidding.getBidConfig);
};

export const updateConfigBid = ({ data }: ParamsType<UpdateBidConfigRequest>): Promise<AxiosResponse> => {
  return instance.post(bidding.updateBidConfig, { ...data });
};

export const removeBidAccount = ({ data }: ParamsType<RemoveBidAccountRequest>): Promise<AxiosResponse> => {
  return instance.put(bidding.removeAccount, { ...data });
};

export const getSniperBidItems = ({
  data,
}: ParamsType<GetSniperBidRequest>): Promise<AxiosResponse<PageResponse<GetSniperBidResponse>>> => {
  return instance.get(bidding.getSniperBidItems, { params: { ...data, isHappy: true } });
};

export const getVipUsers = ({
  data,
}: ParamsType<GetVipUserRequest>): Promise<AxiosResponse<PageResponse<GetVipUserResponse>>> => {
  return instance.get(bidding.getUserVip, { params: { ...data } });
};

export const updateMaxBid = ({ data }: ParamsType<UpdateMaxBidRequest>): Promise<AxiosResponse> => {
  return instance.put(bidding.updateMaxBid, { ...data });
};

export const executeBidAccount = ({ data }: ParamsType<ExecuteBidAccountRequest>): Promise<AxiosResponse> => {
  return instance.put(bidding.executeAccount, { ...data });
};

export const deactivateBidCreditByAdmin = ({
  data,
}: ParamsType<DeactivateBidCreditByAdminRequest>): Promise<AxiosResponse> => {
  return instance.post(bidding.deactivateBidCreditByAdmin, { ...data });
};

export const mapSuccessfulBid = ({ data }: ParamsType<MapSuccessfulBidRequest>): Promise<AxiosResponse> => {
  return instance.post(bidding.mapSuccessfulBid, { ...data });
};

export const confirmAccountBlocked = ({ data }: ParamsType<ConfirmAccountBlockedRequest>): Promise<AxiosResponse> => {
  return instance.post(bidding.confirmAccountBlocked, { ...data });
};

export const getPlanOfBid = ({
  data,
}: ParamsType<GetPlanOfBidRequest>): Promise<AxiosResponse<PageResponse<GetPlanOfBidResponse>>> => {
  return instance.get(bidding.plansOfBid.base, { params: { ...data } });
};

export const getSubscriberForBids = ({
  data,
}: ParamsType<GetSubscriberForBidsRequest>): Promise<AxiosResponse<PageResponse<GetSubscriberForBidsResponse>>> => {
  return instance.get(bidding.subscriberForBids.base, { params: { ...data } });
};

export const getPlanOfBidById = ({ id }: { id: string }): Promise<AxiosResponse<GetPlanOfBidResponse>> => {
  return instance.get(
    replaceString(
      [
        {
          valueIsReplace: '{id}',
          newValue: id,
        },
      ],
      bidding.plansOfBid.getById,
    ),
  );
};

export const createPlanOfBid = ({ data }: ParamsType<IPlanOfBidRequest>): Promise<AxiosResponse> => {
  return instance.post(bidding.plansOfBid.base, { ...data });
};

export const editPlanOfBid = ({ data }: ParamsType<IPlanOfBidRequest>): Promise<AxiosResponse> => {
  return instance.put(bidding.plansOfBid.base, { ...data });
};

export const deletePlanOfBid = ({ id }: { id: string }): Promise<AxiosResponse<string>> => {
  return instance.delete(
    replaceString(
      [
        {
          valueIsReplace: '{id}',
          newValue: id,
        },
      ],
      bidding.plansOfBid.getById,
    ),
  );
};

export const updateSubscriberForBidsStatus = ({
  data,
}: ParamsType<UpdateSubscriberForBidsStatus>): Promise<AxiosResponse> => {
  return instance.put(bidding.subscriberForBids.updateStatus, { ...data });
};

export const updateCustomBidCount = ({ data }: ParamsType<UpdateCustomBidCountRequest>): Promise<AxiosResponse> => {
  return instance.put(bidding.subscriberForBids.changeCountBid, { ...data });
};

export const getUserLV2 = (data: GetUserLevel2Request): Promise<AxiosResponse<GetUserLV2>> => {
  return instance.get<GetUserLV2>(workspace.getUserLV2, {
    params: data,
  });
};

export const registerGetSuccessfulBidReminder = ({
  data,
}: ParamsType<RegisterGetSuccessfulBidReminderRequest>): Promise<AxiosResponse> => {
  return instance.put(bidding.registerGetSuccessfulBidReminder, data);
};

export const updateAuthorizationConfig = (data: AuthorizationConfigurationRequest): Promise<AxiosResponse> => {
  return instance.post(bidding.changeBidType, data);
};

export const getAllWorkspace = () => {
  return instance.get<GetAllWorkspaceResponse[]>(bidding.getAllWorkpace);
};
