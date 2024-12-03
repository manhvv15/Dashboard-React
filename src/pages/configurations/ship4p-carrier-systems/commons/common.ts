import { configs } from '@/constants/variables/environment';
import { IKeyValue } from '@/types';
import { CarrierStatusSearchEnum, ShippingRateEnum } from '@/types/enums/carrier';
import { FedexAccountTypies, UpsAccountTypies, UspsAccountTypies } from '@/types/ship4p/carrier';
import { TFunction } from 'i18next';

export const listStatusSearch = (t: TFunction) =>
  [
    {
      label: t('carrier.status.connect.search'),
      value: CarrierStatusSearchEnum.Connect,
    },
    {
      label: t('carrier.status.notConnect.search'),
      value: CarrierStatusSearchEnum.NotConnect,
    },
  ] as IKeyValue[];

export const listShippingTypeSearch = (t: TFunction) =>
  [
    {
      label: t('carrier.shippingType.local.search'),
      value: ShippingRateEnum.LocalDelivery,
    },
    {
      label: t('carrier.shippingType.crossBorderlocal.search'),
      value: ShippingRateEnum.CrossBorderDelivery,
    },
  ] as IKeyValue[];
export const ACTIONS_VALUE = {
  ACTIVE: 'active',
  DEACTIVE: 'deactive',
  REMOVE: 'remove',
  UPDATE: 'update',
  DETAIL: 'detail',
  WEBHOOK: 'webhook',
  ADD_ON: 'add-on',
};
export const CARRIER_ID = {
  GHN: 'GHN',
  JTExpress: 'JTExpress',
  JTExpressSing: 'JTExpressSing',
  JTExpressIndo: 'JTExpressIndo',
  JTExpressPH: 'JTExpressPH',
  GrabExpress: 'GrabExpress',
  NINJAVAN: 'NINJAVAN',
  PCSVN: 'PCSVN',
  VTPOST: 'VTPOST',
  VNPOST: 'VNPOST',
  EMS: 'EMS',
  AHAMOVE: 'AHAMOVE',
  SPX: 'SPX',
  DHL: 'DHL',
  DHLUS: 'DHLUS',
  FedExExpress: 'FedExExpress',
  FedExExpressUs: 'FedExExpressUs',
  GHTK: 'GHTK',
  USPSEMS: 'USPSEMS',
  USPS: 'USPS',
  UPS: 'UPS',
  EZBUYJP: 'EZBUYJP',
  BESTEXPRESS: 'BestExpress',
  HPWCARGO: 'HPWCARGO',
  ECMS: 'ECMS',
  SHIPPO: 'SHIPPO',
  SHIPPOUSPS: 'SHIPPOUSPS',
  SHIPPODHL: 'SHIPPODHL',
  SHIPPOFEDEX: 'SHIPPOFEDEX',
  SHIPPOUPS: 'SHIPPOUPS',
};
export const fielDefaultAccountTypeFedExExpress = {
  client_credentials: 'client_credentials',
};
export const fedexAccountType: FedexAccountTypies = {
  fedexAccountType: [
    { typeName: 'B2B-Proprietary', value: 'client_credentials' },
    { typeName: 'B2B-Proprietary-PC', value: 'client_pc_credentials' },
    { typeName: 'Compatible', value: 'csp_credentials' },
  ],
};
export const uspsAccountType: UspsAccountTypies = {
  uspsAccountType: [
    { typeName: 'EPS', value: 'EPS' },
    { typeName: 'PERMIT', value: 'PERMIT' },
  ],
};
export const upsAccountType: UpsAccountTypies = {
  upsAccountType: [
    { typeName: 'EPS', value: 'EPS' },
    { typeName: 'PERMIT', value: 'PERMIT' },
  ],
};
export const ConverUppercase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export const GuideConnectCarrierLink = {
  Guide: `${configs.VITE_PUBLIC_APP_ICHIBA}`,
  EMS_Web: `${configs.API_GATEWAY_URL}/account/login?redirectUrl=${configs.VITE_PUBLIC_APP_ICHIBA}`,
  VTP_Web: `${configs.VITE_PUBLIC_APP_VIETTEL_POST}/Account/Register`,
  Ahamove_Web: `${configs.VITE_PUBLIC_APP_AHAMOVE}/sign-in`,
  JTEXPRESS_Web: `${configs.VITE_PUBLIC_APP_JTEXPRESS}/#/register`,
  GHN_Web: `${configs.VITE_PUBLIC_APP_GHN}/register`,
  VNPOST_Web: `${configs.VITE_PUBLIC_APP_VNPOST}/dang-ky`,
  PCS_Web: `${configs.VITE_PUBLIC_APP_PCS}/account/dang-ky`,
  SPX_Web: `${configs.VITE_PUBLIC_APP_SPX}`,
  DHL_Web: `${configs.VITE_PUBLIC_APP_DHL}/jp/ja/registration.html`,
  DHL_US_Web: `${configs.VITE_PUBLIC_APP_DHL}/us/en/registration.html`,
  GRAP_Web: `${configs.VITE_PUBLIC_APP_GRAP}/download/`,
  FEDEX_Web: `${configs.VITE_PUBLIC_APP_FedEx}/en-vn/open-account.html`,
  Ghtk_Web: `${configs.VITE_PUBLIC_APP_GHTK}`,
  USPS_web: `${configs.VITE_PUCLIC_APP_USPS_VIA_EMS_REGISTER}/entreg/LoginAction_input`,
  UPS_web: `${configs.VITE_PUCLIC_APP_UPS_REGISTER}/?loc=en_US`,
  EZBUYJP_web: `${configs.VITE_PUBLIC_APP_EZBUY_LOGIN}/Account/Login`,
  bestEx_web: `${configs.VITE_PUBLIC_APP_BestExpress}/signup`,
  ninjavan_web: `${configs.VITE_PUBLIC_APP_NINJAVAN}/v2/signup`,
};
export const STATUS_ACTIVE_CARRIER = {
  DEACTIVE: false,
  ACTIVE: true,
};

