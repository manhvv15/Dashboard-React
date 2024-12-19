import { FormHelperText, FormLabel, Input, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LocaleNamespace } from '@/constants/enums/common';
import { FormReport, ReportByIdResponse, ReportStatusEnum } from '@/types/document-service/report';
import { getApplications, getReportById } from '@/services/document-service/report';
import { getAllReportGroups } from '@/services/document-service/reportGroup';
import UploadFileTemplate from './UploadFileTemplate';

interface IProps {
  id?: string;
}

export const CreateOrUpdateReportForm = ({ id }: IProps) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  useQuery({
    queryKey: ['getReportById', id],
    queryFn: () => getReportById(id as string),
    enabled: !!id,
    onSuccess: (data: AxiosResponse<ReportByIdResponse>) => {
      setValue('code', data.data.code);
      setValue('name', data.data.name);
      setValue('fileInfo', data.data.fileInfo);
      setValue('reportGroupName', data.data.reportGroupName);
      setValue('applicationId', data.data.applicationId);
      setValue('reportGroupId', data.data.reportGroupId);
      setValue('status', data.data.status);
      setValue('allowTypes', data.data.allowTypes);
    },
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormReport>();
  const handleReportGroup = (data?: string) => {
    setValue('reportGroupId', data ?? '');
  };
  const handleApplication = (data?: string) => {
    setValue('applicationId', data ?? '');
  };

  const { data: reportGroupsData } = useQuery({
    queryKey: ['getAllReportGroups'],
    queryFn: async () => {
      const response = await getAllReportGroups();
      return response.data;
    },
    retry: false,
  });

  const reportGroups = reportGroupsData?.items
    ? reportGroupsData.items.map((i) => ({
        label: i.name,
        value: i.id,
      }))
    : [];
  const { data: applicationData } = useQuery({
    queryKey: ['getApplications'],
    queryFn: async () => {
      const response = await getApplications();
      return response.data;
    },
    retry: false,
  });
  const applications = applicationData?.items
    ? applicationData.items.map((i) => ({
        label: i.name,
        value: i.id,
      }))
    : [];
  const handleChangeStatus = (data: number) => {
    setValue('status', data);
  };

  const handleCheckboxChange = (value: string) => {
    const currentValues = watch('allowTypes') || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((type: string) => type !== value)
      : [...currentValues, value];
    setValue('allowTypes', updatedValues, { shouldValidate: true });
  };
  const onHandleSetFileInfor = (event: any) => {
    setValue('fileInfo', event);
  };
  const handleNameChange = (e: any) => {
    const name = e.target.value;
    const code = convertToCode(name);
    setValue('code', code);
  };
  const convertToCode = (name: string) => {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('_');
  };
  const reportTypeStatus = [
    { label: 'Active', value: ReportStatusEnum.Active },
    { label: 'Deactive', value: ReportStatusEnum.Deactivate },
  ];

  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <div className="flex-1">
          <div className="mt-4">
            <FormLabel required>{t('report.name')}</FormLabel>
            <Input
              {...register('name')}
              feedbackInvalid={errors?.name?.message}
              classNameContainer="mt-2"
              placeholder={t('report.name')}
              hiddenClose
              name="name"
              onChange={handleNameChange}
            />
            {errors?.name?.message && <FormHelperText error>{t(errors.name.message)}</FormHelperText>}
          </div>

          <div className="mt-4">
            <FormLabel required>{t('report.code')}</FormLabel>
            <Input
              {...register('code')}
              feedbackInvalid={errors?.code?.message}
              classNameContainer="mt-2"
              placeholder={t('report.code')}
              hiddenClose
              name="code"
            />
            {errors?.code?.message && <FormHelperText error>{t(errors.code.message)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel required>{t('report.applicationName')}</FormLabel>
            <SelectPortal
              placeholder={t('report.applicationName')}
              options={applications}
              onChange={handleApplication}
              value={watch('applicationId')}
            />
            {errors?.applicationId?.message && (
              <FormHelperText error>{error(errors?.applicationId?.message)}</FormHelperText>
            )}
          </div>
          <div className="mt-4">
            <FormLabel required>{t('report.reportGroupName')}</FormLabel>
            <SelectPortal
              placeholder={t('report.reportGroupName')}
              options={reportGroups}
              onChange={handleReportGroup}
              value={watch('reportGroupId')}
            />
            {errors?.reportGroupId?.message && (
              <FormHelperText error>{error(errors?.reportGroupId?.message)}</FormHelperText>
            )}
          </div>

          <div className="mt-4">
            <FormLabel>{t('report.allowTypes')}</FormLabel>
            <div className="flex gap-4">
              {['Xlsx', 'Docx', 'Pdf'].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={type.toUpperCase()}
                    checked={watch('allowTypes')?.includes(type.toUpperCase()) || false}
                    onChange={(e) => handleCheckboxChange(e.target.value)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <FormLabel required>{t('report.status')}</FormLabel>
            <SelectPortal
              placeholder={t('report.status')}
              options={reportTypeStatus}
              onChange={handleChangeStatus}
              value={watch('status')}
            />
            {errors?.status?.message && <FormHelperText error>{error(errors?.status?.message)}</FormHelperText>}
          </div>

          <div className="mt-4">
            <FormLabel required>{t('report.uploadFile')}</FormLabel>
            <div className="flex justify-start">
              <UploadFileTemplate
                fileInfo={watch('fileInfo')}
                setFileInfo={onHandleSetFileInfor}
                allowTypes={watch('allowTypes') || []}
                templateName={watch('templateName')}
              />
            </div>
            {errors?.fileInfo?.message && <FormHelperText error>{error(errors?.fileInfo?.message)}</FormHelperText>}
          </div>
        </div>
      </div>
    </div>
  );
};
