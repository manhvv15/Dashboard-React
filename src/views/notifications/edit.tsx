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
import { CreateOrUpdateNotificationTypeForm } from '@/components/notifications/CreateOrUpdateNotificationTypeForm';
import { LocaleNamespace } from '@/constants/enums/common';
import { updateNotificationType } from '@/services/user-management/notifiation';
import {
  FormNotificationType,
  NotificationTypeStatusEnum,
  UpdateNotificationTypeRequest,
} from '@/types/user-management/notification';
import { responseErrorCode } from '@/utils/common';

const UpdateNotification = () => {
  const { id } = useParams();
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const navigate = useNavigate();

  const schema = yup
    .object()
    .shape({
      notificationGroupId: yup.string().required(error('fieldRequired')),
      code: yup
        .string()
        .required(error('fieldRequired'))
        .min(3, error('validateOrganizationNameRule'))
        .max(250, error('validateOrganizationNameRule'))
        .trim(),
      name: yup
        .string()
        .required(error('fieldRequired'))
        .min(3, error('validateOrganizationNameRule'))
        .max(250, error('validateOrganizationNameRule'))
        .trim(),
    })
    .required();

  const methods = useForm<FormNotificationType>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      status: NotificationTypeStatusEnum.Active.toString(),
    },
  });

  const updateNotificationTypeMutation = useMutation({
    mutationFn: updateNotificationType,
    onSuccess: () => {
      navigate(`/environment-settings/notification/templates/${id}`);
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorNormal && errorNormal === 'nameExisted') {
        methods.setError('name', { message: error('nameExisted') });
      }
      if (errorNormal && errorNormal === 'codeExisted') {
        methods.setError('code', { message: error('codeExisted') });
      }
      if (errorFrom) {
        responseErrorCode(err.errorFrom).forEach(({ name, message, type }) => {
          const mess = error(message);
          methods.setError(name, { type, message: mess });
        });
      }
    },
  });

  const submitData = (data: FormNotificationType) => {
    const request = {
      id: id,
      code: data.code,
      name: data.name,
      notificationGroupId: data.notificationGroupId,
      status: parseInt(data.status),
      isSystem: data.isSystem,
    } as UpdateNotificationTypeRequest;
    updateNotificationTypeMutation.mutate(request);
  };

  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('Edit notification')}</span>
        </button>
      }
      right={
        <div className="flex items-center gap-x-3">
          <Button onClick={() => navigate(-1)} color="danger" variant="outlined">
            <SvgIcon icon="close-circle" width={20} height={20} />
            <p className="ml-1">{t('cancel')}</p>
          </Button>

          <Button variant="outlined" onClick={methods.handleSubmit(submitData)}>
            <SvgIcon icon="arrow-right" width={20} height={20} />
            <p className="ml-1">{t('Next')}</p>
          </Button>
        </div>
      }
    >
      <div className="scroll h-[calc(100vh_-_100px)] flex flex-col overflow-y-auto">
        <div className="flex justify-center p-6">
          <FormProvider {...methods}>
            <CreateOrUpdateNotificationTypeForm id={id} />
          </FormProvider>
        </div>
      </div>
    </LayoutSection>
  );
};

export default UpdateNotification;