export const CarrierDescription = (t: TFunction) => [
  {
    carrierId: 'GHN',
    descriprion: t('carrier.connect.ghn.description'),
  },
  {
    carrierId: 'JTExpress',
    descriprion: t('carrier.connect.jtExpress.description'),
  },
  {
    carrierId: 'NINJAVAN',
    descriprion: t('carrier.connect.ninjavan.description'),
  },
  {
    carrierId: 'AHAMOVE',
    descriprion: t('carrier.connect.ahamove.description'),
  },
  {
    carrierId: 'SPX',
    descriprion: t('carrier.connect.spx.description'),
  },
  {
    carrierId: 'DHL',
    descriprion: t('carrier.connect.dhl.description'),
  },
  {
    carrierId: 'DHLUS',
    descriprion: t('carrier.connect.dhlus.description'),
  },
  {
    carrierId: 'GrabExpress',
    descriprion: t('carrier.connect.grab.description'),
  },
  {
    carrierId: 'FedExExpress',
    descriprion: t('carrier.connect.fedex.description'),
  },
  {
    carrierId: 'EMS',
    descriprion: t('carrier.connect.ems.description'),
  },
  {
    carrierId: 'VTPOST',
    descriprion: t('carrier.connect.vtpost.description'),
  },
  {
    carrierId: 'VNPOST',
    descriprion: t('carrier.connect.vnpost.description'),
  },
  {
    carrierId: 'GHTK',
    descriprion: t('carrier.connect.ghtk.description'),
  },
  {
    carrierId: 'PCSVN',
    descriprion: t('carrier.connect.pcs.description'),
  },
];
export const listActionCarrier = (t: TFunction) =>
  [
    { label: t('carrier.active'), value: ACTIONS_VALUE.ACTIVE },
    { label: t('carrier.deactive'), value: ACTIONS_VALUE.DEACTIVE },
    { label: t('carrier.update'), value: ACTIONS_VALUE.UPDATE },
    { label: t('carrier.configShippingFee'), value: ACTIONS_VALUE.ADD_ON },
    { label: t('carrier.remove'), value: ACTIONS_VALUE.REMOVE },
  ] as IKeyValue[];
