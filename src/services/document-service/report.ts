import { PageResult } from '@/types/user-management/common';
import { instance, instanceDocument } from '../xhr';
import {
  CreateReportRequest,
  ReportByIdResponse,
  ReportPagingRequest,
  ReportPagingResponse,
  UpdateReportRequest,
} from '@/types/document-service/report';
import { report } from './endpoints';
import { AxiosResponse } from 'axios';
import { compileRequestURL } from '@/utils/common';
import { UploadFile } from '@/types/user-management/application';
import { storage } from '../user-management/endpoints';

export const getReportPaging = (params: ReportPagingRequest) => {
  return instanceDocument.get<PageResult<ReportPagingResponse>>(report.getPaging, { params });
};
export const getAll = () => {
  return instanceDocument.get<ReportPagingResponse[]>(report.getAll);
};
export const createReport = (data: CreateReportRequest): Promise<AxiosResponse> => {
  return instanceDocument.post(report.create, data);
};
export const getReportById = (id: string): Promise<AxiosResponse<ReportByIdResponse>> => {
  return instanceDocument.get<ReportByIdResponse>(compileRequestURL(report.getById, { id: id }));
};
export const updateReport = (id: string, data: UpdateReportRequest): Promise<AxiosResponse> => {
  const url = report.update.replace('{id}', id);
  return instanceDocument.put(url, data);
};

export const deleteReport = (id: string): Promise<AxiosResponse> => {
  return instanceDocument.delete(compileRequestURL(report.delete, { id: id }));
};
export const getTemplateFile = (file: FormData): Promise<AxiosResponse<UploadFile>> => {
  return instance.post(storage, file);
};
