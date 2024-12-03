export const REGEX_ORGANIZATION_CODE: RegExp = /^[a-zA-Z0-9_]*$/;
export const REGEX_EMAIL: RegExp =
  // eslint-disable-next-line max-len, no-control-regex
  /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|&quot;(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*&quot;)@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
export const regexName: RegExp = /^(\s|[^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]\d]){2,30}$/;

export const REGEX_ROLE_CODE: RegExp = /^[A-Za-z0-9_]{3,250}$/;
export const REGEX_ROLE_NAME: RegExp = /^(\s|[^`!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]){3,250}$/;
export const REGEX_REPLACE_ALL_CHARACTER = /,g/;
export const REGEX_CONVERT_PHONE: RegExp = /\B(?=(\d{3})+(?!\d))/g;
export const REGEX_ADDRESS_CONVERT: RegExp = /,\s*$/;
export const regexPhonenumberVN: RegExp = /(84|0[3|5|7|8|9])+([0-9]{8,9})\b/;
export const regexNumber: RegExp = /^\d+$/;
export const LENGTH_3 = 3;
export const LENGTH_50 = 50;
export const regexNumberClient: RegExp = /^[0-9]{1,10}$/;
export const regexEmail: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const urlRegex =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|http:\/\/localhost(:[0-9]{1,5})?\/)(([a-z0-9]+([-.]{1}[a-z0-9]+)*)\/(([a-z0-9]+([-.]{1}[a-z0-9]+)*)\/(([a-z0-9]+([-.]{1}[a-z0-9]+)*)\/?)?)?)?$/;
export const REGEX_URL_BRANDING: RegExp =
  /^(https?:\/\/)?([\da-zA-Z.-]+)\.([a-zA-Z]{2,6})(\/[\w.-]*)*(\?[\w=&.-]*)?\/?$/i;
