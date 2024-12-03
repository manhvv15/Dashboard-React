import { PaginationRequest } from './common';

export interface ObjectPagingResponse {
  id: string;
  code: string;
  name: string;
  parentId: string;
  createdAt: string;
}

export interface ObjectByIdResponse {
  id: string;
  code: string;
  name: string;
  parentId: string;
}

export interface ObjectPagingRequest extends PaginationRequest {}

export interface CreateObjectRequest {
  code: string;
  name: string;
  parentId?: string;
}
export interface UpdateObjectRequest {
  id: string;
  code: string;
  name: string;
  parentId?: string;
}
