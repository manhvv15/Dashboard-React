import { FormHelperText, FormLabel, Input, RadioButton, SelectPortal, Textarea } from '@ichiba/ichiba-core-ui';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { getChargeUnits } from '@/services/configuration';
import { AgrregationTypeEnum, FormServiceModel, ServiceModelTypeEnum } from '@/types/common';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChangeEvent } from 'react';

interface Props {
  methods: UseFormReturn<FormServiceModel, any>;
}

const serviceModelTypes = [
  {
    value: ServiceModelTypeEnum.Metered,
    label: 'Metered',
  },
  {
    value: ServiceModelTypeEnum.Recurring,
    label: 'Recurring',
  },
];

const agrregationTypes = [
  {
    value: AgrregationTypeEnum.Count,
    label: 'Count',
  },
  {
    value: AgrregationTypeEnum.CountUnique,
    label: 'Count unique',
  },
  {
    value: AgrregationTypeEnum.Lastest,
    label: 'Lastest',
  },
  {
    value: AgrregationTypeEnum.Max,
    label: 'Max',
  },
  {
    value: AgrregationTypeEnum.Sum,
    label: 'Sum',
  },
  {
    value: AgrregationTypeEnum.Averrage,
    label: 'Averrage',
  },
  {
    value: AgrregationTypeEnum.PerUnit,
    label: 'PerUnit',
  },
];
export const CreateOrEditServiceModelForm = ({ methods }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = methods;

  const onHandleChangeType = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('type', Number(event.target.value));
  };

  const onHandleChangUnit = (event: string) => {
    setValue('unit', event);
  };
  const onHandleChangAgrregateType = (event: number) => {
    setValue('agrregationType', event);
  };

  const chargeUnits =
    useQuery({
      queryKey: ['getChargeUnits'],
      queryFn: getChargeUnits,
    }).data?.data.map((el) => ({
      value: el.code,
      label: el.name,
    })) ?? [];

  return (
    <div className="mt-4">
      <div className="rounded-lg border border-ic-ink-2s p-4">
        <p className="text-base font-medium text-ic-ink-6s">{common('generalInformation')}</p>
        <div className="mt-4">
          <div>
            <FormLabel required>{common('serviceName')}</FormLabel>
            <Input {...register('name')} hiddenClose placeholder="Service name" error={!!errors.name?.message} />
            {errors.name?.message && <FormHelperText error>{error(errors?.name?.message as string)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel>{common('description')}</FormLabel>
            <Textarea {...register('description')} placeholder="Description" rows={5} />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-ic-ink-2s p-4 mt-4">
        <p className="text-base font-medium text-ic-ink-6s">{common('serviceConfiguration')}</p>
        <div className=" flex w-1/2 flex-col">
          <div className="w-full mt-4">
            <FormLabel required>{common('chargeUnit')}</FormLabel>
            <SelectPortal
              value={watch('unit')}
              options={chargeUnits}
              error={!!errors.unit?.message}
              onChange={onHandleChangUnit}
              placeholder={common('chargeUnit')}
            />
            {errors.unit?.message && <FormHelperText error>{error(errors?.unit?.message as string)}</FormHelperText>}
          </div>
          <div className="mt-4">
            <FormLabel required>{common('type')}</FormLabel>
            <div className="flex">
              {serviceModelTypes.map((item, index) => {
                return (
                  <div key={index} className={clsx('font-medium text-sm mr-4')}>
                    <RadioButton
                      value={item.value}
                      label={item.label}
                      className="flex items-center text-sm"
                      onChange={onHandleChangeType}
                      checked={item.value.toString() === watch('type')?.toString()}
                      name="type"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full mt-4">
            <FormLabel required>{common('agrregationType')}</FormLabel>
            <SelectPortal
              value={watch('agrregationType')}
              options={agrregationTypes}
              error={!!errors.agrregationType?.message}
              placeholder={common('agrregationType')}
              onChange={onHandleChangAgrregateType}
            />
            {errors.agrregationType?.message && (
              <FormHelperText error>{error(errors?.agrregationType?.message as string)}</FormHelperText>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
