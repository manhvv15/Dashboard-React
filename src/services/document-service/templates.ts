import { instanceDocument } from '../xhr';
import { AxiosResponse } from 'axios';
import { ApiPaginationResponse } from '@/types/document-service/report';
import { template } from './endpoints';
import { Template } from '@/types/document-service/templates';
export const getAllTemplate = (): Promise<AxiosResponse<ApiPaginationResponse<Template>>> => {
  return instanceDocument.get(template.getAll);
};
