import { PageFilter } from '../user-management/common';

export interface IProxyWorkspacePagingFilter {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  countryCode?: string;
  subcribedDate?: string;
  expiredDate?: string;
}

export interface IProxyWorkspacePaging {
  items: IProxyWorkspace[];
}

export interface IProxyWorkspace {
  id: string;
  ip: string;
  port: string;
  username: string;
  password: string;
  type: string;
  usingFor: EProxyUsingFor;
  status: EProxyStatus;
  origin?: string;
}

export interface IProxySourceWorkspace {
  sourceId: string;
  sourceName: string;
  proxyInfos: IProxyInfo[];
  origin: string;
}

export interface IProxyInfo {
  id: string;
  ip: string;
  status: EProxyStatus;
}

export enum EProxyUsingFor {
  Crawler = 1,
  Bidding = 2,
  Both = 3,
}

export enum EProxyStatus {
  Active = 1,
  DeActive = 2,
}

export type IProxyWorkspaceAdd = Omit<IProxyWorkspace, 'id'>;
export type IProxyWorkspaceEdit = Partial<IProxyWorkspace>;

export interface IProxyWorkspaceFilter extends PageFilter {
  keyword?: string;
  origin?: string;
  usingFor?: EProxyUsingFor;
  status?: EProxyStatus;
}

export interface IProxySourceWorkspaceFilter {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
}

export interface IProxySourceWorkspaceModel {
  sourceId: string;
  proxyIds: string[];
}

export interface IOrigin {
  name: string;
  code: string;
  order?: number;
  status?: number;
  id: string;
  createdDate?: Date;
}

export interface IProxyPagingFilter {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  origin?: string;
}

export interface PageResponse<T> {
  totalPages: number;
  totalRecords: number;
  pageIndex: number;
  pageNumber: number;
  pageSize: number;
  items: T[];
}

export type ProxyOption = {
  disabled?: boolean;
  label?: string;
  value?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};
