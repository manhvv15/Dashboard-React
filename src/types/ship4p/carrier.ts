import { AddOnTypeEnum, CarrierStatusEnum, CarrierStatusSearchEnum, ShippingRateEnum } from '../enums/carrier';

export interface GetCouriersResponse {
  id?: string;
  code?: string;
  name?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  status?: CarrierStatusEnum;
  countryId?: string | null;
  countryCode?: string | null;
  isLocal?: boolean;
  isCrossBorder?: boolean;
  currency?: string;
}
export interface CarrierSystemDetail {
  description?: string;
  countryId?: string | null;
  countryCode?: string | null;
  isLocal?: boolean;
  isCrossBorder?: boolean;
  carrierName?: string;
  id?: string;
  courierId?: string;
  accountId?: string;
  logoUrl?: string | null;
  desc?: string | null;
  active?: boolean | null;
  webHookLink?: string | null;
  isMultiplePackage?: boolean | null;
  addOnAmount?: number | null;
  addOnType?: AddOnTypeEnum | null;
}
export interface FilterCarrierParams {
  countryIds?: string[] | undefined;
  status?: CarrierStatusSearchEnum[] | undefined;
  shippingTypies?: ShippingRateEnum[] | undefined;
  keyword?: string | undefined;
}
export interface ISearchCarrierSystemRequest {
  _keyword?: string | null;
  status?: CarrierStatusSearchEnum[] | null;
  countryIds?: string[] | null;
  courierIds?: string[] | null;
  createdAtFrom?: string | null;
  shippingTypies?: ShippingRateEnum[] | undefined;
  createdAtTo?: string | null;
  pageSize?: number;
  pageNumber?: number;
}
export interface CourierWebhookConfig {
  id: string;
  webhoookLink: string;
}
export interface CourierAccountViewModel {
  key: string;
  carrierAccountId?: string;
  id?: string;
  accountSystemId?: string;
  courierId: string;
  courierName: string;
  accountId: string;
  shortDesc: string;
  active?: boolean;
  refId?: string;
  imageUrl: string;
  isDisable?: boolean;
  webHookLink?: string | null;
  baseWebHookUrl?: string | null;
  settings: { [key: string]: string };
  status?: CarrierStatusEnum;
  isLocal: boolean;
  isCrossBorder: boolean;
  addOnAmount?: number | null;
  addOnType?: AddOnTypeEnum | null;
  currency?: string;
}
export interface ICarrierDetailEms extends ICarrierDetail {
  settings: ICarrierSettingEms;
}
export interface IListCarrierExample {
  courierId: string;
  courierName: string;
  icon: string;
}
export interface IListCarrier {
  id: string;
  courierId: string;
  courierName?: string;
  accountId: string;
  shortDesc: string;
  active: boolean;
  refId?: string | null;
  imageUrl?: string;
  isDisable?: boolean;
  settings: ICarrierSettings;
  courierShippingServices?: string;
  baseWebHookUrl?: string | null;
  webHookLink?: string;
}
export interface ICarrierSettings {
  ghn_shopId: string;
  ghn_clientId: string;
  ghn_password: string;
  ghn_tokenApi: string;
  ghn_username: string;
  ghn_description: string;
}
export interface ICarrierDetailEzbuy extends ICarrierDetail {
  settings: ICarrierSettingEzbuyJp;
}
export interface ICarrierDetailFefexExpress extends ICarrierDetail {
  settings: ICarrierSettingFedexExpress;
}
export interface ICarrierDetailGhtk extends ICarrierDetail {
  settings: ICarrierSettingGhtk;
}
export interface ICarrierSettingGhtk {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  phoneNumber: string;
  token: string;
  shiping_services: string | number;
}
export interface AccountType {
  typeName: string;
  value: string;
}
export interface FedexAccountTypies {
  fedexAccountType: AccountType[];
}
export interface CourierViewModel {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  countryCode: string | null;
}
export interface UspsAccountTypies {
  uspsAccountType: AccountType[];
}
export interface UpsAccountTypies {
  upsAccountType: AccountType[];
}
export interface ICarrierSettingFedexExpress {
  slug: string;
  accountId: string;
  courierId: string;
  fedexJp_clientId: string;
  fedexJp_clientSecret?: string;
  fedexJp_userName: string;
  fedexJp_childKey: string;
  fedexJp_childSecret: string;
  fedexJp_accountType: string;
  fedexJp_accountNumber: string;
}
export interface ICarrierSettingEzbuyJp {
  accountId: string;
  courierId: string;
  ezbuy_accountName: string;
  ezbuy_partnerkey: string;
  ezbuy_customerCode: string;
}
export interface ICarrierDetailGhn extends ICarrierDetail {
  settings: ICarrierSettingGhn;
}
export interface ICarrierDetailJTExpress extends ICarrierDetail {
  settings: ICarrierSettingJTExpress;
}
export interface ICarrierDetailNinjavan extends ICarrierDetail {
  settings: ICarrierSettingNinjavan;
}
export interface ICarrierDetailVnPost extends ICarrierDetail {
  settings: ICarrierSettingVnPost;
}
export interface ICarrierDetailPcs extends ICarrierDetail {
  settings: ICarrierSettingPcs;
}
export interface ICarrierDetailVtPost extends ICarrierDetail {
  settings: ICarrierSettingVtPost;
}
export interface IConnectCarrierBestExpress extends IConnectCarrier {
  bestex_username: string;
  bestex_password: string;
}
export interface ICarrierDetailSpx extends ICarrierDetail {
  settings: ICarrierSettingSpx;
}
export interface ICarrierDetailDhl extends ICarrierDetail {
  settings: ICarrierSettingDhl;
}
export interface ICarrierDetailGrabExpress extends ICarrierDetail {
  settings: ICarrierSettingGrabExpress;
}
export interface ICarrierDetailAhamove extends ICarrierDetail {
  settings: ICarrierSettingAhamove;
}
export interface IConnectorCarrierAhamove extends IConnectCarrier {
  ahamove_userName: string;
  ahamove_phoneNumber: string;
}
export interface IConnectCarrier {
  courierId?: string;
  accountId?: string;
  currency?: string;
  addOnAmount?: number | null;
  addOnType?: AddOnTypeEnum | null;
  isMultiplePackage?: boolean;
  id?: string;
}
export interface ICarrierDetailUpsExpress extends ICarrierDetail {
  settings: ICarrierSettingUpsExpress;
}
export interface ICarrierDetailUSPSVia extends ICarrierDetail {
  settings: ICarrierSettingUSPS;
}
export interface ICarrierDetailUspsExpress extends ICarrierDetail {
  settings: ICarrierSettingUspsExpress;
}
export interface ICarrierSettingUspsExpress {
  slug: string;
  accountId: string;
  courierId: string;
  usps_mid?: string;
  usps_crid?: string;
  usps_clientId: string;
  usps_clientSecret?: string;
  usps_userName: string;
  usps_accountType: string;
  usps_accountNumber: string;
  usps_paymentMID?: string;
  usps_paymentCRID?: string;
  usps_paymentAccountType?: string;
  usps_paymentAccountNumber?: string;
  usps_paymentManifestMID?: string;
}
export interface ICarrierSettingUSPS {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  usps_usename: string;
  usps_password: string;
  usps_customer_code: string;
}
export interface ICarrierSettingUpsExpress {
  slug: string;
  accountId: string;
  courierId: string;
  ups_redirectUri: string;
  ups_responseType: string;
  ups_clientId: string;
}
export interface IConnectCarrierGrabExpress extends IConnectCarrier {
  grab_clientId: string;
  grab_clientSecret?: string;
  grab_username: string;
}
export interface IConnectCarrierGhtk extends IConnectCarrier {
  phoneNumber: string;
  token: string;
  shiping_services: number | string;
}

