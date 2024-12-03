import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getAllCurrencies } from '@/services/user-management/master-data';
import { Currency } from '@/types';

export const useCurrencies = (
  onSuccess?: (data: AxiosResponse<Currency[]>) => void,
  onError?: (error: any) => void,
) => {
  return useQuery({
    queryKey: ['getAllCurrencies'],
    queryFn: () => getAllCurrencies(),
    retry: false,
    onSuccess,
    onError,
  });
};
