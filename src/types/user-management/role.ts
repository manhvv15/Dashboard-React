import { PaginationRequest } from './common';

export interface RolePagingResponse {
  id: string;
  code: string;
  name: string;
  applicationId?: string;
  applicationName?: string;
  applicationLogoUrl?: string;
  isSystem: boolean;
  isApplicationSystem: boolean;
  description?: string;
  numberOfUsers: number;
  status: RoleStatusEnum;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export enum RoleStatusEnum {
  Active = 1,
  DeActive = 2,
}

export enum RoleAccessDataTypeEnum {
  OnlyMyData = 1,
  AllData = 2,
}

export interface RoleByIdResponse {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  applicationId: string;
  description: string;
  workspaceId: string;
  permissionIds: string[];
  accessDataType: RoleAccessDataTypeEnum;
}

export interface RolePagingRequest extends PaginationRequest {
  workspaceId: string | null | undefined;
  status: RoleStatusEnum[] | null | undefined;
  applicationIds: string[] | null | undefined;
}

export interface CreateRoleRequest {
  applicationId: string;
  code: string;
  name: string;
  isDefault: boolean;
  isSystem: boolean;
  description?: string;
  permissionIds: string[];
  accessDataType: RoleAccessDataTypeEnum;
}

export interface UpdateRoleRequest {
  id: string;
  applicationId: string;
  code: string;
  name: string;
  isDefault: boolean;
  description?: string;
  permissionIds: string[];
  accessDataType: RoleAccessDataTypeEnum;
  isAppliesToAllWorkspaces: boolean;
}
export interface DeleteRoleResponse {
  isSuccess: boolean;
  numberOfUsers: number;
}

export interface FormRole {
  code: string;
  name: string;
  isDefault: boolean;
  applicationId: string;
  description: string;
  workspaceId: string;
  permissionIds: string[] | [];
  accessDataType: RoleAccessDataTypeEnum;
  isAppliesToAllWorkspaces: boolean;
}
export interface IItemSubscriptionRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
}

export interface DeleteUserRoleRequest {
  roleId: string;
  userId: string;
}

export interface GetAvailableRoleByUserIdRequest {
  workspaceId: string;
  userId: string;
  keyword: string | null;
  applicationId: string | null;
}

export interface GetAvailableRoleByUserIdResponse {
  id: string;
  code: string;
  name: string;
  applicationId: string;
}
export interface GetAvailableRoleByOrganizationIdRequest {
  workspaceId: string;
  organizationId: string;
  keyword: string | null;
}

export interface GetAvailableRoleByOrganizationIdResponse {
  id: string;
  code: string;
  name: string;
}
