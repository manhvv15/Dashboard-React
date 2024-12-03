export interface ReportPagingResponse {
  id: string;
  code: string;
  name: string;
  reportGroupName: string;
  status: number;
  allowTypes: string[];
}

export interface ReportPagingRequest extends PaginationReportRequest {}

export interface PaginationReportRequest {
  pageNumber: number;
  pageSize: number;
  textSearch?: string;
}
export interface FormReport {
  code: string;
  name: string;
  reportGroupId: string;
  reportGroupName: string;
  status: ReportStatusEnum;
  allowTypes?: string[];
  isFile: boolean;
  FilePath: string;
  fileInfo: {
    name: string;
    uri: string;
    contentType: string;
  } | null;
}
export interface ReportByIdResponse {
  reportId: string;
  code: string;
  name: string;
  reportGroupId: string;
  reportGroupName: string;
  status: ReportStatusEnum;
  allowTypes?: string[];
}
export enum ReportStatusEnum {
  Active = 0,
  Deactivate = 1,
}
export interface CreateReportRequest extends FormReport {}
export interface UpdateReportRequest extends FormReport {
  id: string;
}
export interface ReportGroup {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface GroupResponse {
  items: ReportGroup[];
  totalPages: number;
  totalRecords: number;
}
export interface ApiPaginationResponse<T> {
  items: T[];
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
