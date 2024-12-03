import { Checkbox, DatePicker, FormHelperText, FormLabel, InputNumber, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace, PeriodTypeEnum, TrialTypeEnum } from '@/constants/enums/common';
import { getCurrencyByPricing, getPlans } from '@/services/configuration';

import { ChoosePrice } from './ChoosePrice';
import { billingList, periodList, periodValueList, trialLengthList } from './constant';
import { PricingModelInterface } from './schema/pricing-model';

export const Step1CreateForm = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const {
    register,
    setValue,
    control,
    formState: { errors },
    watch,
    clearErrors,
  } = useFormContext<PricingModelInterface>();

  const { fields: fieldPrices } = useFieldArray({ control: control, name: 'step1.price' });

  const listPlan =
    useQuery({
      queryKey: ['getPlans'],
      queryFn: () => getPlans({ pageSize: 100 }),
    }).data?.data.items.map((i) => ({ label: i.name, value: i.id })) ?? [];

  const handleChangePlan = (e: string) => {
    clearErrors('step1.plans');
    setValue('step1.plans', e);
  };

  const handleChangeDateFrom = (date?: Date) => {
    clearErrors('step1.effectiveDate.from');
    setValue('step1.effectiveDate.from', (date as Date).toUTCString());
  };

  const handleChangeDateTo = (date?: Date) => {
    setValue('step1.effectiveDate.to', (date as Date).toUTCString());
  };

  const handleChangePeriod = (e: number) => {
    clearErrors('step1.period');
    setValue('step1.period', e);
  };
  const handleChangePeriodTimeUnit = (e: number) => {
    clearErrors('step1.periodTimeUnit');
    setValue('step1.periodTimeUnit', e);
  };

  const handleChangeTrial = (e: number) => {
    clearErrors('step1.trialLength');
    setValue('step1.trialLength', e);
  };
  const handleChangeTrialLengthTimeUnit = (e: number) => {
    clearErrors('step1.trialLengthTimeUnit');
    setValue('step1.trialLengthTimeUnit', e);
  };
  const handleChangeBilling = (e: number) => {
    clearErrors('step1.billingCycle');
    setValue('step1.billingCycle', e);
  };

  useQuery({
    queryKey: ['getCurrencyByPricing'],
    queryFn: () => getCurrencyByPricing(),
    onSuccess: (data) => {
      const newData = data.data.map((i) => ({ value: '', unit: i.code }));
      setValue('step1.price', newData);
    },
  });

  return (
    <div className=" mt-4 flex flex-col gap-y-4">
      <div className="p-4 rounded-lg border border-ic-ink-2s">
        <p className="text-base font-medium text-ic-ink-6s">{common('generalInformation')}</p>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4 ">
            <div>
              <FormLabel required>{common('plan')}</FormLabel>
              <SelectPortal
                helperText={error(errors.step1?.plans?.message as string)}
                error={!!errors.step1?.plans?.message}
                onChange={handleChangePlan}
                options={listPlan}
                placeholder="Choose a plan"
                value={watch('step1.plans')}
              />
            </div>
            <div>
              <FormLabel required>{common('effectiveDate')}</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  timePicker
                  helperText={error(errors.step1?.effectiveDate?.from?.message as string)}
                  error={!!errors.step1?.effectiveDate?.from?.message}
                  onChange={handleChangeDateFrom}
                  minDate={new Date(Date.now())}
                  placeholder="From"
                  value={watch('step1.effectiveDate.from') ? new Date(watch('step1.effectiveDate.from')) : undefined}
                />
                <DatePicker
                  timePicker
                  minDate={new Date(Date.now())}
                  value={
                    watch('step1.effectiveDate.to') ? new Date(watch('step1.effectiveDate.to') as string) : undefined
                  }
                  onChange={handleChangeDateTo}
                  placeholder="to"
                />
              </div>
            </div>
          </div>
          {/* <div className="mt-4">
            <FormLabel required>{common('name')}</FormLabel>
            <Input
              hiddenClose
              error={!!errors.step1?.name?.message}
              {...register('step1.name')}
              placeholder="Input here"
            />
            <FormHelperText error>{error(errors.step1?.name?.message as string)}</FormHelperText>
          </div> */}
        </div>
      </div>
      <div className="p-4 rounded-lg border border-ic-ink-2s">
        <p className="text-base font-medium text-ic-ink-6s">{common('currencyAndPrice')}</p>
        <div className="mt-4  flex flex-col  gap-y-4">
          <div className="w-full  grid grid-cols-3 gap-4">
            <div>
              <FormLabel required>{common('period')}</FormLabel>
              <SelectPortal
                searchable={false}
                onChange={handleChangePeriod}
                helperText={error(errors.step1?.period?.message as string)}
                error={!!errors.step1?.period?.message}
                options={periodList}
                placeholder="Choose a period"
                value={watch('step1.period')}
              />
            </div>
            <div
              className={clsx(
                watch('step1.period') === PeriodTypeEnum.Customize ? 'block' : 'hidden',
                'grid col-span-2 grid-cols-2 gap-4',
              )}
            >
              <div>
                <FormLabel required>{common('numberOfTimes')}</FormLabel>
                <InputNumber
                  hiddenClose
                  error={!!errors.step1?.periodNumber?.message}
                  placeholder="number of times"
                  onChange={(e) => {
                    const value = e.target.value;
                    clearErrors('step1.periodNumber');
                    setValue('step1.periodNumber', value);
                  }}
                  value={watch('step1.periodNumber')}
                />
                {errors.step1?.periodNumber?.message && (
                  <FormHelperText error>{error(errors.step1?.periodNumber?.message as string)}</FormHelperText>
                )}
              </div>
              <div>
                <FormLabel required>{common('timeUnit')}</FormLabel>
                <SelectPortal
                  searchable={false}
                  onChange={handleChangePeriodTimeUnit}
                  helperText={error(errors.step1?.periodTimeUnit?.message as string)}
                  error={!!errors.step1?.periodTimeUnit?.message}
                  options={periodValueList}
                  placeholder="Time unit"
                  value={watch('step1.periodTimeUnit')}
                />
              </div>
            </div>
          </div>
          <Checkbox
            {...register('step1.vatIncluded')}
            label={<p className="text-sm font-normal text-ic-ink-6s">{common('priceIncludeVat')}</p>}
          />
          <Checkbox
            {...register('step1.isContactUs')}
            label={<p className="text-sm font-normal text-ic-ink-6s ">{common('contactUs')}</p>}
          />
          <div>
            <FormLabel required>{common('price')}</FormLabel>
            <div className="flex flex-col gap-y-2">
              {fieldPrices.map((item, index) => {
                return <ChoosePrice key={item.id} index={index} />;
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg border border-ic-ink-2s">
        <p className="text-base font-medium text-ic-ink-6s">{common('freeTrialAndBilling')}</p>
        <div className="mt-4  flex flex-col gap-y-4">
          <div className="w-full  grid grid-cols-3 gap-4">
            <div>
              <FormLabel required>{common('trialLength')}</FormLabel>
              <SelectPortal
                onChange={handleChangeTrial}
                searchable={false}
                options={trialLengthList}
                placeholder="Choose a trial"
                helperText={error(errors.step1?.trialLength?.message as string)}
                error={!!errors.step1?.trialLength?.message}
                value={watch('step1.trialLength')}
              />
            </div>
            <div
              className={clsx(
                watch('step1.trialLength') === TrialTypeEnum.Customize ? 'block' : 'hidden',
                'grid col-span-2 grid-cols-2 gap-4',
              )}
            >
              <div>
                <FormLabel required>{common('numberOfTimes')}</FormLabel>
                <InputNumber
                  hiddenClose
                  error={!!errors.step1?.trialLengthNumber?.message}
                  placeholder="number of times"
                  onChange={(e) => {
                    const value = e.target.value;
                    clearErrors('step1.trialLengthNumber');
                    setValue('step1.trialLengthNumber', value);
                  }}
                  value={watch('step1.trialLengthNumber')}
                />
                {errors.step1?.trialLengthNumber?.message && (
                  <FormHelperText error>{error(errors.step1?.trialLengthNumber?.message as string)}</FormHelperText>
                )}
              </div>
              <div>
                <FormLabel required>{common('timeUnit')}</FormLabel>
                <SelectPortal
                  searchable={false}
                  onChange={handleChangeTrialLengthTimeUnit}
                  helperText={error(errors.step1?.trialLengthTimeUnit?.message as string)}
                  error={!!errors.step1?.trialLengthTimeUnit?.message}
                  options={periodValueList}
                  placeholder="Time unit"
                  value={watch('step1.trialLengthTimeUnit')}
                />
              </div>
            </div>
          </div>

          <div className="w-full  max-w-[300px]">
            <FormLabel required>{common('billingCycle')}</FormLabel>
            <SelectPortal
              onChange={handleChangeBilling}
              searchable={false}
              options={billingList}
              placeholder="Choose a cycle"
              helperText={error(errors.step1?.billingCycle?.message as string)}
              error={!!errors.step1?.billingCycle?.message}
              value={watch('step1.billingCycle')}
            />
          </div>
          <div>
            <Checkbox
              {...register('step1.autoRenew')}
              label={
                <p className="text-sm font-normal text-ic-ink-6s">{common('autoRenewAtTheEndOfSubscriptionTerm')}</p>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
