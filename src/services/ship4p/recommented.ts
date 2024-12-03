import {
  CreateRecommendedEntries,
  FilterRecommendParams,
  GetEntriesRecommendedResponse,
  TagsRecomented,
  TagsRecomentedRequest,
  UpdateIndexRecomented,
  UpdateTagRecomented,
} from '@/types/ship4p/recomented';
import { replaceString } from '@/utils/common';
import { AxiosResponse } from 'axios';
import { instance } from '../xhr';
import { recomentedEntries, tagRecomented } from './endpoint';
//#region Tag recomented
export const validatorTagRecom = (data: { keyword: string; id: string }): Promise<AxiosResponse<any>> => {
  return instance.get(tagRecomented.validatorTagRecomented, {
    params: data,
  });
};
export const getTagRecomented = (data: { keyword?: string }): Promise<AxiosResponse<TagsRecomented[]>> => {
  return instance.get(tagRecomented.tagRecomented, {
    params: data,
  });
};
export const createTagRecomented = (data: TagsRecomentedRequest): Promise<AxiosResponse<any>> => {
  return instance.post(tagRecomented.tagRecomented, data);
};
export const updateTagRecomented = (data: UpdateTagRecomented): Promise<AxiosResponse<any>> => {
  return instance.put(tagRecomented.tagRecomented, data);
};
export const updateIndexOrderRecomented = (data: UpdateIndexRecomented): Promise<AxiosResponse<any>> => {
  return instance.put(tagRecomented.updateIndextagRecomented, data);
};
export const deleteTagRecomented = (data: { id: string }): Promise<AxiosResponse<any>> => {
  return instance.delete(
    replaceString(
      [
        {
          valueIsReplace: '{id}',
          newValue: data.id,
        },
      ],
      tagRecomented.deteleTagRecomend,
    ),
  );
};

//#region Recommented entry
export const getRecommentedEntry = (
  data: FilterRecommendParams,
): Promise<AxiosResponse<GetEntriesRecommendedResponse[]>> => {
  return instance.get(recomentedEntries.recomentedEntries, {
    params: data,
  });
};

export const createRecommentedEntry = (data: CreateRecommendedEntries): Promise<AxiosResponse<any>> => {
  return instance.post(recomentedEntries.recomentedEntries, data);
};
export const updateRecomentedEntry = (data: CreateRecommendedEntries): Promise<AxiosResponse<any>> => {
  return instance.put(recomentedEntries.recomentedEntries, data);
};
export const deteleRecomendEntries = (data: { accountSystemId: string }): Promise<AxiosResponse<any>> => {
  return instance.delete(
    replaceString(
      [
        {
          valueIsReplace: '{id}',
          newValue: data.accountSystemId,
        },
      ],
      recomentedEntries.deteleRecomendEntries,
    ),
  );
};
export const validateEntryRecoment = (data: { accountSystemId?: string; id?: string }): Promise<AxiosResponse<any>> => {
  return instance.get(recomentedEntries.validatorEntryRecomented, {
    params: data,
  });
};
