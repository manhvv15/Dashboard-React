import type { AxiosResponse } from 'axios';

import { PageResult } from '@/types/user-management/common';
import {
  ApplicationForNoti,
  NotificationGroup,
  Group,
  NotificationTypeByGroup,
  NotificationGeneral,
  NotificationPagingRequest,
  NotificationPagingResponse,
  CreateNotificationTypeRequest,
  CreateNotificationTypeChannelRequest,
  UpdateNotificationTypeRequest,
} from '@/types/user-management/notification';
import { compileRequestURL } from '@/utils/common';

import { notification } from './endpoints';

import { instance } from '../xhr';

export const getListApplication = (): Promise<AxiosResponse<ApplicationForNoti[]>> => {
  return instance.get<ApplicationForNoti[]>(notification.applications);
};

export const applicationsGroupByApp = (id: string): Promise<AxiosResponse<NotificationGroup[]>> => {
  return instance.get<NotificationGroup[]>(notification.applicationsGroupByApp + id);
};

export const createNotificationType = (data: CreateNotificationTypeRequest): Promise<AxiosResponse> => {
  return instance.post<string>(notification.createNotificationType, data);
};

export const updateNotificationType = (data: UpdateNotificationTypeRequest): Promise<AxiosResponse> => {
  return instance.put(notification.updateNotificationType, data);
};

export const createNotificationTypeChannel = (data: CreateNotificationTypeChannelRequest): Promise<AxiosResponse> => {
  return instance.post<string>(notification.createTypeChannel, data);
};

export const upsertNotificationTypeChannel = (data: CreateNotificationTypeChannelRequest): Promise<AxiosResponse> => {
  return instance.post<string>(notification.upsertTypeChannel, data);
};

export const getNotificationPaging = (params: NotificationPagingRequest) => {
  return instance.get<PageResult<NotificationPagingResponse>>(notification.getAllNotification, { params });
};

export const getChannelTemplateDetail = (params: NotificationPagingRequest) => {
  return instance.get<PageResult<NotificationPagingResponse>>(notification.getAllNotification, { params });
};

export const getAllNotificationGroups = (): Promise<AxiosResponse<Group[]>> => {
  return instance.get<Group[]>(notification.getAllGroups);
};

export const getAllLanguageCode = (id: string): Promise<AxiosResponse<string[]>> => {
  return instance.get<string[]>(compileRequestURL(notification.getLanguageCode, { id: id }));
};

export const deleteNotificationType = (data: { id: string; languageCode: string }): Promise<AxiosResponse> => {
  return instance.delete(
    compileRequestURL(notification.getLanguageCode, { id: data.id, languageCode: data.languageCode }),
  );
};

export const getNotificationByLanguage = (data: {
  notificationTypeId: string;
  languageCode: string;
  channel: number;
}): Promise<AxiosResponse<NotificationTypeByGroup[]>> => {
  return instance.get<NotificationTypeByGroup[]>(notification.getNotificationByLanguage, { params: data });
};

export const getNotificationGeneralById = (id: string): Promise<AxiosResponse<NotificationGeneral>> => {
  return instance.get<NotificationGeneral>(compileRequestURL(notification.getNotificationGeneralById, { id: id }));
};

export const deleteNotification = (id: string): Promise<AxiosResponse> => {
  return instance.delete(compileRequestURL(notification.deleteNotification, { id: id }));
};
