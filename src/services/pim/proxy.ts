import {
  IProxySourceWorkspace,
  IProxySourceWorkspaceModel,
  IProxyWorkspace,
  IProxyWorkspaceAdd,
  IProxyWorkspaceEdit,
  IProxyWorkspaceFilter,
  PageResponse,
} from '@/types/pim/proxy';
import { removeNullProps, replaceString } from '@/utils/common';
import { AxiosResponse } from 'axios';
import { instance } from '../xhr';
import { proxy, proxyConfiguration } from './endpoint';

export const addProxyWorkspace = (payload: IProxyWorkspaceAdd): Promise<AxiosResponse> => {
  return instance.post(proxy.paging, payload);
};

export const checkProxyStatus = ({
  ip,
  port,
  username,
  password,
}: {
  ip: string;
  port: string;
  username: string;
  password: string;
}): Promise<AxiosResponse<boolean>> => {
  return instance.get(proxy.checkProxyStatus, {
    params: {
      ip,
      port,
      username,
      password,
    },
  });
};

export const deleteProxyWorkspace = (id: string): Promise<AxiosResponse> => {
  return instance.delete(
    replaceString(
      [
        {
          valueIsReplace: '{id}',
          newValue: id,
        },
      ],
      proxy.delete,
    ),
  );
};

export const getProxyWorkspace = ({
  keyword,
  pageIndex,
  pageSize,
  origin,
  status,
  usingFor,
}: IProxyWorkspaceFilter): Promise<AxiosResponse<PageResponse<IProxyWorkspace>>> => {
  return instance.get(proxy.paging, {
    params: {
      keyword,
      pageIndex,
      pageSize,
      origin,
      status,
      usingFor,
    },
  });
};

export const updateProxyWorkspace = (data: IProxyWorkspaceEdit): Promise<AxiosResponse> => {
  return instance.put(proxy.upsert, data);
};

export const getProxyWorkspaceById = (body: { id: string }): Promise<AxiosResponse<IProxyWorkspace>> => {
  return instance.get(
    replaceString(
      [
        {
          valueIsReplace: '{id}',
          newValue: body.id,
        },
      ],
      proxy.delete,
    ),
  );
};

export const upsertProxySourceWorkspace = (data: IProxySourceWorkspaceModel): Promise<AxiosResponse> => {
  return instance.post(proxyConfiguration.upsert, data);
};

export const getAllProxyWorkspace = (params?: any): Promise<AxiosResponse<IProxyWorkspace[]>> => {
  return instance.get(proxy.getAll, { params: removeNullProps(params) });
};

export const getProxySourceWorkspace = (): Promise<AxiosResponse<IProxySourceWorkspace[]>> => {
  return instance.get(proxyConfiguration.paging);
};

export const deleteProxySourceWp = (id: string): Promise<AxiosResponse> => {
  return instance.delete(
    replaceString(
      [
        {
          valueIsReplace: '{id}',
          newValue: id,
        },
      ],
      proxyConfiguration.delete,
    ),
  );
};
