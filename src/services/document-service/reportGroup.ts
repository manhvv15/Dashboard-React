import { instanceDocument } from '../xhr';
import { reportGroup } from './endpoints';
import { AxiosResponse } from 'axios';
import { ApiPaginationResponse, ReportGroup } from '@/types/document-service/report';

export const getAllReportGroups = (): Promise<AxiosResponse<ApiPaginationResponse<ReportGroup>>> => {
  return instanceDocument.get(reportGroup.getAll);
};
