import { PageResult } from '@/types/user-management/common';
import {
  DeletePricingModelRequest,
  PricingModelChangeLogsRequest,
  PricingModelChangeLogsResponse,
  PricingModelRequest,
  PricingModelResponse,
} from '@/types/user-management/configuration';
import { compileRequestURL } from '@/utils/common';

import { configuration } from '../configuration/endpoints';
import { instance } from '../xhr';

export const getPricingModel = (params: PricingModelRequest) => {
  return instance.get<PageResult<PricingModelResponse>>(configuration.getPricingModel, { params });
};

export const getPricingModelChangeLogs = (params: PricingModelChangeLogsRequest) => {
  return instance.get<PageResult<PricingModelChangeLogsResponse>>(
    compileRequestURL(configuration.getPricingModelChangeLogs, { id: params.id }),
    { params },
  );
};

export const deletePricingModel = (params: DeletePricingModelRequest) => {
  return instance.delete(compileRequestURL(configuration.deletePricingModel, { id: params.id }));
};
