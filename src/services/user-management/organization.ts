import { AxiosResponse } from 'axios';

import { PageResult } from '@/types/user-management/common';
import {
  AddRolesToOrganizationsRequest,
  CreateOrganizationRequest,
  DeleteOrganizationApplicationRequest,
  DeleteOrganizationResponse,
  DeleteOrganizationUserRequest,
  OrderOrganizationRequest,
  OrganizationByIdRequest,
  OrganizationByIdResponse,
  OrganizationPagingRequest,
  OrganizationPagingResponse,
  UpdateApplicationRolesByOrganizationRequest,
  UpdateOrganizationRequest,
} from '@/types/user-management/organization';
import { compileRequestURL } from '@/utils/common';

import { organization } from './endpoints';

import {
  GetAvailableRoleByOrganizationIdRequest,
  GetAvailableRoleByUserIdResponse,
} from '@/types/user-management/role';
import { instance } from '../xhr';

export const getOrganizationPaging = (params: OrganizationPagingRequest) => {
  return instance.get<PageResult<OrganizationPagingResponse>>(organization.getPaging, { params });
};

export const getDetailOrganization = (
  params: OrganizationByIdRequest,
): Promise<AxiosResponse<OrganizationByIdResponse>> => {
  return instance.get<OrganizationByIdResponse>(organization.getById, { params: params });
};

export const createOrganization = (data: CreateOrganizationRequest): Promise<AxiosResponse<string>> => {
  return instance.post(organization.create, data);
};

export const updateOrganization = (data: UpdateOrganizationRequest): Promise<AxiosResponse> => {
  return instance.put(organization.update, data);
};

export const deleteOrganization = (id: string): Promise<AxiosResponse<DeleteOrganizationResponse>> => {
  return instance.delete(compileRequestURL(organization.delete, { id: id }));
};

export const getAvailableRolesByOrganizationId = (params: GetAvailableRoleByOrganizationIdRequest) => {
  return instance.get<GetAvailableRoleByUserIdResponse[]>(organization.getAvailableRolesForOrganization, { params });
};

export const addRolesToOrganizations = (data: AddRolesToOrganizationsRequest): Promise<AxiosResponse> => {
  return instance.post(organization.addRolesToOrganizations, data);
};

export const deleteOrganizationApplication = (data: DeleteOrganizationApplicationRequest): Promise<AxiosResponse> => {
  return instance.post(organization.deleteOrganizationApplication, data);
};

export const deleteOrganizationUser = (data: DeleteOrganizationUserRequest): Promise<AxiosResponse> => {
  return instance.post(organization.deleteOrganizationUser, data);
};

export const orderOrganization = (data: OrderOrganizationRequest): Promise<AxiosResponse<string>> => {
  return instance.post(organization.order, data);
};

export const updateApplicationRoleByOrganization = (
  data: UpdateApplicationRolesByOrganizationRequest,
): Promise<AxiosResponse> => {
  return instance.put(organization.updateApplicationRolesByOrganization, data);
};
