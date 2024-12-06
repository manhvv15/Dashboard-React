import { FormHelperText, FormLabel, Input, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LocaleNamespace } from '@/constants/enums/common';
import { getReportGroupById } from '@/services/document-service/reportGroup';
import { FormReportGroup, ReportGroupByIdResponse, ReportGroupStatusEnum } from '@/types/document-service/report-group';
interface IProps {
  id?: string;
}

export const CreateOrUpdateReportGroupForm = ({ id }: IProps) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  useQuery({
    queryKey: ['getReportGroupById', id],
    queryFn: () => getReportGroupById(id as string),
    enabled: !!id,
    onSuccess: (data: AxiosResponse<ReportGroupByIdResponse>) => {
      setValue('code', data.data.code);
      setValue('name', data.data.name);
      setValue('description', data.data.description);
      setValue('displayOrder', data.data.displayOrder);
      setValue('status', data.data.status);
    },
  });
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormReportGroup>();

  const reportTypeStatus: { label: string; value: number }[] = [
    { label: 'Active', value: ReportGroupStatusEnum.Active },
    { label: 'Deactive', value: ReportGroupStatusEnum.Deactivate },
  ];

  const handleChangeStatus = (data: number) => {
    setValue('status', data);
  };

  const handleNameChange = (e: any) => {
    const name = e.target.value;
    const code = convertToCode(name);
    setValue('code', code);
  };
  const convertToCode = (name: string) => {
    const normalizedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return normalizedName
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('_');
  };

  return (
    <div className="scroll h-full overflow-y-auto flex justify-center flex-col w-full max-w-[1200px]">
      <div className="bg-ic-white-6s p-4 rounded-lg">
        <div className="flex-1">
          <div className="mt-4">
            <FormLabel required>{t('reportgroup.name')}</FormLabel>
            <Input
              {...register('name')}
              feedbackInvalid={errors?.name?.message}
              classNameContainer="mt-2"
              placeholder={t('reportgroup.name')}
              hiddenClose
              name="name"
              onChange={handleNameChange}
            />
            {errors?.name?.message && <FormHelperText error>{t(errors.name.message)}</FormHelperText>}
          </div>

          <div className="mt-4">
            <FormLabel required>{t('reportgroup.code')}</FormLabel>
            <Input
              {...register('code')}
              feedbackInvalid={errors?.code?.message}
              classNameContainer="mt-2"
              placeholder={t('reportgroup.code')}
              hiddenClose
              name="code"
            />
            {errors?.code?.message && <FormHelperText error>{t(errors.code.message)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel>{t('reportgroup.descrription')}</FormLabel>
            <Input
              {...register('description')}
              classNameContainer="mt-2"
              placeholder={t('reportgroup.descrription')}
              hiddenClose
              name="description"
            />
          </div>
          <div className="mt-4">
            <FormLabel>{t('reportgroup.displayOrder')}</FormLabel>
            <Input
              {...register('displayOrder')}
              feedbackInvalid={errors?.displayOrder?.message}
              classNameContainer="mt-2"
              placeholder={t('reportgroup.displayOrder')}
              hiddenClose
              type="number"
            />
            {errors?.displayOrder?.message && <FormHelperText error>{t(errors?.displayOrder?.message)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel required>{t('report.status')}</FormLabel>
            <SelectPortal
              placeholder={t('report.status')}
              options={reportTypeStatus ?? []}
              onChange={(e: any) => handleChangeStatus(e)}
              value={watch('status')}
            />
            {errors?.status?.message && <FormHelperText error>{error(errors?.status?.message)}</FormHelperText>}
          </div>
        </div>
      </div>
    </div>
  );
};
