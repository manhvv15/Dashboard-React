import { PaginationRequest } from './common';
import { ApplicationResponse, UserStatusEnum } from './user';

export interface OrganizationPagingResponse {
  id: string;
  code: string;
  fullCode: string;
  name: string;
  description: string | null;
  fullName: string;
  order?: number;
  isSystem: boolean;
  userCount?: number;
  parentId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  applicationCount: number;
  applications: ApplicationResponse[];
}

export interface OrganizationByIdRequest {
  id: string;
  workspaceId: string | null;
}

export interface OrganizationByIdResponse {
  id: string;
  code: string;
  fullCode: string;
  name: string;
  isSystem: boolean;
  description: string | null;
  fullName: string;
  order?: number;
  parentId: string;
  workspaceId: string;
  totalUser: string;
  totalApplication: string;
  users: UserDto[];
  applications: ApplicationResponse[] | [];
}

export interface UserDto {
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  prefixPhoneNumber: string | null;
  avatarUrl: string | null;
  status: UserStatusEnum;
  inviteAt: string | null;
  inviteById: string | null;
  inviteBy: string | null;
  createdAt: string | null;
  createdBy: string | null;
}

export interface RoleDto {
  roleId: string;
  roleCode: string;
  roleName: string;
  applicationId: string;
  applicationName: string;
  applicatioLogoUrl: string | null;
  createdAt: string;
  createdBy: string;
  createdById: string;
}

export interface OrganizationPagingRequest extends PaginationRequest {
  workspaceId: string | null | undefined;
}

export interface CreateOrganizationRequest {
  code: string;
  name: string;
  order?: number;
  isSystem: boolean;
  description: string | null | undefined;
  userIds: string[];
  parentId?: string;
}
export interface UpdateOrganizationRequest {
  id: string;
  code: string;
  name: string;
  description: string | null | undefined;
  order?: number | undefined;
  parentId?: string;
}

export interface DeleteOrganizationResponse {
  isSuccess: boolean;
  message: string | null;
  numberOfUsers: number | null;
}

export interface AddRolesToOrganizationsRequest {
  roleIds: string[];
  organizationIds: string[];
}

export interface DeleteOrganizationApplicationRequest {
  applicationId: string;
  organizationId: string;
}
export interface DeleteOrganizationUserRequest {
  userId: string;
  organizationId: string;
}
export interface OrderOrganizationRequest {
  organizations: {
    id: string;
    order: number;
  }[];
}
export interface UpdateApplicationRolesByOrganizationRequest {
  organizationId: string;
  applicationId: string;
  roleIds: string[] | undefined;
}
