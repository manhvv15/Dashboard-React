import {
  ApplicationByIdResponse,
  ApplicationGroupResponse,
  ApplicationManagementRequest,
  ApplicationManagementResponse,
  ApplicationPagingRequest,
  ApplicationPagingResponse,
  ApplicationResponse,
  CreateApplicationRequest,
  GetAvailabeAppSystemByUserRequest,
  GetAvailabeAppSystemByUserResponse,
  UpdateApplicationRequest,
  UploadFile,
} from '@/types/user-management/application';
import { PageResult } from '@/types/user-management/common';

import { application, storage } from './endpoints';

import { compileRequestURL } from '@/utils/common';
import { AxiosResponse } from 'axios';
import { instance } from '../xhr';

export const getAll = () => {
  return instance.get<ApplicationResponse[]>(application.getAll);
};

export const getApplicationPaging = (params: ApplicationPagingRequest) => {
  return instance.get<PageResult<ApplicationPagingResponse>>(application.getPaging, { params });
};
export const getAvailableApplicationByUser = (params: GetAvailabeAppSystemByUserRequest) => {
  return instance.get<GetAvailabeAppSystemByUserResponse[]>(application.getAvailableByUser, { params });
};

export const getManagementApplication = (params: ApplicationManagementRequest) => {
  return instance.get<PageResult<ApplicationManagementResponse>>(application.getManagement, { params });
};

export const getApplicationById = (id: string): Promise<AxiosResponse<ApplicationByIdResponse>> => {
  return instance.get<ApplicationByIdResponse>(compileRequestURL(application.getById, { id: id }));
};

export const createApplication = (data: CreateApplicationRequest): Promise<AxiosResponse> => {
  return instance.post(application.create, data);
};

export const updateApplication = (data: UpdateApplicationRequest): Promise<AxiosResponse> => {
  return instance.put(application.update, data);
};

export const getUrlAvatar = (file: FormData): Promise<AxiosResponse<UploadFile>> => {
  return instance.post(storage, file);
};

export const getApplicationGroups = () => {
  return instance.get<ApplicationGroupResponse[]>(application.getApplicationGroups);
};