export const ProviderEnum = {
  EMS: 'EMS',
  PCSVN: 'PCSVN',
  VTPOST: 'VTPOST',
  VNPOST: 'VNPOST',
  JTEXPRESS: 'JTExpress',
  JTEXPRESSSING: 'JTExpressSing',
  JTEXPRESSINDO: 'JTExpressIndo',
  GHN: 'GHN',
  NINJAVAN: 'NINJAVAN',
  AHAMOVE: 'AHAMOVE',
  SPX: 'SPX',
  DHL: 'DHL',
  DHLUS: 'DHLUS',
  GrabExpress: 'GrabExpress',
  FedExExpress: 'FedExExpress',
  FedExExpressUs: 'FedExExpressUs',
  GHTK: 'GHTK',
  USPSEMS: 'USPSEMS',
  USPS: 'USPS',
  JTEXPRESSPH: 'JTExpressPH',
  UPS: 'UPS',
  EZBUYJP: 'EZBUYJP',
  BESTEXPRESS: 'BestExpress',
  ECMC: 'ECMS',
  SHIPPO: 'SHIPPO',
  SHIPPOUSPS: 'SHIPPOUSPS',
  SHIPPODHL: 'SHIPPODHL',
  SHIPPOFEDEX: 'SHIPPOFEDEX',
  SHIPPOUPS: 'SHIPPOUPS',
};
export const RedirectCarrier = [
  {
    carrierCode: ProviderEnum.AHAMOVE,
    linkUrl: `${configs.VITE_PUBLIC_APP_AHAMOVE}/sign-in`,
  },
  {
    carrierCode: ProviderEnum.DHL,
    linkUrl: `${configs.VITE_PUBLIC_APP_DHL}/jp/ja/registration.html`,
  },
  {
    carrierCode: ProviderEnum.DHLUS,
    linkUrl: `${configs.VITE_PUBLIC_APP_DHL}/us/en/registration.html`,
  },
  {
    carrierCode: ProviderEnum.EMS,
    linkUrl: `${configs.VITE_PUBLIC_APP_EMS}/login`,
  },
  {
    carrierCode: ProviderEnum.FedExExpress,
    linkUrl: `${configs.VITE_PUBLIC_APP_FedEx}/en-vn/open-account.html`,
  },
  {
    carrierCode: ProviderEnum.GHN,
    linkUrl: `${configs.VITE_PUBLIC_APP_GHN}/v2/ssoLogin?app=import&returnUrl=http://khachhang.ghn.vn/sso-login?token=`,
  },
  {
    carrierCode: ProviderEnum.GHTK,
    linkUrl: `${configs.VITE_PUBLIC_APP_GHTK}`,
  },
  {
    carrierCode: ProviderEnum.GrabExpress,
    linkUrl: `${configs.VITE_PUBLIC_APP_GRAP}/download/`,
  },
  {
    carrierCode: ProviderEnum.JTEXPRESS,
    linkUrl: `${configs.VITE_PUBLIC_APP_JTEXPRESS}/#/login`,
  },
  {
    carrierCode: ProviderEnum.PCSVN,
    linkUrl: `${configs.VITE_PUBLIC_APP_PCS}/account/dang-nhap`,
  },
  {
    carrierCode: ProviderEnum.SPX,
    linkUrl: `${configs.VITE_PUBLIC_APP_SPX}`,
  },
  {
    carrierCode: ProviderEnum.VNPOST,
    linkUrl: `${configs.VITE_PUBLIC_APP_VNPOST}/dang-nhap`,
  },
  {
    carrierCode: ProviderEnum.VTPOST,
    linkUrl: `${configs.VITE_PUBLIC_APP_VIETTEL_POST}/Account/Register`,
  },
  {
    carrierCode: ProviderEnum.USPSEMS,
    linkUrl: `${configs.VITE_PUCLIC_APP_USPS_VIA_EMS_REGISTER}/entreg/LoginAction_input`,
  },
  {
    carrierCode: ProviderEnum.UPS,
    linkUrl: `${configs.VITE_PUCLIC_APP_UPS_REGISTER}/?loc=en_US`,
  },
];
