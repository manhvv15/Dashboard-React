import { TreeNode } from '@ichiba/ichiba-core-ui';
import { AxiosResponse } from 'axios';

import { RolePermissionItem, RolePermissionRequest } from '@/types/common';
import { PageResult } from '@/types/user-management/common';
import {
  CreatePermissionRequest,
  PagingPermissionResponse,
  PermissionByIdResponse,
  PermissionPagingRequest,
  TreePermissionRequest,
  UpdatePermissionRequest,
} from '@/types/user-management/permission';
import { compileRequestURL } from '@/utils/common';

import { permission } from './endpoints';

import { instance } from '../xhr';

export const getTreePermission = (params: TreePermissionRequest) => {
  return instance.get<TreeNode[]>(permission.getTreePermission, { params });
};
export const getTreePermissionByRoleId = (roleId: string) => {
  return instance.get<TreeNode[]>(compileRequestURL(permission.getTreePermissionByRoleId, { id: roleId }));
};

export const getPermissionByCurrentUser = (params: RolePermissionRequest) => {
  return instance.get<RolePermissionItem[]>(permission.getPermissionByCurrentUser, { params });
};

export const getPermisisonPaging = (params: PermissionPagingRequest) => {
  return instance.get<PageResult<PagingPermissionResponse>>(permission.getPaging, { params });
};

export const getPermissionById = (id: string): Promise<AxiosResponse<PermissionByIdResponse>> => {
  return instance.get<PermissionByIdResponse>(compileRequestURL(permission.getById, { id: id }));
};

export const createPermission = (data: CreatePermissionRequest): Promise<AxiosResponse> => {
  return instance.post(permission.create, data);
};

export const updatePermission = (data: UpdatePermissionRequest): Promise<AxiosResponse> => {
  return instance.put(permission.update, data);
};

export const deletePermission = (id: string): Promise<AxiosResponse> => {
  return instance.delete(compileRequestURL(permission.delete, { id: id }));
};
