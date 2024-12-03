import { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormHelperText,
  FormLabel,
  Input,
  MultipleSelect,
  Switch,
  Textarea,
} from '@ichiba/ichiba-core-ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace, StatusPlanEnum } from '@/constants/enums/common';
import { getApplications } from '@/services/configuration';
import { DataPlanInformationRequest, PlanDetail, ScreenPlanEnum } from '@/types/common';
import { typeStepPlan } from '@/views/configuration/plans/create-plan';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

interface Props {
  setDataPlanInformation: Dispatch<SetStateAction<DataPlanInformationRequest | undefined>>;
  setNextStep: Dispatch<SetStateAction<typeStepPlan>>;
  planDetail: PlanDetail | undefined;
  screenType: ScreenPlanEnum;
}

const PlanInformationForm = ({ setDataPlanInformation, setNextStep, planDetail, screenType }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const schema = yup
    .object({
      applicationIds: yup.array().required('fieldRequired'),
      name: yup.string().required('fieldRequired'),
      description: yup.string().notRequired(),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<DataPlanInformationRequest>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const handleChangeApplication = (e: string[]) => {
    setValue('applicationIds', e);
  };

  useEffect(() => {
    if (!!planDetail) {
      setValue('name', planDetail?.name ?? '');
      setValue('code', planDetail?.code ?? '');
      setValue('status', planDetail?.status ?? StatusPlanEnum.Active);
      setValue('description', planDetail?.description);
      setValue('applicationIds', planDetail?.applicationIds ?? []);
      setValue('isDefault', planDetail?.isDefault ?? false);
      setValue('limitation', planDetail?.limitation);
    }
  }, [planDetail]);

  const onSubmit = (data: DataPlanInformationRequest) => {
    setDataPlanInformation(data);
    setNextStep(2);
  };

  useEffect(() => {
    setDataPlanInformation(watch());
  }, [
    watch('applicationIds'),
    watch('description'),
    watch('name'),
    watch('status'),
    watch('isDefault'),
    watch('limitation.market'),
    watch('limitation.user'),
  ]);

  const allApplications =
    useQuery({
      queryKey: ['getApplications'],
      queryFn: getApplications,
    }).data?.data.map((i) => ({ label: i.name, value: i.id })) ?? [];

  const checkData = !!watch('applicationIds')?.length && !!watch('name');

  const handleChangeStatus = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('status', event.target.checked ? StatusPlanEnum.Active : StatusPlanEnum.Deactivate);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="border-b pb-6  border border-ic-ink-2s w-full bg-ic-white-6s rounded-lg p-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium text-ic-ink-6s">{common('planInformation')}</p>
          {screenType == ScreenPlanEnum.Edit && (
            <Switch onChange={handleChangeStatus} checked={watch('status') === StatusPlanEnum.Active} />
          )}
        </div>
        <div className={clsx(screenType != ScreenPlanEnum.Edit ? 'grid-cols-2' : 'grid-cols-3', 'grid  gap-4 mt-4')}>
          <div>
            <FormLabel required>{common('application')}</FormLabel>
            <MultipleSelect
              value={watch('applicationIds')}
              onChange={handleChangeApplication}
              error={!!errors.applicationIds?.message}
              options={allApplications}
              placeholder={'Choose application from list'}
            />
            {errors.applicationIds?.message && (
              <FormHelperText error>{error(errors.applicationIds?.message)}</FormHelperText>
            )}
          </div>
          <div>
            <FormLabel required>{common('name')}</FormLabel>
            <Input hiddenClose error={!!errors.name?.message} {...register('name')} placeholder={'Type a name'} />
            {errors.name?.message && <FormHelperText error>{error(errors.name?.message)}</FormHelperText>}
          </div>
          {screenType == ScreenPlanEnum.Edit && (
            <>
              <div>
                <FormLabel>{common('code')}</FormLabel>
                <Input
                  hiddenClose
                  error={!!errors.name?.message}
                  {...register('code')}
                  placeholder={'Type a code'}
                  disabled
                />
                {errors.code?.message && <FormHelperText error>{error(errors.code?.message)}</FormHelperText>}
              </div>
            </>
          )}
        </div>
        <div className="mt-4">
          <Checkbox {...register('isDefault')} label="Is default" />
        </div>
        <div className="mt-4">
          <FormLabel>{common('description')}</FormLabel>
          <Textarea {...register('description')} cols={5} />
        </div>
      </div>

      {screenType != ScreenPlanEnum.Edit && (
        <>
          <div className="mt-4 flex justify-end">
            <Button disabled={!checkData} type="submit" className="flex items-center">
              <p>{common('next')}</p>
              <SvgIcon icon="arrow-right" width={20} height={20} />
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default PlanInformationForm;
