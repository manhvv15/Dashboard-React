import { PaginationRequest } from './common';

export interface CustomerPagingRequest extends PaginationRequest {
  status: number[] | null | undefined;
  countryCodes: string[] | null | undefined;
}

export interface CustomerPagingResponse {
  id: string;
  createdAt: string;
  code: string | null;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  prefixPhoneNumber: string | null;
  status: UserStatusEnum;
  inviteAt: string;
  note: string | null;
  avatarUrl?: string;
  countryCode: string;
  phoneNumberConfirmed: boolean;
  emailConfirmed: boolean;
  workspaces: WorkspaceDto[];
}
export interface WorkspaceDto {
  id: string;
  name: string;
  slug: string;
}

export enum UserStatusEnum {
  Active = 0,
  DeActive = 1,
  Invited = 2,
}

export interface CustomerByIdResponse {
  id: string;
  createdAt: string;
  createdBy: string;
  inviteAt: string;
  inviteBy: string;
  avatarUrl: string | null;
  code: string | null;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  prefixPhoneNumber: string | null;
  status: UserStatusEnum | null;
  note: string | null;
  organizationId: string | null;
  organizationName: string | null;
  isCompleteSetup: boolean;
}
