import { Checkbox, FormHelperText, FormLabel, Input, SelectPortal, Textarea } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { getAllLanguage } from '@/services/user-management/master-data';
import { getNotificationByLanguage } from '@/services/user-management/notifiation';
import { NotificationChanelEnum } from '@/types/user-management/common';
import { FormNotificationTypeChannel, NotificationTypeByGroup } from '@/types/user-management/notification';

interface IProps {
  id?: string;
}
interface notificationChannelType {
  label: string;
  value: string;
}
const notificationChannels: notificationChannelType[] = [
  { label: 'Email', value: NotificationChanelEnum.Email.toString() },
  { label: 'WebApp', value: NotificationChanelEnum.WebApp.toString() },
  { label: 'MobileApp', value: NotificationChanelEnum.MobileApp.toString() },
  { label: 'Telegram', value: NotificationChanelEnum.Telegram.toString() },
  { label: 'Zalo', value: NotificationChanelEnum.Zalo.toString() },
  { label: 'Slack', value: NotificationChanelEnum.Slack.toString() },
  { label: 'SMS', value: NotificationChanelEnum.SMS.toString() },
];
export const CreateOrUpdateNotificationTypTemplateForm = ({ id }: IProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<FormNotificationTypeChannel>();
  useQuery({
    queryKey: ['getNotificationTypeById', id, watch('channel'), watch('languageCode')],
    queryFn: () =>
      getNotificationByLanguage({
        channel: parseInt(getValues('channel')),
        languageCode: getValues('languageCode'),
        notificationTypeId: id || '',
      }),
    enabled: !!id && !!watch('channel') && !!watch('languageCode'),
    onSuccess: (response: AxiosResponse<NotificationTypeByGroup[]>) => {
      const data = response.data[0];
      if (data) {
        setValue('subject', data.subject);
        setValue('content', data.content);
        setValue('enabled', data.enable);
      } else {
        setValue('subject', '');
        setValue('content', '');
      }
    },
  });

  const languages = useQuery({
    queryKey: ['getAllLanguage'],
    queryFn: () => getAllLanguage(),
    select: (response) => {
      return response.data?.map((i) => ({ label: i.name, value: i.code })) ?? [];
    },
    onSuccess: (response) => {
      const languageCode = response[0].value;
      setValue('languageCode', languageCode);
      setValue('channel', NotificationChanelEnum.Email.toString());
    },
  }).data;

  const handleChangeLanguage = (data?: string) => {
    setValue('languageCode', data ?? '');
  };
  const handleChangeChannel = (data?: string) => {
    setValue('channel', data ?? '');
  };
  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s px-4 rounded-lg">
        <div className="gap-4 flex-1 mb-4">
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="mt-4">
              <FormLabel required>{common('Language')}</FormLabel>
              <SelectPortal
                placeholder={common('Language')}
                options={languages ?? []}
                onChange={(e: any) => handleChangeLanguage(e)}
                value={watch('languageCode')}
              />
              {errors?.languageCode?.message && (
                <FormHelperText error>{error(errors?.languageCode?.message)}</FormHelperText>
              )}
            </div>
            <div className="mt-4">
              <FormLabel required>{common('Channel')}</FormLabel>
              <SelectPortal
                placeholder={common('Chanel')}
                options={notificationChannels ?? []}
                onChange={(e: any) => handleChangeChannel(e)}
                value={watch('channel')}
              />
              {errors?.channel?.message && <FormHelperText error>{error(errors?.channel?.message)}</FormHelperText>}
            </div>
          </div>
          <div className="mt-2 text-sm">Please select language and channel to set up template.</div>
        </div>
      </div>
      <div className="bg-ic-white-6s px-4 rounded-lg mt-2" hidden={!getValues('languageCode') || !getValues('channel')}>
        <div className="flex">
          <div className="gap-4 flex-1 mb-4">
            <div className="mt-4">
              <FormLabel required>{t('Subject')}</FormLabel>
              <Input
                {...register('subject')}
                feedbackInvalid={errors?.subject?.message}
                classNameContainer="mt-2"
                placeholder={t('Subject')}
                hiddenClose
                name="subject"
              />
              {errors?.subject?.message && <FormHelperText error>{t(errors?.subject?.message)}</FormHelperText>}
            </div>
            <div className="mt-4">
              <FormLabel required>{t('Content')}</FormLabel>
              <Textarea
                rows={22}
                {...register('content')}
                feedbackInvalid={errors?.content?.message}
                placeholder={t('Content')}
                name="content"
              />
              {errors?.content?.message && <FormHelperText error>{t(errors?.content?.message)}</FormHelperText>}
            </div>
            <div className="mt-4">
              <Checkbox {...register('enabled')} label="Enabled" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
