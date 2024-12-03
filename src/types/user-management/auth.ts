import { Gender } from '@/constants/enums/common';

import { RolePermissionItem } from '../common';

export interface AuthUser {
  email: string;
  name: string;
  phone_number: string;
  sub: string;
}

export interface AuthUserProfile {
  id: string; // sub
  accountType?: number;
  avatarUrl?: string;
  birthDay?: string;
  company?: string;
  countryCode: string;
  deleteScheduleDate?: string;
  email: string;
  emailConfirmed: boolean;
  fullName: string;
  gender: Gender;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  prefixPhoneNumber?: string;
  sessionCountryCode?: string;
  sessionCurrencyCode?: string;
  sessionDateFormat?: string;
  sessionTimeFormat?: string;
  sessionLanguageCode?: string;
  sessionTimeZone?: string;
  status: number;
  subscribeType: number;
  permissions: RolePermissionItem[];
}
