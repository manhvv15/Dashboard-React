import { AxiosResponse } from 'axios';

import { PageResult } from '@/types/user-management/common';
import { UpdateOrganizationRequest } from '@/types/user-management/organization';
import {
  CreateRoleRequest,
  DeleteRoleResponse,
  DeleteUserRoleRequest,
  GetAvailableRoleByUserIdRequest,
  GetAvailableRoleByUserIdResponse,
  RoleByIdResponse,
  RolePagingRequest,
  RolePagingResponse,
  UpdateRoleRequest,
} from '@/types/user-management/role';
import { compileRequestURL } from '@/utils/common';

import { organization, role, user } from './endpoints';

import { instance } from '../xhr';

export const getRolePaging = (params: RolePagingRequest) => {
  return instance.get<PageResult<RolePagingResponse>>(role.getPaging, { params });
};

export const createRole = (data: CreateRoleRequest): Promise<AxiosResponse> => {
  return instance.post(role.create, data);
};

export const updateRole = (data: UpdateRoleRequest): Promise<AxiosResponse> => {
  return instance.put(role.update, data);
};

export const deleteRole = (id: string): Promise<AxiosResponse<DeleteRoleResponse>> => {
  return instance.delete(compileRequestURL(role.delete, { id: id }));
};

export const getRoleById = (id: string): Promise<AxiosResponse<RoleByIdResponse>> => {
  return instance.get<RoleByIdResponse>(compileRequestURL(role.getById, { id: id }));
};

export const updateOrganization = (data: UpdateOrganizationRequest): Promise<AxiosResponse> => {
  return instance.put(organization.update, data);
};

export const deleteUserRole = (data: DeleteUserRoleRequest): Promise<AxiosResponse> => {
  return instance.post(role.deleteUserRole, data);
};

export const getAvailableRolesByUserId = (params: GetAvailableRoleByUserIdRequest) => {
  return instance.get<GetAvailableRoleByUserIdResponse[]>(
    compileRequestURL(user.getAvailableRoleForUser, { id: params.userId }),
    { params },
  );
};
