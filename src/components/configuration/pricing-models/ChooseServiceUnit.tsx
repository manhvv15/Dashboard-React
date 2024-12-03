import { FormLabel, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BillingCycleEnum, ChargeModelEnum, LocaleNamespace, PeriodTypeEnum } from '@/constants/enums/common';

import { getChargeModel, getChargeUnits } from '@/services/configuration';
import { useState } from 'react';
import { billingList, periodList } from './constant';
import { PricingModelInterface } from './schema/pricing-model';

interface Props {
  index: number;
}

interface Option {
  label: string;
  value: string | number;
}

export const ChooseServiceModel = ({ index }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const [chargeModel, setChargeModel] = useState<Option[]>([]);
  const [tierUnit, setTierUnit] = useState<Option[]>([]);

  const {
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
    watch,
  } = useFormContext<PricingModelInterface>();

  useQuery({
    queryKey: ['getChargeModel'],
    queryFn: getChargeModel,
    onSuccess: (res) => {
      const data = res.data.map((i) => ({ label: i.name, value: i.value }));
      setChargeModel(data);
    },
  });

  const listChargeUnits =
    useQuery({
      queryKey: ['getChargeUnits'],
      queryFn: getChargeUnits,
      onSuccess: (res) => {
        const findData = res.data.find((i) => i.code === watch(`step2.${index}.unit`));

        if (findData) {
          setTierUnit(findData.unitOfMeasures.map((i) => ({ label: i.name, value: i.code })));
          if (findData.unitOfMeasures[0]?.code) {
            setValue(`step2.${index}.unitTier`, findData.unitOfMeasures[0].code);
          }
        }
      },
    }).data?.data.map((i) => ({ label: i.name, value: i.code, unitOfMeasures: i.unitOfMeasures })) ?? [];

  const handleChargeModel = (value: ChargeModelEnum) => {
    clearErrors();
    setValue(`step2.${index}.chargeModel`, value);
    if (getValues(`step2.${index}.tier`).length > 0) {
      const newData = {} as any;
      const price0 = watch(`step2.${index}.tier`)[0] as any;
      Object.keys(price0).forEach((item) => {
        if (item === 'firstUnit' || item === 'lastUnit' || item === 'name') {
          if (item === 'firstUnit') {
            newData[item] = '0';
          } else if (item === 'name') {
            newData[item] = '';
          } else {
            newData[item] = '';
          }
        } else {
          newData[item] = {
            unitFeeAmount: '',
            flatFeeAmount: '',
          };
        }
      });
      setValue(`step2.${index}.tier`, [newData]);
    }
  };

  const handleUnit = (value: string) => {
    clearErrors();
    setValue(`step2.${index}.unit`, value);
    if (getValues(`step2.${index}.tier`).length > 0) {
      const newData = {} as any;
      const price0 = watch(`step2.${index}.tier`)[0] as any;
      Object.keys(price0).forEach((item) => {
        if (item === 'firstUnit' || item === 'lastUnit' || item === 'name') {
          if (item === 'firstUnit') {
            newData[item] = '0';
          } else if (item === 'name') {
            newData[item] = '';
          } else {
            newData[item] = '';
          }
        } else {
          newData[item] = {
            unitFeeAmount: '',
            flatFeeAmount: '',
          };
        }
      });
      setValue(`step2.${index}.tier`, [newData]);
    }
  };

  const handleUnitV2 = (val: string) => {
    clearErrors(`step2.${index}.unitTier`);
    setValue(`step2.${index}.unitTier`, val);
  };

  const handlePeriod = (value: PeriodTypeEnum) => {
    setValue(`step2.${index}.period`, value);
  };

  const handleBillingCycle = (value: BillingCycleEnum) => {
    setValue(`step2.${index}.billingCycle`, value);
  };

  return (
    <div className="flex justify-between gap-2 mt-2">
      <div className="w-full">
        <FormLabel required>{common('chargeModel')}</FormLabel>
        <SelectPortal
          searchable={false}
          error={!!(errors.step2 ?? [])[index]?.chargeModel?.message}
          helperText={error((errors.step2 ?? [])[index]?.chargeModel?.message as string)}
          onChange={handleChargeModel}
          options={chargeModel}
          placeholder="Choose a model"
          value={watch(`step2.${index}.chargeModel`)}
        />
      </div>
      <div className="w-full">
        <FormLabel required>{common('period')}</FormLabel>
        <SelectPortal
          searchable={false}
          error={!!(errors.step2 ?? [])[index]?.period?.message}
          helperText={error((errors.step2 ?? [])[index]?.period?.message as string)}
          onChange={handlePeriod}
          options={periodList}
          placeholder="Choose a period"
          value={watch(`step2.${index}.period`)}
        />
      </div>
      <div className="w-full">
        <FormLabel required>{common('billingCycle')}</FormLabel>
        <SelectPortal
          searchable={false}
          error={!!(errors.step2 ?? [])[index]?.billingCycle?.message}
          helperText={error((errors.step2 ?? [])[index]?.billingCycle?.message as string)}
          onChange={handleBillingCycle}
          options={billingList}
          placeholder="Choose a billingCycle"
          value={watch(`step2.${index}.billingCycle`)}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <FormLabel required>{common('unit')}</FormLabel>
          <SelectPortal
            searchable={false}
            error={!!(errors.step2 ?? [])[index]?.unit?.message}
            helperText={error((errors.step2 ?? [])[index]?.unit?.message as string)}
            onChange={handleUnit}
            options={listChargeUnits}
            disabled
            placeholder="Choose a unit"
            value={watch(`step2.${index}.unit`)}
          />
        </div>
        <div className="mt-7">
          <SelectPortal
            searchable={false}
            error={!!(errors.step2 ?? [])[index]?.unitTier?.message}
            helperText={(errors.step2 ?? [])[index]?.unitTier?.message}
            onChange={handleUnitV2}
            options={tierUnit}
            placeholder="Tier"
            value={watch(`step2.${index}.unitTier`)}
          />
        </div>
      </div>
    </div>
  );
};
