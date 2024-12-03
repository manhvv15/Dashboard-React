import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { CreateOrUpdateNotificationTypTemplateForm } from '@/components/notifications/CreateOrUpdateNotificationTypTemplateForm';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { upsertNotificationTypeChannel } from '@/services/user-management/notifiation';
import {
  CreateNotificationTypeChannelRequest,
  FormNotificationTypeChannel,
} from '@/types/user-management/notification';
import { responseErrorCode } from '@/utils/common';

const NoptificationTypeTemplate = () => {
  const { id } = useParams();
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const navigate = useNavigate();
  const { showToast } = useApp();

  const schema = yup
    .object()
    .shape({
      channel: yup.string().required(error('fieldRequired')),
      languageCode: yup.string().required(error('fieldRequired')),
      subject: yup.string().required(error('fieldRequired')),
      content: yup.string().required(error('fieldRequired')),
    })
    .required();

  const methods = useForm<FormNotificationTypeChannel>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      notificationTypeId: id,
      enabled: false,
    },
  });

  const upsertNotificationTypeMutation = useMutation({
    mutationFn: upsertNotificationTypeChannel,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: t('Create or update channel template successfully.'),
      });
    },
    onError: (err: any) => {
      const { errorFrom } = err;
      if (errorFrom) {
        responseErrorCode(err.errorFrom).forEach(({ name, message, type }) => {
          const mess = error(message);
          methods.setError(name, { type, message: mess });
        });
      }
    },
  });

  const submitData = (data: FormNotificationTypeChannel) => {
    const request = {
      channel: parseInt(data.channel),
      content: data.content,
      enabled: data.enabled,
      languageCode: data.languageCode,
      notificationTypeId: id,
      subject: data.subject,
    } as CreateNotificationTypeChannelRequest;
    upsertNotificationTypeMutation.mutate(request);
  };
  const onHandleBack = () => {
    navigate(`/environment-settings/notification`);
  };
  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('Notification template')}</span>
        </button>
      }
      right={
        <div className="flex items-center gap-x-3">
          <Button onClick={() => onHandleBack()} color="danger" variant="outlined">
            <SvgIcon icon="arrow-left" width={20} height={20} />
            <p className="ml-1">{t('Back home')}</p>
          </Button>

          <Button variant="outlined" onClick={methods.handleSubmit(submitData)}>
            <SvgIcon icon="save" width={20} height={20} />
            <p className="ml-1">{t('save')}</p>
          </Button>
        </div>
      }
    >
      <div className="scroll h-[calc(100vh_-_100px)] flex flex-col overflow-y-auto">
        <div className="flex justify-center p-6">
          <FormProvider {...methods}>
            <CreateOrUpdateNotificationTypTemplateForm id={id} />
          </FormProvider>
        </div>
      </div>
    </LayoutSection>
  );
};

export default NoptificationTypeTemplate;
