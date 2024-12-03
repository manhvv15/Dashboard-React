import { AxiosResponse } from 'axios';

import { ApiPaginationResponse } from '@/types/common';
import { GetInvoicesRequest, InvoiceDetail, InvoiceManagement } from '@/types/payment/invoice';

import { invoices } from './endpoints';

import {
  GetInvoiceDetailRequest,
  InvoiceDetailResponse,
  InvoicePagingRequest,
  InvoicePagingResponse,
} from '@/types/user-management/invoice';
import { instance } from '../xhr';

export const getInvoiceManagements = (
  data: GetInvoicesRequest,
): Promise<AxiosResponse<ApiPaginationResponse<InvoiceManagement>>> => {
  return instance.get(invoices.getInvoiceManagements, { params: data });
};

export const invoiceDetails = (params: {
  workspaceId: string;
  invoiceIds: string[];
}): Promise<AxiosResponse<InvoiceDetail[]>> => {
  return instance.get(invoices.invoiceDetails, { params: params });
};

export const getInvoicePagingByWorkspace = (params: InvoicePagingRequest) => {
  return instance.get<ApiPaginationResponse<InvoicePagingResponse>>(invoices.getInvoicesByWorkspace, {
    params,
  });
};

export const getInvoiceByIdAndWorkspace = (
  params: GetInvoiceDetailRequest,
): Promise<AxiosResponse<InvoiceDetailResponse>> => {
  return instance.get<InvoiceDetailResponse>(invoices.getInvoiceDetailById, { params });
};
