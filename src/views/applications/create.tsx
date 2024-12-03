import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { CreateOrUpdateApplicationForm } from '@/components/applications/CreateOrUpdateApplicationForm';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { createApplication } from '@/services/user-management/application';
import { ApplicationStatusEnum, CreateApplicationRequest, FormApplication } from '@/types/user-management/application';
import { responseErrorCode } from '@/utils/common';

const CreateApplication = () => {
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const navigate = useNavigate();
  const { showToast } = useApp();

  const schema = yup
    .object()
    .shape({
      code: yup
        .string()
        .required(error('fieldRequired'))
        .min(3, error('role.form.message.codeOrNameInValid'))
        .max(250, error('role.form.message.codeOrNameInValid'))
        .trim(),
      name: yup
        .string()
        .required(error('fieldRequired'))
        .min(3, error('role.form.message.codeOrNameInValid'))
        .max(250, error('role.form.message.codeOrNameInValid'))
        .trim(),
    })
    .required();

  const methods = useForm<FormApplication>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const createApplicationMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: t('application.createApplicationSuccessfully'),
      });
      navigate('/environment-settings/applications');
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorNormal && errorNormal === 'nameExisted') {
        methods.setError('name', { message: error('nameExisted') });
      }
      if (errorNormal && errorNormal === 'codeExisted') {
        methods.setError('code', { message: error('role.roleCodeExisted', { role_code: methods.getValues('code') }) });
      }
      if (errorFrom) {
        responseErrorCode(err.errorFrom).forEach(({ name, message, type }) => {
          const mess = error(message);
          methods.setError(name, { type, message: mess });
        });
      }
    },
  });

  const submitData = (data: FormApplication) => {
    const request = {
      code: data.code,
      isDefault: data.isDefault,
      isSystem: data.isSystem,
      logoUrl: data.logoUrl,
      shortName: data.shortName,
      name: data.name,
      order: data.order ? +data.order : null,
      status: ApplicationStatusEnum.Active,
      url: data.url,
      workspaceRequired: data.workspaceRequired,
      applicationGroupId: data.applicationGroupId,
      description: data.description,
    } as CreateApplicationRequest;
    createApplicationMutation.mutate(request);
  };

  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('application.create')}</span>
        </button>
      }
      right={
        <div className="flex items-center gap-x-3">
          <Button onClick={() => navigate(-1)} color="danger" variant="outlined">
            <SvgIcon icon="close-circle" width={20} height={20} />
            <p className="ml-1">{t('cancel')}</p>
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
            <CreateOrUpdateApplicationForm />
          </FormProvider>
        </div>
      </div>
    </LayoutSection>
  );
};

export default CreateApplication;
