import { PaginationRequest } from './common';

export interface ApplicationGroupPagingResponse {
  id: string;
  code: string;
  name: string;
  priority: number;
  createdAt: string;
}

export interface ApplicationGroupByIdResponse {
  id: string;
  code: string;
  name: string;
  priority: number;
}

export interface ApplicationGroupPagingRequest extends PaginationRequest {}

export interface CreateApplicationGroupRequest {
  code: string;
  name: string;
  priority: number;
}

export interface UpdateApplicationGroupRequest {
  id: string;
  code: string;
  name: string;
  priority: number;
}
