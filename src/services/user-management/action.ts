import { AxiosResponse } from 'axios';

import {
  ActionPagingRequest,
  ActionPagingResponse,
  ActionByIdResponse,
  CreateActionRequest,
  UpdateActionRequest,
} from '@/types/user-management/action';
import { PageResult } from '@/types/user-management/common';
import { compileRequestURL } from '@/utils/common';

import { action } from './endpoints';

import { instance } from '../xhr';

export const getActionPaging = (params: ActionPagingRequest) => {
  return instance.get<PageResult<ActionPagingResponse>>(action.getPaging, { params });
};

export const getActionById = (id: string): Promise<AxiosResponse<ActionByIdResponse>> => {
  return instance.get<ActionByIdResponse>(compileRequestURL(action.getById, { id: id }));
};

export const createAction = (data: CreateActionRequest): Promise<AxiosResponse> => {
  return instance.post(action.create, data);
};

export const updateAction = (data: UpdateActionRequest): Promise<AxiosResponse> => {
  return instance.put(action.update, data);
};

export const deleteAction = (id: string): Promise<AxiosResponse> => {
  return instance.delete(compileRequestURL(action.delete, { id: id }));
};
