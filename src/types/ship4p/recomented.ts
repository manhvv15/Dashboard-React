import { ShippingRateEnum } from '../enums/carrier';

export interface TagsRecomented {
  name: string | null | undefined;
  id: string;
  description: string | null | undefined;
  backgroundColor: string | null | undefined;
  index: number | null | undefined;
  stt: number | null | undefined;
  createAt: Date | null | undefined;
  updateAt: Date | null | undefined;
  isUsed: boolean;
}
export interface TagsRecomentedRequest {
  id?: string;
  recommendedName: string;
  description: string;
  backgroundColor: string;
  indexOrder?: number;
}
export interface UpdateTagRecomented {
  id: string; // Trong TypeScript, Guid thường được xử lý như một chuỗi
  name: string | null | undefined;
  index: number | null | undefined;
  description: string | null | undefined;
  backgroundColor: string | null | undefined;
}
export interface UpdateIndexRecomented {
  recomments: UpdateIndex[];
}
export interface UpdateIndex {
  id: string;
  index: number;
}
export interface TagRecommened {
  tagId: string;
  name: string | null | undefined;
  index: number | null | undefined;
  backgroundColor: string | null | undefined;
}

export interface CreateRecommendedEntries {
  accountSystemId: string;
  accountSystemIdUpdate?: string;
  id: string;
  countryId: string;
  countryName: string;
  countryCode: string;
  shippingType: ShippingRateEnum;
  recommeneds?: TagRecommened[];
}
export interface GetEntriesRecommendedResponse {
  courierId: string;
  id: string;
  accountSystemId: string;
  imageUrl: string;
  accountId: string;
  index: number;
  tagRecommeneds: TagRecommened[];
  createAt: Date | null | undefined;
  countryId: string;
  countryName: string;
  countryCode: string;
  isLocal: boolean;
  isCrossBorder: boolean;
  shippingType: ShippingRateEnum;
}
export interface FilterRecommendParams {
  keyword: string | null | undefined;
  tagIds: string[] | null | undefined;
  countryIds: string[] | null | undefined;
  shippingTypies: ShippingRateEnum[] | null | undefined;
}
