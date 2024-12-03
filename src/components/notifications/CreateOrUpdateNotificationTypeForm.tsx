import { ChangeEvent } from 'react';

import { Checkbox, FormHelperText, FormLabel, Input, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { getAllNotificationGroups, getNotificationGeneralById } from '@/services/user-management/notifiation';
import {
  FormNotificationType,
  NotificationGeneral,
  NotificationTypeStatusEnum,
} from '@/types/user-management/notification';

interface IProps {
  id?: string;
}

const notificationTypeStatus: any[] = [
  { label: 'Active', value: NotificationTypeStatusEnum.Active.toString() },
  { label: 'Deactive', value: NotificationTypeStatusEnum.Deactive.toString() },
];
export const CreateOrUpdateNotificationTypeForm = ({ id }: IProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  useQuery({
    queryKey: ['getNotificationTypeById', id],
    queryFn: () => getNotificationGeneralById(id as string),
    enabled: !!id,
    onSuccess: (data: AxiosResponse<NotificationGeneral>) => {
      setValue('code', data.data.code);
      setValue('name', data.data.name);
      setValue('status', data.data.status.toString());
      setValue('isSystem', data.data.isSystem);
      setValue('notificationGroupId', data.data.notificationGroupId);
    },
  });

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<FormNotificationType>();

  const notificationGroups = useQuery({
    queryKey: ['getNotificationGroups'],
    queryFn: () => getAllNotificationGroups(),
    select: (response) => {
      return response.data?.map((i) => ({ label: i.name, value: i.id })) ?? [];
    },
  }).data;

  const handleChangeName = (event?: ChangeEvent<HTMLInputElement>) => {
    if (!!event?.target.value && !!event?.target.value.trim()) setValue('code', processString(event?.target.value));
  };
  const processString = (inputString: string) => {
    const normalizedString = inputString.normalize('NFD');
    const withoutDiacritics = normalizedString.replace(/[\u0300-\u036f]/g, '');

    const words = withoutDiacritics.split(' ');
    const capitalizedWords = words.map((word) => word.toUpperCase());
    const processedString = capitalizedWords.join('_');
    const notificationGroup = notificationGroups?.find((x) => x.value == getValues('notificationGroupId'));
    return `${notificationGroup?.label.toLocaleUpperCase()}_${processedString}`;
  };
  const handleChangeNotificationGroup = (data?: string) => {
    setValue('notificationGroupId', data ?? '');
  };
  const handleChangeStatus = (data?: string) => {
    setValue('status', data ?? '');
  };
  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <div className="flex">
          <div className="gap-4 flex-1">
            <div className="">
              <FormLabel required>{common('Notification group')}</FormLabel>
              <SelectPortal
                placeholder={common('Notification group')}
                options={notificationGroups ?? []}
                onChange={(e: any) => handleChangeNotificationGroup(e)}
                value={watch('notificationGroupId')}
              />
              {errors?.notificationGroupId?.message && (
                <FormHelperText error>{error(errors?.notificationGroupId?.message)}</FormHelperText>
              )}
            </div>
            <div className="mt-4">
              <FormLabel required>{t('role.name')}</FormLabel>
              <Input
                {...register('name')}
                feedbackInvalid={errors?.name?.message}
                classNameContainer="mt-2"
                placeholder={t('role.name')}
                hiddenClose
                onChange={(el) => handleChangeName(el)}
                name="name"
              />
              {errors?.name?.message && <FormHelperText error>{t(errors?.name?.message)}</FormHelperText>}
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
            <div className="">
              <FormLabel required>{common('Status')}</FormLabel>
              <SelectPortal
                placeholder={common('Status')}
                options={notificationTypeStatus ?? []}
                onChange={(e: any) => handleChangeStatus(e)}
                value={watch('status')}
              />
              {errors?.status?.message && <FormHelperText error>{error(errors?.status?.message)}</FormHelperText>}
            </div>
            <div className="mt-4">
              <Checkbox {...register('isSystem')} label="Notification system" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
