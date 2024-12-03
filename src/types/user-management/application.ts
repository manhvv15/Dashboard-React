import { PaginationRequest } from './common';

export interface ApplicationResponse {
  id: string;
  code: string;
  name: string;
  shortName: string;
  logoUrl: string;
}

export interface ApplicationPagingRequest extends PaginationRequest {
  isSystem: boolean | null;
}

export interface GetAvailabeAppSystemByUserRequest {
  userId: string;
}
export interface GetAvailabeAppSystemByUserResponse {
  id: string;
  name: string;
  logoUrl: string | null;
  roles: RoleResponse[] | [];
}

export interface RoleResponse {
  id: string;
  name: string;
}
export enum ApplicationStatusEnum {
  Active = 1,
  Deactivate = 2,
  ComingSoon = 3,
}

export interface ApplicationPagingResponse {
  id: string;
  name: string;
  code: string;
  shortName: string;
  logoUrl: string | null;
  url: string | null;
  workspaces: number;
  users: number;
  createdAt: string;
  createdBy: string;
  updatedBy: string;
  updatedAt: string | null;
}

export interface ApplicationGroupResponse {
  value: string;
  label: string;
}

export interface ApplicationManagementRequest extends PaginationRequest {
  status: ApplicationStatusEnum[] | null | undefined;
}

export interface ApplicationManagementResponse {
  id: string;
  name: string;
  code: string;
  shortName: string;
  applicationGroupName: string;
  logoUrl: string | null;
  url: string | null;
  status: ApplicationStatusEnum;
  order: number;
  workspaceCount: number;
  users: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
}

export interface FormApplication {
  applicationGroupId: string | null;
  name: string;
  shortName: string;
  code: string;
  logoUrl: string | null;
  url: string | null;
  status: ApplicationStatusEnum;
  order: number | null;
  workspaceRequired: boolean | null;
  isDefault: boolean | null;
  isSystem: boolean | null;
  description: string | null;
}
export interface CreateApplicationRequest extends FormApplication {}

export interface UpdateApplicationRequest extends FormApplication {
  id: string;
}

export interface ApplicationByIdResponse {
  id: string;
  shortName: string;
  name: string;
  applicationGroupId: string;
  code: string;
  logoUrl: string | null;
  url: string | null;
  description: string | null;
  status: ApplicationStatusEnum;
  order: number | null;
  workspaceRequired: boolean | null;
  isDefault: boolean | null;
  isSystem: boolean | null;
}

export interface UploadFile {
  contentType: string;
  name: string;
  uri: string;
}
