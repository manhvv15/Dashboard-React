import { NotificationChanelEnum, PaginationRequest } from './common';

export interface NotificationPagingResponse {
  id: string;
  name: string;
  code: string;
  notificationGroupName: string;
  channel: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: any;
}

export interface NotificationPagingRequest extends PaginationRequest {
  notificationGroupIds?: string[];
  status?: NotificationTypeStatusEnum | undefined | null;
  channel?: NotificationChanelEnum | undefined | null;
}

export interface CreateOrganizationRequest {
  code: string;
  name: string;
  order?: number;
  parentId?: string;
}

export interface UpdateOrganizationRequest {
  id: string;
  code: string;
  name: string;
  order?: number | undefined;
  parentId?: string;
}

export interface DeleteOrganizationResponse {
  isSuccess: boolean;
  message: string | null;
  numberOfUsers: number | null;
}

export interface ApplicationForNoti {
  id: string;
  code: string;
  name: string;
  shortName: string;
  logoUrl: string;
  url: string;
}

export interface NotificationGroup {
  id: string;
  code: string;
  name: string;
  parentId: null | string;
  variables: string;
}

export interface Language {
  name: string;
  code: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  code: string;
  notificationGroupName: string;
  channel: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: any;
}

export interface ApplicationForNotifi {
  applicationName: string;
  shortName: string;
  logoUrl: string;
}

export interface GetAllNotification extends PaginationRequest {
  items: NotificationTemplate[];
}

export interface Group {
  id: string;
  code: string;
  name: string;
  parentId: null | string;
  variables: string;
}

export interface NotificationTypeByGroup {
  channel: number;
  content: string;
  enable: boolean;
  subject: string;
  variables: string[];
}

export interface NotificationGeneral {
  id: string;
  notificationGroupId: string;
  code: string;
  name: string;
  isSystem: boolean;
  status: NotificationTypeStatusEnum;
  variables: string;
}

export interface FormNotificationType {
  code: string;
  name: string;
  notificationGroupId: string;
  status: string;
  isSystem: boolean;
}
export enum NotificationTypeStatusEnum {
  Active = 1,
  Deactive = 2,
}

export interface CreateNotificationTypeRequest {
  code: string;
  name: string;
  notificationGroupId: string;
  status: NotificationTypeStatusEnum;
  isSystem: boolean;
}
export interface UpdateNotificationTypeRequest {
  id: string;
  code: string;
  name: string;
  notificationGroupId: string;
  status: NotificationTypeStatusEnum;
  isSystem: boolean;
}

export interface FormNotificationTypeChannel {
  notificationTypeId: string;
  channel: string;
  languageCode: string;
  enabled: boolean;
  subject: string;
  content: string;
}

export interface CreateNotificationTypeChannelRequest {
  notificationTypeId: string;
  channel: number;
  languageCode: string;
  enabled: boolean;
  subject: string;
  content: string;
}
