import {
  AddOnShippingSettingRequest,
  GetCourierAccountByMarketViewModel,
  ICarrierDetail,
  IConnectCarrierBestExpress,
  IConnectCarrierDHL,
  IConnectCarrierECMS,
  IConnectCarrierEMS,
  IConnectCarrierEZbuyJP,
  IConnectCarrierFedExExpress,
  IConnectCarrierGHN,
  IConnectCarrierGhtk,
  IConnectCarrierGoShippo,
  IConnectCarrierGrabExpress,
  IConnectCarrierJTExpress,
  IConnectCarrierJTExpressIndo,
  IConnectCarrierJTExpressSing,
  IConnectCarrierNINJAVAN,
  IConnectCarrierPCSVN,
  IConnectCarrierSpx,
  IConnectCarrierUSPSViaEms,
  IConnectCarrierUpsExpress,
  IConnectCarrierUspsExpress,
  IConnectCarrierVNPOST,
  IConnectCarrierVTPOST,
  IConnectorCarrierAhamove,
  IModelIdResponse,
  ISearchCarrierSystemRequest,
} from '@/types/ship4p/carrier';
import { replaceString } from '@/utils/common';
import { AxiosResponse } from 'axios';
import { instance } from '../xhr';
import { courierSystem } from './endpoint';

export const getCarrierSystems = (
  data: ISearchCarrierSystemRequest,
): Promise<AxiosResponse<GetCourierAccountByMarketViewModel[]>> => {
  return instance.get(courierSystem.getAllCarrierSystem, {
    params: data,
  });
};
export const addOnShippingFeeSettings = (data: AddOnShippingSettingRequest): Promise<AxiosResponse<any>> => {
  return instance.put(courierSystem.shippingFeeSetting, data);
};
export const getDetailCourierDetail = (data: { id: string }): Promise<AxiosResponse<ICarrierDetail>> => {
  return instance.get(
    replaceString(
      [
        {
          valueIsReplace: '{id}',
          newValue: data.id,
        },
      ],
      courierSystem.getDetail,
    ),
  );
};
export const configWebhookUrl = (data: { id: string; webhookUrl: string }): Promise<AxiosResponse<any>> => {
  return instance.patch(courierSystem.configWebhookUrl, {
    data,
  });
};
export const createCarrierAccountSystem = (
  data:
    | IConnectCarrierEMS
    | IConnectCarrierGHN
    | IConnectCarrierJTExpress
    | IConnectCarrierJTExpressSing
    | IConnectCarrierJTExpressIndo
    | IConnectCarrierNINJAVAN
    | IConnectCarrierPCSVN
    | IConnectCarrierVNPOST
    | IConnectCarrierVTPOST
    | IConnectorCarrierAhamove
    | IConnectCarrierSpx
    | IConnectCarrierDHL
    | IConnectCarrierGrabExpress
    | IConnectCarrierFedExExpress
    | IConnectCarrierGhtk
    | IConnectCarrierUSPSViaEms
    | IConnectCarrierUspsExpress
    | IConnectCarrierUpsExpress
    | IConnectCarrierEZbuyJP
    | IConnectCarrierBestExpress
    | IConnectCarrierECMS
    | IConnectCarrierGoShippo,
): Promise<AxiosResponse<IModelIdResponse>> => {
  return instance.post(
    replaceString(
      [
        {
          valueIsReplace: '{courierId}',
          newValue: data.courierId!,
        },
        {
          valueIsReplace: '{accountId}',
          newValue: data.accountId!,
        },
      ],
      courierSystem.createCarrierSystem,
    ),
    data,
  );
};
export const setActiveCarrierSystem = (data: { id: string; status: boolean }): Promise<AxiosResponse<any>> => {
  return instance.put(courierSystem.changeStatusCarrierSystem, data);
};
export const deleleCarrierSystem = (data: { id: string }): Promise<AxiosResponse<any>> => {
  return instance.delete(courierSystem.deleteCarrierSystem, { data });
};
export const updateCarrierOwnSystem = (
  data:
    | IConnectCarrierEMS
    | IConnectCarrierGHN
    | IConnectCarrierJTExpress
    | IConnectCarrierJTExpressSing
    | IConnectCarrierJTExpressIndo
    | IConnectCarrierNINJAVAN
    | IConnectCarrierPCSVN
    | IConnectCarrierVNPOST
    | IConnectCarrierVTPOST
    | IConnectorCarrierAhamove
    | IConnectCarrierSpx
    | IConnectCarrierDHL
    | IConnectCarrierGrabExpress
    | IConnectCarrierFedExExpress
    | IConnectCarrierGhtk
    | IConnectCarrierUSPSViaEms
    | IConnectCarrierUspsExpress
    | IConnectCarrierUpsExpress
    | IConnectCarrierEZbuyJP
    | IConnectCarrierBestExpress
    | IConnectCarrierECMS
    | IConnectCarrierGoShippo,
): Promise<AxiosResponse<[]>> => {
  return instance.put(courierSystem.updateCarrierSystem, data);
};
