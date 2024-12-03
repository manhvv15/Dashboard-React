import {
  BillingCycleEnum,
  PeriodTypeEnum,
  PeriodTypeValueEnum,
  TrialTypeEnum,
  TrialTypeValueEnum,
} from '@/constants/enums/common';

import { PaginationRequest } from './common';

export interface PricingModelRequest extends PaginationRequest {
  workspaceId?: string;
  periods?: number[];
  trialTypes?: number[];
  effectiveDateStart?: Date;
  effectiveDateEnd?: Date;
  activated?: boolean;
  planIds?: string[];
}

export interface PricingModelResponse {
  activated: boolean;
  billing: {
    autoRenew: boolean;
    billingCycle: BillingCycleEnum;
    number?: number;
    trialType: TrialTypeEnum;
    trialTypeValue?: TrialTypeValueEnum;
  };
  createdAt: string;
  effectiveDateEnd?: string | null;
  effectiveDateStart: string;
  feeCurrencies: { currencyCode: string; amount: number }[];
  id: string;
  name: string;
  period: {
    number?: number;
    periodTypeValue?: PeriodTypeValueEnum;
    periodType: PeriodTypeEnum;
  };
  planId: string;
  planName: string;
  planCode: string;
}

export interface PricingModelChangeLogsRequest extends PaginationRequest {
  workspaceId: string;
  id: string;
}

export interface PricingModelChangeLogsResponse {}

export interface DeletePricingModelRequest {
  id: string;
}
