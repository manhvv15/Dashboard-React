import { AxiosResponse } from 'axios';

import { PageResult } from '@/types/user-management/common';
import { compileRequestURL } from '@/utils/common';

import { applicationGroup } from './endpoints';

import {
  ApplicationGroupByIdResponse,
  ApplicationGroupPagingRequest,
  ApplicationGroupPagingResponse,
  CreateApplicationGroupRequest,
  UpdateApplicationGroupRequest,
} from '@/types/user-management/application-groups';
import { instance } from '../xhr';

export const getApplicationGroupPaging = (params: ApplicationGroupPagingRequest) => {
  return instance.get<PageResult<ApplicationGroupPagingResponse>>(applicationGroup.getPaging, { params });
};

export const getApplicationGroupById = (id: string): Promise<AxiosResponse<ApplicationGroupByIdResponse>> => {
  return instance.get<ApplicationGroupByIdResponse>(compileRequestURL(applicationGroup.getById, { id: id }));
};

export const createApplicationGroup = (data: CreateApplicationGroupRequest): Promise<AxiosResponse> => {
  return instance.post(applicationGroup.create, data);
};

export const updateApplicationGroup = (data: UpdateApplicationGroupRequest): Promise<AxiosResponse> => {
  return instance.put(applicationGroup.update, data);
};

export const deleteApplicationGroup = (id: string): Promise<AxiosResponse> => {
  return instance.delete(compileRequestURL(applicationGroup.delete, { id: id }));
};
