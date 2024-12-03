import { PaginationRequest } from './common';

export interface TreePermissionRequest {
  workspaceId: string | null | undefined;
  applicationId: string;
}

export interface GetTreePermissionQueryResponse {
  id: string;
  name: string;
  children: GetTreePermissionQueryResponse[] | null | undefined;
}

export interface PagingPermissionResponse {
  id: string;
  applicationId: string;
  applicationName: string;
  applicationLogoUrl: string;
  actionCode: string;
  objectName: string;
  objectCode: string;
  method: string | null;
  endpoint: string | null;
  createdAt: string;
}

export interface PermissionByIdResponse {
  id: string;
  applicationId: string;
  objectId: string;
  actionId: string;
  method: string | null;
  endpoint: string | null;
}

export interface PermissionPagingRequest extends PaginationRequest {
  applicationIds: string[] | null;
}

export interface CreatePermissionRequest {
  applicationId: string;
  objectId: string | null;
  actionId: string | null;
  method: string | null;
  endpoint: string | null;
}

export interface UpdatePermissionRequest {
  id: string;
  applicationId: string;
  objectId: string | null;
  actionId: string | null;
  method: string | null;
  endpoint: string | null;
}
