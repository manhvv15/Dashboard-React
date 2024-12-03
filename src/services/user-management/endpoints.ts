import { configs } from '@/constants/variables/environment';

const PREFIX = '/user-management';
const PRICING_SERVICE = '/pricing-service';

export const userManagement = {
  userInfo: '/userinfo',
  profile: `${PREFIX}/profiles/current-user`,
  currency: `${PREFIX}/master-data/currencies`,
  country: `${PREFIX}/master-data/countries`,
};

export const auth = {
  login: `${configs.API_GATEWAY_URL}/account/login?redirectUrl=`,
  logout: `${configs.API_GATEWAY_URL}/account/logout?redirectUrl=${configs.APP_BASE_URL}`,
};

export const masterData = {
  IP: 'https://ipinfo.io/?token=3247deb69d7a94',
  languages: `${PREFIX}/master-data/languages`,
  currency: `${PREFIX}/master-data/currencies`,
};

export const workspace = {
  getWorkspaceBySlug: `${PREFIX}/workspaces/slug/{slug}`,
  getManagement: `${PREFIX}/system/workspaces/management`,
  deleteWorkspace: `${PREFIX}/system/workspaces`,
  getCompanyDetail: `${PREFIX}/system/company-details`,
  getContactPointByWorkspace: `${PREFIX}/system/contact-points`,
  getApplicationsByWorkspaceId: `${PREFIX}/system/plans/overview`,
  getUserLV2: `${PREFIX}/profiles/search`,
  getAvailablePlansByWorkspace: `${PREFIX}/system/workspaces/{id}/available-plans`,
  calculationsFee: `${PRICING_SERVICE}/fees/calculations/multiple`,
  createMultipleSubscription: `${PREFIX}/system/subscriptions/multiple`,
  getSubscriptionDetail: `${PREFIX}/usage-events/current-subscription`,
  cancelSubscription: `${PREFIX}/subscriptions/cancellation`,
  updateStatusWorkspace: `${PREFIX}/system/workspaces/status`,
  getPagingWorkspace: `${PREFIX}/workspaces/paging`,
};

export const user = {
  updateSessionInfo: `${PREFIX}/profiles/current-user/session-info`,
  getPagingSystem: `${PREFIX}/system/profiles/management`,
  getSummarySystem: `${PREFIX}/system/profiles/summary`,
  getUserAvailableToAddRole: `${PREFIX}/system/profiles/roles/available-users`,
  getUserAvailableToAddOrganization: `${PREFIX}/system/profiles/organizations/available-users`,
  getOrganizationAvailableToAddUser: `${PREFIX}/system/profiles/available-organizations`,
  invite: `${PREFIX}/system/profiles/invitations`,
  reInvite: `${PREFIX}/system/profiles/re-invitations`,
  confirmInvite: `${PREFIX}/system/profiles/invitations/confirmation`,
  detail: `${PREFIX}/system/profiles/{id}/detail`,
  addUsersToRole: `${PREFIX}/system/profiles/users-role`,
  addUsersToOrganization: `${PREFIX}/system/profiles/users-organizations`,
  delete: `${PREFIX}/system/profiles/user/{id}/delete`,
  activateUser: `${PREFIX}/system/profiles/users/{id}/activate`,
  deactivateUser: `${PREFIX}/system/profiles/users/{id}/deactivate`,
  updateApplicationRoles: `${PREFIX}/system/profiles/application-roles`,
  getAvailableRoleForUser: `${PREFIX}/system/profiles/{id}/available-roles`,
  updateUserOrganization: `${PREFIX}/system/profiles/organizations`,
  deleteUserFromApplication: `${PREFIX}/system/roles/application-user/delete`,
};

export const customer = {
  getCustomerPaging: `${PREFIX}/system/profiles/customers`,
  detail: `${PREFIX}/system/profiles/customers/{id}/detail`,
};

export const organization = {
  getPaging: `${PREFIX}/system/organizations`,
  getById: `${PREFIX}/system/organizations/detail`,
  create: `${PREFIX}/system/organizations`,
  update: `${PREFIX}/system/organizations`,
  delete: `${PREFIX}/system/organizations/{id}`,
  order: `${PREFIX}/system/organizations/ordering`,
  updateApplicationRolesByOrganization: `${PREFIX}/system/organizations/application-roles`,
  getAvailableRolesForOrganization: `${PREFIX}/system/organizations/available-roles`,
  addRolesToOrganizations: `${PREFIX}/system/organizations/organization-roles`,
  deleteOrganizationApplication: `${PREFIX}/system/organizations/organization-applications/delete`,
  deleteOrganizationUser: `${PREFIX}/system/organizations/organization-users/delete`,
};

