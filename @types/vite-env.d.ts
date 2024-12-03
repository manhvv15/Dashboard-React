/// <reference types="./vite-plugin-svgr.d.ts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GATEWAY: string;
  readonly VITE_GTAG_ID: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_ORG_BASE_URL: string;
  readonly VITE_PUBLIC_APP_VIETTEL_POST: string;
  readonly VITE_PUBLIC_APP_AHAMOVE: string;
  readonly VITE_PUBLIC_APP_JTEXPRESS: string;
  readonly VITE_PUBLIC_APP_PCS: string;
  readonly VITE_PUBLIC_APP_GHN: string;
  readonly VITE_PUBLIC_APP_VNPOST: string;
  readonly VITE_PUBLIC_APP_DHL: string;
  readonly VITE_PUBLIC_APP_GRAP: string;
  readonly VITE_PUBLIC_APP_FedEx: string;
  readonly VITE_PUBLIC_APP_EMS: string;
  readonly VITE_PUBLIC_APP_SPX: string;
  readonly VITE_PUBLIC_APP_GHTK: string;
  readonly VITE_PUBLIC_APP_USPS_VIA_EMS: string;
  readonly VITE_PUCLIC_APP_USPS_VIA_EMS_REGISTER: string;
  readonly VITE_PUCLIC_APP_UPS_REGISTER: string;
  readonly VITE_PUBLIC_APP_EZBUY_LOGIN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
