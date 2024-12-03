import { AxiosResponse } from 'axios';

import { PageResult } from '@/types/user-management/common';
import {
  CreateObjectRequest,
  ObjectByIdResponse,
  ObjectPagingRequest,
  ObjectPagingResponse,
  UpdateObjectRequest,
} from '@/types/user-management/object';
import { compileRequestURL } from '@/utils/common';

import { object } from './endpoints';

import { instance } from '../xhr';

export const getObjectPaging = (params: ObjectPagingRequest) => {
  return instance.get<PageResult<ObjectPagingResponse>>(object.getPaging, { params });
};

export const getObjectById = (id: string): Promise<AxiosResponse<ObjectByIdResponse>> => {
  return instance.get<ObjectByIdResponse>(compileRequestURL(object.getById, { id: id }));
};

export const createObject = (data: CreateObjectRequest): Promise<AxiosResponse> => {
  return instance.post(object.create, data);
};

export const updateObject = (data: UpdateObjectRequest): Promise<AxiosResponse> => {
  return instance.put(object.update, data);
};

export const deleteObject = (id: string): Promise<AxiosResponse> => {
  return instance.delete(compileRequestURL(object.delete, { id: id }));
};