export const object = {
  getPaging: `${PREFIX}/objects`,
  getById: `${PREFIX}/objects/{id}`,
  create: `${PREFIX}/objects`,
  update: `${PREFIX}/objects`,
  delete: `${PREFIX}/objects/{id}`,
};

export const action = {
  getPaging: `${PREFIX}/actions`,
  getById: `${PREFIX}/actions/{id}`,
  create: `${PREFIX}/actions`,
  update: `${PREFIX}/actions`,
  delete: `${PREFIX}/actions/{id}`,
};

export const applicationGroup = {
  getPaging: `${PREFIX}/system/application-groups`,
  getById: `${PREFIX}/system/application-groups/{id}`,
  create: `${PREFIX}/system/application-groups`,
  update: `${PREFIX}/system/application-groups`,
  delete: `${PREFIX}/system/application-groups/{id}`,
};

export const role = {
  getPaging: `${PREFIX}/system/roles/management`,
  getById: `${PREFIX}/system/roles/{id}`,
  create: `${PREFIX}/system/roles`,
  update: `${PREFIX}/system/roles`,
  delete: `${PREFIX}/system/roles/{id}`,
  deleteUserRole: `${PREFIX}/system/roles/user/delete`,
};

export const application = {
  getAll: `${PREFIX}/system/applications`,
  getPaging: `${PREFIX}/system/applications/gets`,
  getAvailableByUser: `${PREFIX}/system/applications/available-by-user`,
  getManagement: `${PREFIX}/system/applications/management`,
  getById: `${PREFIX}/system/applications/{id}`,
  create: `${PREFIX}/system/applications`,
  update: `${PREFIX}/system/applications`,
  getApplicationGroups: `${PREFIX}/system/applications/groups`,
};

export const storage = `/storage/files/public`;

export const permission = {
  getTreePermission: `${PREFIX}/permissions/build-tree`,
  getTreePermissionByRoleId: `${PREFIX}/permissions/build-tree/{id}/roles`,
  getPermissionByCurrentUser: `${PREFIX}/permissions/current-user`,
  getPaging: `${PREFIX}/permissions/management`,
  getById: `${PREFIX}/permissions/{id}`,
  create: `${PREFIX}/permissions`,
  update: `${PREFIX}/permissions`,
  delete: `${PREFIX}/permissions/{id}`,
};

const PREFIX_NOTIFICATION = '/notification';
export const notification = {
  applications: `${PREFIX_NOTIFICATION}/applications`,
  applicationsGroupByApp: `${PREFIX_NOTIFICATION}/notification-groups?appId=`,
  createNotificationType: `${PREFIX_NOTIFICATION}/notification-types`,
  updateNotificationType: `${PREFIX_NOTIFICATION}/notification-types`,
  getAllNotification: `${PREFIX_NOTIFICATION}/notification-types/paging`,
  getAllGroups: `${PREFIX_NOTIFICATION}/notification-groups`,
  createTypeChannel: `${PREFIX_NOTIFICATION}/notification-type-channels`,
  upsertTypeChannel: `${PREFIX_NOTIFICATION}/notification-type-channels/system/upsert`,
  getLanguageCode: `${PREFIX_NOTIFICATION}/notification-types/{id}/languages`,
  deleteNotificationType: `${PREFIX_NOTIFICATION}/notification-types/{id}/{languageCode}`,
  getNotificationByLanguage: `${PREFIX_NOTIFICATION}/channel-templates`,
  updateNotificationTypeChannel: `${PREFIX_NOTIFICATION}/notification-type-channels`,
  getNotificationGeneralById: `${PREFIX_NOTIFICATION}/notification-types/{id}`,
  updateNotificationGeneral: `${PREFIX_NOTIFICATION}/notification-types`,
  deleteNotification: `${PREFIX_NOTIFICATION}/notification-types/{id}`,
};

export const brandingSetting = {
  branding: `${PREFIX}/branding-settings`,
};
