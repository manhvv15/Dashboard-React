import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getActionPaging } from '@/services/user-management/action';
import { getApplicationPaging } from '@/services/user-management/application';
import { getObjectPaging } from '@/services/user-management/object';
import { ActionPagingResponse } from '@/types/user-management/action';
import { ApplicationPagingResponse } from '@/types/user-management/application';
import { PageResult } from '@/types/user-management/common';
import { ObjectPagingResponse } from '@/types/user-management/object';

interface Params<T> {
  onSuccess?: (data: AxiosResponse<T>) => void;
  onError?: (error: any) => void;
}
interface ParamsApplication<T> {
  isSystem: boolean | null;
  onSuccess?: (data: AxiosResponse<T>) => void;
  onError?: (error: any) => void;
}

export const useGetApplication = ({
  isSystem,
  onSuccess,
  onError,
}: ParamsApplication<PageResult<ApplicationPagingResponse>>) =>
  useQuery({
    queryKey: ['getAllApplication'],
    queryFn: () =>
      getApplicationPaging({
        pageNumber: 0,
        pageSize: 1000,
        keyword: '',
        isSystem: isSystem,
      }),
    onSuccess,
    onError,
  });

export const useGetObject = ({ onSuccess, onError }: Params<PageResult<ObjectPagingResponse>>) =>
  useQuery({
    queryKey: ['getAllObject'],
    queryFn: () =>
      getObjectPaging({
        pageNumber: 0,
        pageSize: 10000,
        keyword: '',
      }),
    onSuccess,
    onError,
  });

export const useGetAction = ({ onSuccess, onError }: Params<PageResult<ActionPagingResponse>>) =>
  useQuery({
    queryKey: ['getAllAction'],
    queryFn: () =>
      getActionPaging({
        pageNumber: 0,
        pageSize: 1000,
        keyword: '',
      }),
    onSuccess,
    onError,
  });
