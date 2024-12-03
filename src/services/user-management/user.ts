import { AxiosResponse } from 'axios';

import { PageResult } from '@/types/user-management/common';
import {
  AddUsersToOrganizationsRequest,
  AddUsersToRoleRequest,
  ConfirmInviteUserRequest,
  DeleteUserFromApplicationRequest,
  FormInviteUser,
  FormReInviteUser,
  InviteUserResponse,
  OrganizationAvailableToUserRequest,
  OrganizationAvailableToUserResponse,
  UpdateApplicationRolesRequest,
  UpdateSessionInfoPayload,
  UpdateUserOrganizationRequest,
  UserAvailableToOrganizationRequest,
  UserAvailableToOrganizationResponse,
  UserAvailableToRoleRequest,
  UserAvailableToRoleResponse,
  UserByIdResponse,
  UserPagingRequest,
  UserPagingResponse,
  UserSummarySystemResponse,
} from '@/types/user-management/user';
import { compileRequestURL } from '@/utils/common';

import { user } from './endpoints';

import { instance } from '../xhr';

export const updateSessionInfo = (payload: UpdateSessionInfoPayload) => {
  return instance.post(user.updateSessionInfo, payload);
};

export const getUserSystemPaging = (params: UserPagingRequest) => {
  return instance.get<PageResult<UserPagingResponse>>(user.getPagingSystem, { params });
};
export const getSummaryUserSystem = () => {
  return instance.get<UserSummarySystemResponse>(user.getSummarySystem);
};

export const sendInviteSystem = (data: FormInviteUser): Promise<AxiosResponse<InviteUserResponse>> => {
  return instance.post(user.invite, data);
};

export const confirmInviteSystem = (data: ConfirmInviteUserRequest): Promise<AxiosResponse> => {
  return instance.post(user.confirmInvite, data);
};

export const resendInviteSystem = (data: FormReInviteUser): Promise<AxiosResponse> => {
  return instance.post(user.reInvite, data);
};

export const getUserById = (id: string): Promise<AxiosResponse<UserByIdResponse>> => {
  return instance.get<UserByIdResponse>(compileRequestURL(user.detail, { id: id }));
};

export const getUserAvailableToAddRole = (params: UserAvailableToRoleRequest) => {
  return instance.get<UserAvailableToRoleResponse[]>(user.getUserAvailableToAddRole, { params });
};
export const getUserAvailableToAddOrganization = (params: UserAvailableToOrganizationRequest) => {
  return instance.get<UserAvailableToOrganizationResponse[]>(user.getUserAvailableToAddOrganization, { params });
};

export const getOrganizationsAvailableToUser = (params: OrganizationAvailableToUserRequest) => {
  return instance.get<OrganizationAvailableToUserResponse[]>(user.getOrganizationAvailableToAddUser, { params });
};

export const addUsersToRole = (data: AddUsersToRoleRequest): Promise<AxiosResponse> => {
  return instance.post(user.addUsersToRole, data);
};

export const addUsersToOrganization = (data: AddUsersToOrganizationsRequest): Promise<AxiosResponse> => {
  return instance.post(user.addUsersToOrganization, data);
};

export const deleteUser = (id: string): Promise<AxiosResponse> => {
  return instance.delete(compileRequestURL(user.delete, { id: id }));
};

export const activeUser = (id: string): Promise<AxiosResponse> => {
  return instance.put(compileRequestURL(user.activateUser, { id: id }));
};

export const updateUserOrganization = (data: UpdateUserOrganizationRequest): Promise<AxiosResponse> => {
  return instance.put(user.updateUserOrganization, data);
};

export const deactiveUser = (id: string): Promise<AxiosResponse> => {
  return instance.put(compileRequestURL(user.deactivateUser, { id: id }));
};

export const updateApplicationRolesOfUser = (data: UpdateApplicationRolesRequest): Promise<AxiosResponse> => {
  return instance.post(user.updateApplicationRoles, data);
};
export const deleteUserFromApplication = (data: DeleteUserFromApplicationRequest): Promise<AxiosResponse> => {
  return instance.post(user.deleteUserFromApplication, data);
};
