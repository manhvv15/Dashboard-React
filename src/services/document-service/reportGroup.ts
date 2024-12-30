import { instanceDocument } from '../xhr';
import { reportGroup } from './endpoints';
import { AxiosResponse } from 'axios';
import { ApiPaginationResponse, ReportGroup } from '@/types/document-service/report';
import {
  CreateReportGroupRequest,
  ReportGroupByIdResponse,
  ReportGroupPagingRequest,
  ReportGroupPagingResponse,
  UpdateReportGroupRequest,
} from '@/types/document-service/report-group';
import { compileRequestURL } from '@/utils/common';
import { PageResult } from '@/types/user-management/common';

export const getReportGroupPaging = (params: ReportGroupPagingRequest) => {
  return instanceDocument.get<PageResult<ReportGroupPagingResponse>>(reportGroup.getPaging, { params });
};
export const getAllReportGroups = (): Promise<AxiosResponse<ApiPaginationResponse<ReportGroup>>> => {
  return instanceDocument.get(reportGroup.getAll);
};
export const createReportGroup = (data: CreateReportGroupRequest): Promise<AxiosResponse> => {
  return instanceDocument.post(reportGroup.create, data);
};
export const getReportGroupById = (id: string): Promise<AxiosResponse<ReportGroupByIdResponse>> => {
  return instanceDocument.get<ReportGroupByIdResponse>(compileRequestURL(reportGroup.getById, { id: id }));
};
export const updateReportGroup = (id: string, data: UpdateReportGroupRequest): Promise<AxiosResponse> => {
  const url = reportGroup.update.replace('{id}', id);
  return instanceDocument.put(url, data);
};

export const deleteReportGroup = (id: string): Promise<AxiosResponse> => {
  return instanceDocument.delete(compileRequestURL(reportGroup.delete, { id: id }));
};