export interface IConnectCarrierFedExExpress extends IConnectCarrier {
  fedexJp_clientId: string;
  fedexJp_clientSecret?: string;
  fedexJp_userName: string;
  fedexJp_accountType: string;
  fedexJp_childKey: string;
  fedexJp_childSecret: string;
  fedexJp_accountNumber: string;
}
export interface IConnectCarrierDHL extends IConnectCarrier {
  dhl_userName: string;
  dhl_apiKey: string;
  dhl_apiSecret: string;
  dhl_accountNumber: string;
}
export interface IConnectCarrierGoShippo extends IConnectCarrier {
  token: string;
  email: string;
}
export interface IConnectCarrierECMS extends IConnectCarrier {
  clientId: string;
  account: string;
  token: string;
  userName?: string;
}
export interface ICarrierDetailECMS extends ICarrierDetail {
  settings: ICarrierSettingECMS;
}
export interface ICarrierDetailShippo extends ICarrierDetail {
  settings: ICarrierSettingShippo;
}

export interface ICarrierSettingECMS {
  accountId: string;
  courierId: string;
  clientId: string;
  account: string;
  token: string;
}

export interface ICarrierSettingShippo {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  token: string;
  email: string;
}
export interface IConnectCarrierSpx extends IConnectCarrier {
  appId: string;
  appSecret: string;
  userId: string;
  userSecretKey: string;
  shiping_services: number | string;
}
export interface IConnectCarrierJTExpress extends IConnectCarrier {
  jtExpress_customerId: string;
}
export interface IConnectCarrierJTExpressSing extends IConnectCarrier {
  jtExpress_password: string;
  jtExpress_email: string;
}
export interface IConnectCarrierJTExpressIndo extends IConnectCarrier {
  jtExpress_password: string;
  jtExpress_username: string;
  jtExpress_apikey: string;
}
export interface IConnectCarrierPCSVN extends IConnectCarrier {
  pcs_token: string;
  pcs_accountId: string;
  pcs_username: string;
  pcs_password: string;
}
export interface IConnectCarrierNINJAVAN extends IConnectCarrier {
  ninjavan_name: string;
  ninjavan_clientId: string;
  ninjavan_secret: string;
  ninjavan_countryCode: string;
}

