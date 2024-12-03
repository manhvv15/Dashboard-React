const PREFIX = '/ship4p';

export const courierSystem = {
  createCarrierSystem: `${PREFIX}/courier-account-systems/{courierId}/{accountId}`,
  getAllCarrierSystem: `${PREFIX}/courier-account-systems`,
  updateCarrierSystem: `${PREFIX}/courier-account-systems`,
  deleteCarrierSystem: `${PREFIX}/courier-account-systems`,
  getDetail: `${PREFIX}/courier-account-systems/{id}`,
  changeStatusCarrierSystem: `${PREFIX}/courier-account-systems/active`,
  configWebhookUrl: `${PREFIX}/courier-account-systems/webhook`,
  shippingFeeSetting: `${PREFIX}/courier-account-systems/shipping-setting`,
};

export const courier = {
  getAllCourier: `${PREFIX}/couries`,
};

export const tagRecomented = {
  tagRecomented: `${PREFIX}/tags`,
  updateIndextagRecomented: `${PREFIX}/tags/index-order`,
  validatorTagRecomented: `${PREFIX}/tags/validator`,
  deteleTagRecomend: `${PREFIX}/tags/{id}`,
};
export const recomentedEntries = {
  recomentedEntries: `${PREFIX}/recommend-entries`,
  deteleRecomendEntries: `${PREFIX}/recommend-entries/{id}`,
  validatorEntryRecomented: `${PREFIX}/recommend-entries/validator`,
};
