import { IBrandingSettings, IPreviewTemplateResponse } from '@/types/user-management/branding';
import { AxiosResponse } from 'axios';
import { instance } from '../xhr';
import { brandingSetting, notification } from './endpoints';

export const insertBrandingSettings = (data: {
  workspaceId: string;
  marketId: string;
  brandingSetting: IBrandingSettings;
}) => {
  return instance.post(`${brandingSetting.branding}`, data);
};

export const updateBrandingSettings = (data: {
  workspaceId: string;
  marketId: string;
  brandingSettings: IBrandingSettings;
}) => {
  return instance.put(`${brandingSetting.branding}`, data);
};

export const getBrandingSettings = (data: {
  workspaceId: string;
  marketId: string;
}): Promise<AxiosResponse<IBrandingSettings>> => {
  return instance.get(`${brandingSetting.branding}`, {
    params: {
      workspaceId: data.workspaceId,
      marketId: data.marketId,
    },
  });
};

export const getPreviewTemplate = (data: {
  subject?: string;
  content?: string;
  variables?: { name: string; value: any }[];
}): Promise<AxiosResponse<IPreviewTemplateResponse>> => {
  return instance.post(`${notification.getNotificationByLanguage}/preview`, {
    Subject: data.subject,
    Content: data.content,
    Variables: data.variables,
  });
};
