import axios from 'axios';
import qs from 'qs';
import { v4 as uuidV4 } from 'uuid';

import { HttpStatus } from '@/constants/enums/common';
import { convertMessageCodeToCamelCase } from '@/utils/common';

import { auth } from './user-management/endpoints';

let abortAllRequest = false;
const errorSessionExpired = 444;

export const instance = axios.create({
  baseURL: '/api',
  timeout: 20000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      if (!abortAllRequest) {
        window.location.href = `${auth.login}${encodeURIComponent(window.location.href)}`;
        abortAllRequest = true;
      }
    }

    if (error.response.status === HttpStatus.BAD_REQUEST) {
      if (error.response.data instanceof Blob) {
        error.response.data = JSON.parse(await (error.response.data as Blob).text());
      }

      if (error.response.status === errorSessionExpired) {
        if (!abortAllRequest) {
          window.location.href = auth.logout;
          abortAllRequest = true;
        }
      }

      const errorNormal = error.response.data.error.errorCode;

      const errorF = {
        errorFrom: error.response.data.error && convertMessageCodeToCamelCase(error.response.data.error),
      };

      if (error.response.data.error.errorCode) {
        const newError = { errorNormal };
        return Promise.reject(convertMessageCodeToCamelCase(newError));
      }

      return Promise.reject<string[]>(errorF);
    }
    return Promise.reject(error);
  },
);

instance.interceptors.request.use(
  (config) => {
    config.headers.set('Accept', 'application/json;charset=UTF-8');
    config.headers.set('x-region', window.region);
    config.headers.set('x-language', window.language);
    config.headers.set('x-currency', window.currency);
    config.headers.set('x-time-zone-offset', new Date().getTimezoneOffset() / -60);
    config.headers.set('x-time-zone-offset', new Date().getTimezoneOffset() / -60);
    config.headers.set('x-request-id', uuidV4());
    config.headers.set('IdempotencyKey', config.headers.get('IdempotencyKey') ?? uuidV4());
    config.headers.set(
      'Cookie',
      '__BFF=CfDJ8FVtsCheyXRHpb_bZAU5VreWwL0n3WILEhaBdqiQW6zpSp3P8BU9DbPoSEvCQ2TxU531LAcMYK0TXYuT3UEyH2nhCmvbX2NTr0O5qJFyxwQyzFm8LfTgDHbd38Wwd8b7UrAWPj0WNAYQ6u8l3AySY3LQEnhia27MRYVMmTH51smjhlpk73rs859ALhsw-oZ23QAdT6mYDjOQpweZHQg6AviOTEAJffndXw_0AiRVOkU_rcw3oinhM5wxQ2gmWU3RZo8Ki5ngmxAMOYe324tUUy0oe_G-pemm5r-ziwX_4F_OYGjSJs99Sh7hO2dVjIfxEvGS_mhxoEgqPIcO4Z0m3ehGjOkKLwLEFv1FbWAFdYgRgbQ_VBWRtRawFppsGAmY18p_Wtp0D8nUg2WW4j6MVzPu9H8lIQpgiXRsfYgPMcIGJcPwH4kBlIvu4Dup7sH9Kc76e8oWQhFWN0Nr8LWVLnNDrKWBL0cGrS0VenqwUOs3wlUqouomixEghaF0JrSn-aS3yW2sVEJIa5GNDBum04mDcPiseTHihZA5nQSxgjX-1JiAlAOm0hRcYTAOvC3bYIscyiGg_UfrLlRwTlGP8o3gGyG_5TtxZC794wfYP4rtVJbVGXu8_jTRjzLq1Mo-Tss25YkwUN5Au5RZcSTZ_gi28xzpEKFsX6sJPWZ_o1G4LqlIhIs9eauttSxHNPQ2z68Wh2SsmbB6DhpoDZoHFbheNX-FlUkEIUjMIq67aM0o5FjPwhiAMRLhsMyu_eWb-O0DNgrHAPrVwv7J-wOu5bWe3e9DS7yI1RCUhr80FnO3TKwh03u8nUOqdZhzQhBzfAsAmlKelIR75JJ1r3eXQlmPpicfKtPgECJ-Os4R-n-kOUOMV8xKIg5z95lM2do4aisMV-ffgjEpcxktzueV8sAUQf3f95XwFeMc6VibA-ZN',
    );
    config.paramsSerializer = {
      ...(config.paramsSerializer ?? {}),
      serialize: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    };

    return config;
  },
  () => {},
);

