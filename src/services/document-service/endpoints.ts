const PREFIX = '/api';
export const report = {
  getAll: `${PREFIX}/reports`,
  getPaging: `${PREFIX}/reports`,
  getById: `${PREFIX}/reports/{id}`,
  create: `${PREFIX}/reports`,
  update: `${PREFIX}/reports/{id}`,
  delete: `${PREFIX}/reports/{id}`,
  getDownloadFile: `${PREFIX}/reports/{id}/download`,
};
export const reportGroup = {
  getAll: `${PREFIX}/report-groups`,
  getPaging: `${PREFIX}/report-groups`,
  getById: `${PREFIX}/report-groups/{id}`,
  create: `${PREFIX}/report-groups`,
  update: `${PREFIX}/report-groups/{id}`,
  delete: `${PREFIX}/report-groups/{id}`,
};
export const template = {
  getAll: `${PREFIX}/templates`,
};
export const storageFile = `/api/storage/files`;
