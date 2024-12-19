import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { CreateReportRequest, FormReport } from '@/types/document-service/report';
import { createReport } from '@/services/document-service/report';
import { CreateOrUpdateReportForm } from '@/components/reports/CreateOrUpdateReportForm';

const CreateReport = () => {
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
      reportGroupId: yup.string().required(error('fieldRequired')).trim(),
      applicationId: yup.string().required(error('fieldRequired')).trim(),
      status: yup.string().required(error('fieldRequired')).trim(),
      fileInfo: yup.object().required(error('fieldRequired')),
    })
    .required();

  const methods = useForm<FormReport>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const createReportMutation = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: t('reports.createReportSuccessfully'),
      });
      navigate('/environment-settings/reports');
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: t('codeOrNameExsited'),
      });
    },
  });

  const submitData = (data: FormReport) => {
    const request = {
      code: data.code,
      name: data.name,
      status: parseInt(data.status.toString()),
      reportGroupId: data.reportGroupId,
      applicationId: data.applicationId,
      allowTypes: data.allowTypes ?? [],
      fileInfo: data.fileInfo,
    } as CreateReportRequest;
    createReportMutation.mutate(request);
  };

  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('report.create')}</span>
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
            <CreateOrUpdateReportForm />
          </FormProvider>
        </div>
      </div>
    </LayoutSection>
  );
};

export default CreateReport;
