import { AxiosResponse } from 'axios';

import { PageResult } from '@/types/user-management/common';
import { UserByIdResponse } from '@/types/user-management/user';
import { compileRequestURL } from '@/utils/common';

import { customer } from './endpoints';

import { CustomerPagingRequest, CustomerPagingResponse } from '@/types/user-management/customer';
import { instance } from '../xhr';

export const getCustomerById = (id: string): Promise<AxiosResponse<UserByIdResponse>> => {
  return instance.get<UserByIdResponse>(compileRequestURL(customer.detail, { id: id }));
};

export const getCustomerPaging = (params: CustomerPagingRequest) => {
  return instance.get<PageResult<CustomerPagingResponse>>(customer.getCustomerPaging, { params });
};
