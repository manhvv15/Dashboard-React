import { PaginationRequest } from './common';

export interface ActionPagingResponse {
  id: string;
  code: string;
  name: string;
  displayOrder?: number;
  createdAt: string;
}

export interface ActionByIdResponse {
  id: string;
  code: string;
  name: string;
  displayOrder?: number;
}

export interface ActionPagingRequest extends PaginationRequest {}

export interface CreateActionRequest {
  code: string;
  name: string;
  displayOrder?: number;
}

export interface UpdateActionRequest {
  id: string;
  code: string;
  name: string;
  displayOrder?: number;
}
