import { ApiPaginationResponse } from '@/types/common';
import { GetCouriersResponse } from '@/types/ship4p/carrier';
import { AxiosResponse } from 'axios';
import { instance } from '../xhr';
import { courier } from './endpoint';

export const getAllCourier = (data: {
  keyword?: string;
  countryId?: string;
}): Promise<AxiosResponse<ApiPaginationResponse<GetCouriersResponse>>> => {
  return instance.get(courier.getAllCourier, {
    params: data,
  });
};