export const instanceDocument = axios.create({
  baseURL: 'https://localhost:5111',
  timeout: 20000,
  withCredentials: true,
});
instanceDocument.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      if (!abortAllRequest) {
        abortAllRequest = true;
      }
    }

    if (error.response.status === HttpStatus.BAD_REQUEST) {
      if (error.response.data instanceof Blob) {
        error.response.data = JSON.parse(await (error.response.data as Blob).text());
      }

      if (error.response.status === errorSessionExpired) {
        if (!abortAllRequest) {
          window.location.href = auth.logout;
          abortAllRequest = true;
        }
      }

      const errorNormal = error.response.data.error.errorCode;

      const errorF = {
        errorFrom: error.response.data.error && convertMessageCodeToCamelCase(error.response.data.error),
      };

      if (error.response.data.error.errorCode) {
        const newError = { errorNormal };
        return Promise.reject(convertMessageCodeToCamelCase(newError));
      }

      return Promise.reject<string[]>(errorF);
    }
    return Promise.reject(error);
  },
);

instanceDocument.interceptors.request.use(
  (config) => {
    config.headers.set('Accept', 'application/json;charset=UTF-8');
    config.headers.set('x-region', window.region);
    config.headers.set('x-language', window.language);
    config.headers.set('x-currency', window.currency);
    config.headers.set('x-time-zone-offset', new Date().getTimezoneOffset() / -60);
    config.headers.set('x-time-zone-offset', new Date().getTimezoneOffset() / -60);
    config.headers.set('x-request-id', uuidV4());
    config.headers.set('IdempotencyKey', config.headers.get('IdempotencyKey') ?? uuidV4());
    config.headers.set(
      'Cookie',
      '__BFF=CfDJ8FVtsCheyXRHpb_bZAU5VreWwL0n3WILEhaBdqiQW6zpSp3P8BU9DbPoSEvCQ2TxU531LAcMYK0TXYuT3UEyH2nhCmvbX2NTr0O5qJFyxwQyzFm8LfTgDHbd38Wwd8b7UrAWPj0WNAYQ6u8l3AySY3LQEnhia27MRYVMmTH51smjhlpk73rs859ALhsw-oZ23QAdT6mYDjOQpweZHQg6AviOTEAJffndXw_0AiRVOkU_rcw3oinhM5wxQ2gmWU3RZo8Ki5ngmxAMOYe324tUUy0oe_G-pemm5r-ziwX_4F_OYGjSJs99Sh7hO2dVjIfxEvGS_mhxoEgqPIcO4Z0m3ehGjOkKLwLEFv1FbWAFdYgRgbQ_VBWRtRawFppsGAmY18p_Wtp0D8nUg2WW4j6MVzPu9H8lIQpgiXRsfYgPMcIGJcPwH4kBlIvu4Dup7sH9Kc76e8oWQhFWN0Nr8LWVLnNDrKWBL0cGrS0VenqwUOs3wlUqouomixEghaF0JrSn-aS3yW2sVEJIa5GNDBum04mDcPiseTHihZA5nQSxgjX-1JiAlAOm0hRcYTAOvC3bYIscyiGg_UfrLlRwTlGP8o3gGyG_5TtxZC794wfYP4rtVJbVGXu8_jTRjzLq1Mo-Tss25YkwUN5Au5RZcSTZ_gi28xzpEKFsX6sJPWZ_o1G4LqlIhIs9eauttSxHNPQ2z68Wh2SsmbB6DhpoDZoHFbheNX-FlUkEIUjMIq67aM0o5FjPwhiAMRLhsMyu_eWb-O0DNgrHAPrVwv7J-wOu5bWe3e9DS7yI1RCUhr80FnO3TKwh03u8nUOqdZhzQhBzfAsAmlKelIR75JJ1r3eXQlmPpicfKtPgECJ-Os4R-n-kOUOMV8xKIg5z95lM2do4aisMV-ffgjEpcxktzueV8sAUQf3f95XwFeMc6VibA-ZN',
    );
    config.paramsSerializer = {
      ...(config.paramsSerializer ?? {}),
      serialize: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    };

    return config;
  },
  () => {},
);
