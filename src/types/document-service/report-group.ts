export interface ReportGroupPagingResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  status: ReportGroupStatusEnum;
}

export interface ReportGroupPagingRequest extends PaginationReportGroupRequest {}

export interface PaginationReportGroupRequest {
  pageNumber: number;
  pageSize: number;
  textSearch?: string;
}
export interface FormReportGroup {
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  status: ReportGroupStatusEnum;
}
export interface ReportGroupByIdResponse {
  ReportGroupId: string;
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  status: ReportGroupStatusEnum;
}
export enum ReportGroupStatusEnum {
  Active = 0,
  Deactivate = 1,
}
export interface CreateReportGroupRequest extends FormReportGroup {}
export interface UpdateReportGroupRequest extends FormReportGroup {
  id: string;
}
