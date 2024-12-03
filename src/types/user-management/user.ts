import { Language } from '@/constants/enums/common';

import { PaginationRequest } from './common';

export interface UpdateSessionInfoPayload {
  languageCode?: Language;
}

export interface RemoteAuthUser {
  id: string;
  fullName: string;
  avatar?: string;
}

export interface UserPagingResponse {
  id: string;
  createdAt: string;
  code: string | null;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  prefixPhoneNumber: string | null;
  status: UserStatusEnum | null;
  inviteAt: string;
  note: string | null;
  applications: ApplicationInfoResponse[];
  organizations: OrganizationResponse[];
  avatarUrl?: string;
}
export interface UserSummarySystemResponse {
  totalUser: number;
  activeUsers: number;
}

export enum UserStatusEnum {
  Active = 0,
  DeActive = 1,
  Invited = 2,
}

export interface ApplicationInfoResponse {
  roleId: string;
  roleCode: string;
  roleName: string;
  applicationId: string;
  applicationName: string;
  applicatioLogoUrl: string;
}

export interface OrganizationResponse {
  id: string;
  code: string;
  name: string;
}

export interface UserPagingRequest extends PaginationRequest {
  organizationIds: string[] | null | undefined;
  roleIds: string[] | null | undefined;
  status: number[] | null | undefined;
}

export interface FormInviteUser {
  emails: string[];
  returnUrl: string | null;
  applicationRoles: FormApplicationRole[] | [];
  organizationIds: string[];
}

export interface FormReInviteUser {
  userId: string;
  returnUrl: string | null;
}

export interface InviteUserResponse {
  successes: string[];
  errors: string[];
}

export interface FormApplicationRole {
  id: string;
  name: string;
  logoUrl: string;
  roleIds: string[] | [];
  roles: RoleResponse[] | [];
}

export interface UserByIdResponse {
  id: string;
  createdAt: string;
  createdBy: string;
  inviteAt: string;
  inviteBy: string;
  avatarUrl: string | null;
  code: string | null;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  prefixPhoneNumber: string | null;
  status: UserStatusEnum | null;
  note: string | null;
  isCompleteSetup: boolean;
  applications: ApplicationResponse[];
  organizations: OrganizationResponse[];
}

export interface ApplicationResponse {
  id: string;
  name: string;
  logoUrl: string;
  roleIds: string[] | [];
  roles: RoleResponse[] | [];
  roleNames: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  isSystem: boolean;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  createdAt: string;
  applications: ApplicationResponse[];
}

export interface UserAvailableToRoleRequest {
  roleId: string | undefined;
  keyword: string | undefined;
  pageSize: number;
}
export interface OrganizationAvailableToUserRequest {
  userId: string | undefined;
  keyword: string | undefined;
}
export interface UserAvailableToOrganizationRequest {
  organizationId: string | undefined;
  keyword: string | undefined;
  pageSize: number;
}
export interface UserAvailableToRoleResponse {
  id: string;
  fullName: string | undefined;
  email: string;
  avatarUrl: string;
}

export interface UserAvailableToOrganizationResponse extends UserAvailableToRoleResponse {}

export interface OrganizationAvailableToUserResponse {
  id: string;
  code: string;
  name: string;
}

export interface AddUsersToRoleRequest {
  roleIds: string[];
  userIds: string[];
}
export interface AddUsersToOrganizationsRequest {
  organizationIds: string[];
  userIds: string[];
}
export interface UpdateUserOrganizationRequest {
  userId: string;
  organizationId: string;
}
export interface ConfirmInviteUserRequest {
  email: string;
  token: string;
}
export interface UpdateApplicationRolesRequest {
  userId: string;
  applicationId: string;
  roleIds: string[] | null | undefined;
}

export interface DeleteUserFromApplicationRequest {
  applicationId: string;
  userId: string;
}
