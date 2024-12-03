const PREFIX = '/pim';

export const proxy = {
  paging: `${PREFIX}/proxy-workspace`,
  upsert: `${PREFIX}/proxy-workspace`,
  delete: `${PREFIX}/proxy-workspace/{id}`,
  checkProxyStatus: `${PREFIX}/check-proxy-status`,
  getAll: `${PREFIX}/proxy-workspace/get-all`,
};

export const proxyConfiguration = {
  paging: `${PREFIX}/proxy-source-workspace`,
  upsert: `${PREFIX}/proxy-source-workspace`,
  delete: `${PREFIX}/proxy-source-workspace/{id}`,
};

export const source = {
  getAll: `${PREFIX}/sources/all`,
};
