const PREFIX = '/api';
export const report = {
  getAll: `${PREFIX}/reports`,
  getPaging: `${PREFIX}/reports`,
  getById: `${PREFIX}/reports/{id}`,
  create: `${PREFIX}/reports`,
  update: `${PREFIX}/reports/{id}`,
  delete: `${PREFIX}/reports/{id}`,
};
export const reportGroup = {
  getAll: `${PREFIX}/report-groups`,
};
export const template = {
  getAll: `${PREFIX}/templates`,
};
export const storageFile = `/api/storage/files`;
