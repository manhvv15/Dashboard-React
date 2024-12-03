import {
  BillingCycleEnum,
  ChargeModelEnum,
  PeriodTypeEnum,
  PeriodTypeValueEnum,
  StatusApplicationEnum,
  StatusPlanEnum,
  TrialTypeEnum,
  TrialTypeValueEnum,
  UnitServiceModelEnum,
} from '@/constants/enums/common';
import { TreeNode } from '@ichiba/ichiba-core-ui';

export interface ApiPaginationPayload {
  pageSize: number;
  pageNumber: number;
  keyword?: string;
}

export interface ApiPaginationResponse<T> {
  items: T[];
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  summary?: string;
}

export interface ErrorCode {
  name: any;
  message: string;
  type: string;
}

export interface RolePermissionItem {
  objectName: string;
  objectCode: string;
  action: string;
  appCode: string;
}

export interface RolePermissionRequest {
  workspaceId: string | null | undefined;
  applicationCode: string;
}
export interface GetPlansPagingQueryResponse {
  id: string;
  name: string;
  code: string;
  description: string;
  status: StatusPlanEnum;
  isDefault: boolean;
  createdAt: string;
  applicationIds: string[];
  applications: {
    code: string;
    id: string;
    logoUrl: string;
    name: string;
    url: string;
  }[];
}
export interface Application {
  code: string;
  id: string;
  isDisabled: boolean;
  isShowShortName: boolean;
  logoUrl: string;
  name: string;
  shortName: string;
  url: string;
  workspaceCount: number;
  workspaceOwnerEmptyCount: number;
  workspaceRequired: boolean;
  workspaceSlug: null | string;
  order: number;
  status: StatusApplicationEnum;
}

export interface ChangeLog {
  id: string;
  createdAt: string;
  createdById: string;
  createdBy: string;
}

export interface FeatureApplicationGroup {
  id: string;
  name: string;
  description?: string;
  applicationId: string;
  features: { id: string; name: string; applicationId: string; description: string; checked?: boolean }[];
}

export interface PlanDetail {
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  description?: string;
  status: StatusPlanEnum;
  featureIds: string[];
  applicationIds: string[];
  planPermissions: PlanPermissionDto[];
  limitation: PlanLimitationDto;
}
export interface PlanLimitationDto {
  market: number;
  user: number;
}

export interface GetServiceModelsPagingQueryResponse {
  id: string;
  name: string;
  description?: string;
  unit: string;
  createAt: string;
  applications: {
    id: string;
    code: string;
    name: string;
    logoUrl: string;
    ulr: string;
  }[];
}

export interface GetFunctionList {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  unit: UnitServiceModelEnum;
}

export enum AgrregationTypeEnum {
  Count,
  CountUnique,
  Lastest,
  Max,
  Sum,
  Averrage,
  PerUnit,
}
export enum ServiceModelTypeEnum {
  Metered,
  Recurring,
}

export interface FormServiceModel {
  name: string;
  description?: string;
  unit: string;
  type: ServiceModelTypeEnum;
  agrregationType: AgrregationTypeEnum;
}

export interface ServiceModelDetail {
  id: string;
  name: string;
  description?: string;
  unit: string;
  type: ServiceModelTypeEnum;
  agrregationType: AgrregationTypeEnum;
}

export interface PricingFeeInput {
  planId: string;
  name: string;
  VATIncluded: boolean;
  isContactUs: boolean;
  effectiveDateStart: string;
  effectiveDateEnd?: string;
  period: {
    periodType: PeriodTypeEnum;
    number?: number;
    periodTypeValue?: PeriodTypeValueEnum;
  };
  billing: {
    trialType: TrialTypeEnum;
    number?: number;
    trialTypeValue?: TrialTypeValueEnum;
    billingCycle: BillingCycleEnum;
    autoRenew: boolean;
  };
  feeCurrencies: {
    currencyCode: string;
    amount: number;
  }[];
  feeServices: {
    serviceId: string;
    serviceName: string;
    chargeModel: ChargeModelEnum;
    unit: string;
    periodType: PeriodTypeEnum;
    billingCycle: BillingCycleEnum;
    orderByIndex: number;
    tiers: {
      index: number;
      firstUnit?: number;
      lastUnit?: number;
      tierUnit?: string;
      tierCurrencies: {
        currencyCode: string;
        unitFee?: number;
        flatFee?: number;
      }[];
    }[];
  }[];
}

export interface PricingFeeOutput extends PricingFeeInput {
  id: string;
}

export interface PricingFeeUpdate extends PricingFeeInput {
  id: string;
}

export interface ChargeModel {
  value: ChargeModelEnum;
  code: string;
  name: string;
  chargeUnits: {
    id: string;
    code: string;
    name: string;
    tableInputType: number;
    validationType: number;
    unitOfMeasures: {
      id: string;
      code: string;
      name: string;
    }[];
  }[];
}
export interface CurrencyPricing {
  id: string;
  name: string;
  code: string;
}

export interface ChargeUnitResponse {
  id: string;
  code: string;
  name: string;
  tableInputType: number;
  validationType: number;
  unitOfMeasures: {
    id: string;
    code: string;
    name: string;
  }[];
}

export interface GetTreePermissionSystemByApplicationsQueryResponse {
  applicationId: string;
  applicationName: string;
  logoUrl?: string;
  treeNodes: TreeNode[];
}

export interface CreatePlanRequest {
  name: string;
  description?: string;
  isDefault?: boolean;
  applicationIds: string[];
  limitation: PlanLimitationDto | null | undefined;
  planPermissions: PlanPermissionDto[];
}
export interface EditPlanRequest {
  id: string;
  name: string;
  description?: string;
  status: StatusPlanEnum;
  isDefault?: boolean;
  applicationIds: string[];
  limitation: PlanLimitationDto | null | undefined;
  planPermissions: PlanPermissionDto[];
}

export interface PlanPermissionDto {
  applicationId: string;
  permissionIds: string[];
}

export interface DataPlanInformationRequest {
  name: string;
  code: string | null;
  status: StatusPlanEnum;
  applicationIds: string[];
  isDefault: boolean;
  description?: string;
  limitation: PlanLimitationDto;
}

export interface PlanFunctionConfigurationRequest {
  applicationId: string;
  applicationName: string;
  logoUrl: string | null;
  permissionIds: string[] | null;
  treeNodes: TreeNode[];
}

export enum ScreenPlanEnum {
  Create,
  Duplicate,
  Edit,
}
