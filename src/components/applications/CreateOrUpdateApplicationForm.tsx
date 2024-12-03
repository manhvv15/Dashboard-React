import { useState } from 'react';

import { Checkbox, FormHelperText, FormLabel, Input, SelectPortal, TreeNode } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import { getApplicationById, getApplicationGroups } from '@/services/user-management/application';
import { ApplicationByIdResponse, ApplicationStatusEnum, FormApplication } from '@/types/user-management/application';
import UploadImage from './UploadImage';

interface IProps {
  id?: string;
}
export const CreateOrUpdateApplicationForm = ({ id }: IProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  useQuery({
    queryKey: ['getApplicationById', id],
    queryFn: () => getApplicationById(id as string),
    enabled: !!id,
    onSuccess: (data: AxiosResponse<ApplicationByIdResponse>) => {
      setValue('code', data.data.code);
      setValue('shortName', data.data.shortName);
      setValue('name', data.data.name);
      setValue('isDefault', data.data.isDefault);
      setValue('logoUrl', data.data.logoUrl);
      setValue('url', data.data.url);
      setValue('status', data.data.status);
      setValue('order', data.data.order);
      setValue('workspaceRequired', data.data.workspaceRequired);
      setValue('isDefault', data.data.isDefault);
      setValue('isSystem', data.data.isSystem);
      setValue('applicationGroupId', data.data.applicationGroupId);
      setValue('description', data.data.description);
      setImageUpload(data.data.logoUrl ? data.data.logoUrl : null);
    },
  });

  const statusOptions = [
    { value: ApplicationStatusEnum.Active, label: t('active') },
    { value: ApplicationStatusEnum.Deactivate, label: t('deactive') },
    { value: ApplicationStatusEnum.ComingSoon, label: t('comingSoon') },
  ];

  const applicationGroups =
    useQuery({
      queryKey: ['getApplicationGroups'],
      queryFn: () => getApplicationGroups(),
      select: (response) => {
        const result = response.data?.map((i) => ({ label: i.label, value: i.value })) ?? [];
        result.unshift({
          label: 'No value',
          value: '',
        });
        return result;
      },
    }).data ?? [];

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormApplication>();

  const getAllValuesFromTree = (tree: TreeNode) => {
    let values: string[] = [];
    values.push(tree.value);

    if (tree.children && tree.children.length > 0) {
      tree.children.forEach((child) => {
        const childValues = getAllValuesFromTree(child);
        values = values.concat(childValues);
      });
    }
    return values;
  };

  const [imageUpload, setImageUpload] = useState<string | null>(null);

  const updateImageURL = (image: string) => {
    setValue('logoUrl', image);
  };
  const handleChangeStatus = (data: number) => {
    setValue('status', data);
  };

  const handleChangeGroup = (data?: string) => {
    setValue('applicationGroupId', data as string);
  };

  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <div className="flex-1">
          <div className="mt-4">
            <FormLabel required>{t('name')}</FormLabel>
            <Input
              {...register('name')}
              feedbackInvalid={errors?.name?.message}
              classNameContainer="mt-2"
              placeholder={t('name')}
              hiddenClose
              name="name"
            />
            {errors?.name?.message && <FormHelperText error>{t(errors?.name?.message)}</FormHelperText>}
          </div>{' '}
          <div className="mt-4">
            <FormLabel required>{t('shortName')}</FormLabel>
            <Input
              {...register('shortName')}
              feedbackInvalid={errors?.name?.message}
              classNameContainer="mt-2"
              placeholder={t('shortName')}
              hiddenClose
              name="shortName"
            />
            {errors?.shortName?.message && <FormHelperText error>{t(errors?.shortName?.message)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel required>{t('role.code')}</FormLabel>
            <Input
              {...register('code')}
              feedbackInvalid={errors?.code?.message}
              classNameContainer="mt-2"
              placeholder={t('role.code')}
              hiddenClose
              name="code"
            />
            {errors?.code?.message && <FormHelperText error>{t(errors?.code?.message)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel>{common('group')}</FormLabel>
            <SelectPortal
              options={applicationGroups ?? []}
              onChange={(e) => handleChangeGroup(e)}
              value={watch('applicationGroupId')}
            />
          </div>
          {!!id && (
            <div className="mt-4">
              <FormLabel>{t('status')}</FormLabel>
              <SelectPortal
                placeholder={common('status')}
                options={statusOptions ?? []}
                onChange={(e: any) => handleChangeStatus(e)}
                value={watch('status')}
              />
            </div>
          )}
          <div className="mt-4">
            <FormLabel>{t('app.url')}</FormLabel>
            <Input
              {...register('url')}
              feedbackInvalid={errors?.url?.message}
              classNameContainer="mt-2"
              placeholder={t('app.url')}
              hiddenClose
              name="url"
            />
            {errors?.url?.message && <FormHelperText error>{t(errors?.url?.message)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel>{t('description')}</FormLabel>
            <Input
              {...register('description')}
              feedbackInvalid={errors?.description?.message}
              classNameContainer="mt-2"
              placeholder={t('description')}
              hiddenClose
              name="description"
            />
            {errors?.description?.message && <FormHelperText error>{t(errors?.description?.message)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel>{t('orderNumber')}</FormLabel>
            <Input
              {...register('order')}
              feedbackInvalid={errors?.order?.message}
              classNameContainer="mt-2"
              placeholder={t('orderNumber')}
              hiddenClose
              type="number"
            />
            {errors?.order?.message && <FormHelperText error>{t(errors?.order?.message)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <Checkbox {...register('isDefault')} label={common('isDefaultWhenCreateWorkspace')} />
          </div>{' '}
          <div className="mt-4">
            <Checkbox {...register('isSystem')} label={common('isSystem')} />
          </div>
          <div className="mt-4">
            <Checkbox {...register('workspaceRequired')} label={common('workspaceRequired')} />
          </div>
          <div className="py-4 mt-4 bg-ic-white-6s rounded-xl">
            <p className="text-base font-medium leading-6 text-ic-ink-6s">{common('logoApplication')}</p>
            <UploadImage updateImageURL={updateImageURL} setImageUpload={setImageUpload} imageUpload={imageUpload} />
          </div>
        </div>
      </div>
    </div>
  );
};
