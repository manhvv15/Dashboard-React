import axios, { AxiosResponse } from 'axios';

import { Currency } from '@/types';
import { LanguageResponse } from '@/types/user-management/common';
import { CountryApi, IpInfo } from '@/types/user-management/master-data';

import { masterData, userManagement } from './endpoints';

import { instance } from '../xhr';

export const getIpInfo = () => {
  return axios.get<IpInfo>(masterData.IP);
};

export const getAllLanguage = (): Promise<AxiosResponse<LanguageResponse[]>> => {
  return instance.get<LanguageResponse[]>(masterData.languages);
};
export const getAllCurrencies = (): Promise<AxiosResponse<Currency[]>> => {
  return instance.get(userManagement.currency);
};

export const getAllCountries = (): Promise<AxiosResponse<CountryApi[]>> => {
  return instance.get<CountryApi[]>(`${userManagement.country}/?onlyRegion=${false}`);
};
