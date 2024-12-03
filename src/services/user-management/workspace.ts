import {
  ApplicationByWorkspaceResponse,
  CalculateFeeMultipleRequest,
  CalculateFeeMultipleResponse,
  CancelSubscriptionRequest,
  CreateMultipleSubscriptionRequest,
  DeleteWorkspaceRequest,
  GetAvailablePlansByWorkspaceResponse,
  GetCompanyDetailByWorkspaceIdResponse,
  GetCompanyDetailRequest,
  GetContactPointByWorkspaceRequest,
  GetContactPointByWorkspaceResponse,
  GetCurrentUsageDataBySubscriptionResponse,
  GetManagementWorkspaceQueryResponse,
  GetSubscriptionDetailRequest,
  UpdateStatusWorkspaceRequest,
  Workspace,
  WorkspaceBySlug,
  WorkspaceManagementRequest,
} from '@/types/user-management/workspace';
import { compileRequestURL } from '@/utils/common';

import { workspace } from './endpoints';

import { PageResult } from '@/types/user-management/common';
import { AxiosResponse } from 'axios';
import { instance } from '../xhr';

export const getPagingWorkspace = ({
  keyword,
  pageNumber = 0,
  pageSize = 20,
}: {
  keyword?: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  return instance.get<PageResult<Workspace>>(workspace.getPagingWorkspace, {
    params: {
      keyword,
      pageNumber,
      pageSize,
    },
  });
};

export const getWorkspaceBySlug = (slug: string) => {
  return instance.get<WorkspaceBySlug>(compileRequestURL(workspace.getWorkspaceBySlug, { slug }));
};

export const getManagementWorkspace = (params: WorkspaceManagementRequest) => {
  return instance.get<PageResult<GetManagementWorkspaceQueryResponse>>(workspace.getManagement, { params });
};

export const getCompanyDetail = (params: GetCompanyDetailRequest) => {
  return instance.get<GetCompanyDetailByWorkspaceIdResponse>(workspace.getCompanyDetail, { params });
};

export const getContactPointsByWorkspace = (params: GetContactPointByWorkspaceRequest) => {
  return instance.get<PageResult<GetContactPointByWorkspaceResponse>>(workspace.getContactPointByWorkspace, { params });
};

export const getApplicationsByWorkspace = (
  workspaceId: string,
): Promise<AxiosResponse<ApplicationByWorkspaceResponse[]>> => {
  return instance.get(workspace.getApplicationsByWorkspaceId, {
    params: {
      workspaceId,
    },
  });
};

export const deleteWorkspace = (params: DeleteWorkspaceRequest): Promise<AxiosResponse> => {
  return instance.delete(workspace.deleteWorkspace, {
    data: params,
  });
};

export const getAvailablePlansByWorkspace = (workspaceId: string) => {
  return instance.get<GetAvailablePlansByWorkspaceResponse[]>(
    compileRequestURL(workspace.getAvailablePlansByWorkspace, { id: workspaceId }),
  );
};

export const calculationsFeePlans = (
  body: CalculateFeeMultipleRequest,
): Promise<AxiosResponse<CalculateFeeMultipleResponse[]>> => {
  return instance.post(workspace.calculationsFee, body);
};
export const createMultipleSubscription = (body: CreateMultipleSubscriptionRequest): Promise<AxiosResponse> => {
  return instance.post(workspace.createMultipleSubscription, body);
};
export const getSubscriptionDetail = (
  params: GetSubscriptionDetailRequest,
): Promise<AxiosResponse<GetCurrentUsageDataBySubscriptionResponse>> => {
  return instance.get<GetCurrentUsageDataBySubscriptionResponse>(workspace.getSubscriptionDetail, { params });
};

export const cancelSubscription = (data: CancelSubscriptionRequest): Promise<AxiosResponse> => {
  return instance.put(workspace.cancelSubscription, data);
};
export const updateStatusWorkspace = (data: UpdateStatusWorkspaceRequest): Promise<AxiosResponse> => {
  return instance.put(workspace.updateStatusWorkspace, data);
};
