import { AxiosResponse } from 'axios';

import { StatusPlanEnum, UnitServiceModelEnum } from '@/constants/enums/common';
import {
  AgrregationTypeEnum,
  ApiPaginationResponse,
  Application,
  ChangeLog,
  ChargeModel,
  ChargeUnitResponse,
  CreatePlanRequest,
  CurrencyPricing,
  EditPlanRequest,
  FeatureApplicationGroup,
  GetFunctionList,
  GetPlansPagingQueryResponse,
  GetServiceModelsPagingQueryResponse,
  GetTreePermissionSystemByApplicationsQueryResponse,
  PlanDetail,
  PricingFeeInput,
  PricingFeeOutput,
  PricingFeeUpdate,
  ServiceModelDetail,
  ServiceModelTypeEnum,
} from '@/types/common';
import { compileRequestURL } from '@/utils/common';

import { configuration } from './endpoints';

import { instance } from '../xhr';

export const getPlans = (params?: {
  keyword?: string;
  applicationIds?: string[];
  status?: StatusPlanEnum;
  pageNumber?: number;
  pageSize?: number;
}): Promise<AxiosResponse<ApiPaginationResponse<GetPlansPagingQueryResponse>>> => {
  return instance.get(configuration.getPlans, { params: params });
};

export const getApplications = (): Promise<AxiosResponse<Application[]>> => {
  return instance.get(configuration.apps);
};
export const deletePlan = (id: string): Promise<AxiosResponse> => {
  return instance.delete(compileRequestURL(configuration.deletePlan, { id: id }));
};
export const changeLogPlan = (id: string): Promise<AxiosResponse<ChangeLog[]>> => {
  return instance.get(compileRequestURL(configuration.changeLog, { id: id }));
};
export const featureApplicationGroup = (ids: string[]): Promise<AxiosResponse<FeatureApplicationGroup[]>> => {
  return instance.get(configuration.featureApplicationGroups, { params: { applicationIds: ids } });
};

export const buildTrees = (
  ids: string[],
): Promise<AxiosResponse<GetTreePermissionSystemByApplicationsQueryResponse[]>> => {
  return instance.get(configuration.buildTrees, { params: { applicationIds: ids } });
};
export const createPlan = (data: CreatePlanRequest): Promise<AxiosResponse> => {
  return instance.post(configuration.createPlans, data);
};
export const detailPlan = (id: string): Promise<AxiosResponse<PlanDetail>> => {
  return instance.get(compileRequestURL(configuration.detailPlans, { id: id }));
};

export const editPlan = (data: EditPlanRequest): Promise<AxiosResponse> => {
  return instance.put(configuration.editPlans, data);
};

export const getServiceModels = (params?: {
  keyword?: string;
  units?: string[];
  pageNumber?: number;
  pageSize?: number;
}): Promise<AxiosResponse<ApiPaginationResponse<GetServiceModelsPagingQueryResponse>>> => {
  return instance.get(configuration.getServiceModels, { params: params });
};

export const createServiceModel = (data: {
  name: string;
  description?: string;
  unit?: string;
  type: ServiceModelTypeEnum;
  agrregationType: AgrregationTypeEnum;
}): Promise<AxiosResponse> => {
  return instance.post(configuration.createServiceModel, data);
};

export const getFunctionList = (params?: {
  applicationIds?: string[];
  units?: UnitServiceModelEnum;
}): Promise<AxiosResponse<GetFunctionList[]>> => {
  return instance.get(configuration.getFunctionList, { params: params });
};

export const deleteServiceModel = (id: string): Promise<AxiosResponse> => {
  return instance.delete(compileRequestURL(configuration.deleteServiceModel, { id: id }));
};
export const changeLogServiceModel = (id: string): Promise<AxiosResponse<ChangeLog[]>> => {
  return instance.get(compileRequestURL(configuration.changeLogServiceModel, { id: id }));
};
export const detailServiceModel = (id: string): Promise<AxiosResponse<ServiceModelDetail>> => {
  return instance.get(compileRequestURL(configuration.detailServiceModel, { id: id }));
};

export const editServiceModel = (data: {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  type: ServiceModelTypeEnum;
  agrregationType: AgrregationTypeEnum;
}): Promise<AxiosResponse> => {
  return instance.put(configuration.editServiceModel, data);
};
export const createPricing = (data: PricingFeeInput): Promise<AxiosResponse> => {
  return instance.post(configuration.fees, data);
};

export const editPricingFee = (data: PricingFeeUpdate): Promise<AxiosResponse> => {
  return instance.put(configuration.fees, data);
};

export const detailPricingFee = (id: string): Promise<AxiosResponse<PricingFeeOutput>> => {
  return instance.get(compileRequestURL(configuration.detailFees, { id }));
};

export const getChargeModel = (): Promise<AxiosResponse<ChargeModel[]>> => {
  return instance.get(configuration.chargeModel);
};
export const getChargeUnits = (): Promise<AxiosResponse<ChargeUnitResponse[]>> => {
  return instance.get(configuration.getChargeUnits);
};
export const getCurrencyByPricing = (): Promise<AxiosResponse<CurrencyPricing[]>> => {
  return instance.get(configuration.currencyByPricing);
};