export interface IConnectCarrierGHN extends IConnectCarrier {
  ghn_shopId: string;
  ghn_clientId: string;
  ghn_description?: string;
  ghn_password: string;
  ghn_tokenApi: string;
  ghn_username: string;
}
export interface IConnectCarrierEMS extends IConnectCarrier {
  ems_username: string;
  ems_tokenKey: string;
  ems_accessKey: string;
  ems_secretKey: string;
}
export interface GetCourierAccountByMarketViewModel {
  countryId: string;
  countryCode: string;
  countryName: string;
  courierViewModels?: CourierAccountViewModel[];
}

export interface IConnectCarrierUSPSViaEms extends IConnectCarrier {
  usps_usename: string;
  usps_password: string;
  usps_customer_code: string;
}
export interface IConnectCarrierVNPOST extends IConnectCarrier {
  vnpost_token: string;
  vnpost_username: string;
  vnpost_password: string;
  vnpost_pickupPoscode: string;
  vnpost_customer_code: string;
  vnpost_contract_code: string;
}
export interface IModelIdResponse {
  id: string;
}
export interface IConnectCarrierEZbuyJP extends IConnectCarrier {
  ezbuy_accountName: string;
  ezbuy_partnerkey: string;
  ezbuy_customerCode: string;
}
export interface IConnectCarrierUpsExpress extends IConnectCarrier {
  ups_clientId: string;
  ups_redirectUri?: string;
  ups_responseType: string;
}
export interface IConnectCarrierUspsExpress extends IConnectCarrier {
  usps_clientId: string;
  usps_clientSecret?: string;
  usps_mid?: string;
  usps_crid?: string;
  usps_userName: string;
  usps_accountType: string;
  usps_accountNumber: string;
  usps_paymentMID?: string;
  usps_paymentCRID?: string;
  usps_paymentAccountType?: string;
  usps_paymentAccountNumber?: string;
  usps_paymentManifestMID?: string;
}
export interface IConnectCarrierVTPOST extends IConnectCarrier {
  vtpost_contractId: string;
  vtpost_email: string;
  vtpost_phoneNumber: string;
  vtpost_username: string;
  vtpost_password: string;
  vtpost_token: string;
}
export interface ICarrierSettingAhamove {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  ahamove_userName: string;
  ahamove_phoneNumber: string;
  ahamove_apiKey: string;
}
export interface ICarrierSettingGrabExpress {
  slug: string;
  accountId: string;
  courierId: string;
  grab_clientId: string;
  grab_clientSecret?: string;
  grab_username: string;
}
export interface ICarrierSettingDhl {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  dhl_userName: string;
  dhl_password: string;
  dhl_apikey: string;
  dhl_apiSecret: string;
  dhl_accountNumber: string;
}
export interface ICarrierSettingSpx {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  appId: string;
  appSecret: string;
  userId: string;
  userSecretKey: string;
  shiping_services: string | number;
}
export interface ICarrierSettingVtPost {
  accountId: string;
  courierId: string;
  vtpost_token: string;
  workspaceSlug: string;
  vtpost_password: string;
  vtpost_username: string;
  vtpost_contractId: string;
}
export interface ICarrierDetailBestExpress extends ICarrierDetail {
  settings: ICarrierSettingBestExpress;
}
export interface ICarrierSettingBestExpress {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  bestex_username: string;
  bestex_password: string;
}
export interface ICarrierSettingVnPost {
  accountId: string;
  courierId: string;
  vnpost_token: string;
  workspaceSlug: string;
  vnpost_password: string;
  vnpost_username: string;
  vnpost_pickupPoscode: string;
  vnpost_customer_code: string;
  vnpost_contract_code: string;
}
export interface ICarrierSettingPcs {
  accountId: string;
  courierId: string;
  pcs_token: string;
  pcs_password: string;
  pcs_username: string;
  pcs_accountId: string;
  workspaceSlug: string;
}
export interface ICarrierSettingNinjavan {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  ninjavan_name: string;
  ninjavan_clientId: string;
  ninjavan_secret: string;
  ninjavan_countryCode: string;
}
export interface ICarrierSettingJTExpress {
  accountId: string;
  courierId: string;
  workspaceSlug: string;
  jtExpress_customerId: string;
  jtExpress_keyEncrypt: string;
  jtExpress_ecCompanyId: string;
  jtExpress_email: string;
  jtExpress_username: string;
  jtExpress_password: string;
  jtExpress_apikey: string;
}
export interface ICarrierSettingGhn {
  slug: string;
  accountId: string;
  courierId: string;
  ghn_shopId: string;
  ghn_clientId: string;
  ghn_password: string;
  ghn_tokenApi: string;
  ghn_username: string;
}
export interface ICarrierSettingEms {
  accountId: string;
  courierId: string;
  ems_tokenKey: string;
  ems_accessKey: string;
  ems_secretKey: string;
  ems_username: string;
  workspaceSlug: string;
}
export interface AddOnShippingSettingRequest {
  id: string;
  addOnAmount?: number;
  addOnType?: AddOnTypeEnum;
}
export interface ICarrierDetail {
  description?: string;
  currency?: string;
  countryId?: string | null;
  countryCode?: string | null;
  isLocal?: boolean;
  isCrossBorder?: boolean;
  carrierName?: string;
  createdAt?: string;
  id?: string;
  courierId: string;
  accountId?: string;
  logoUrl?: string | null;
  desc?: string | null;
  active?: boolean | null;
  webHookLink?: string | null;
  isMultiplePackage?: boolean | null;
  addOnAmount?: number | null;
  addOnType?: AddOnTypeEnum;
}
export interface ICarrierDetailSetting {
  accountId: string;
  ghn_username?: string;
  ems_tokenKey?: string;
  jtExpress_customerId?: string;
  vnpost_token?: string;
  ninjavan_clientId?: string;
  pcs_token?: string;
  vtpost_contractId?: string;
}
