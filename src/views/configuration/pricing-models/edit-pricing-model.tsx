import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import { ModalCancelCreateService } from '@/components/configuration/modal/ModalCancelCreateService';
import {
  PricingModelInterface,
  pricingModelSchema,
} from '@/components/configuration/pricing-models/schema/pricing-model';
import { Step1CreateForm } from '@/components/configuration/pricing-models/Step1CreateForm';
import { Step2CreateForm } from '@/components/configuration/pricing-models/Step2CreateForm';
import LayoutSection from '@/components/layouts/layout-section';
import { BillingCycleEnum, ChargeModelEnum, LocaleNamespace, PeriodTypeEnum } from '@/constants/enums/common';
import { USD_CURRENCY } from '@/constants/variables/common';
import { useApp } from '@/hooks/use-app';
import { detailPricingFee, editPricingFee } from '@/services/configuration';
import { parseDateLocalToUTC } from '@/utils/common';

const EditPricingModels = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const { id } = useParams();

  const [currencies, setCurrencies] = useState<string[]>([]);

  const [openModel, setOpenModel] = useState(false);

  const methods = useForm<PricingModelInterface>({
    mode: 'onBlur',
    resolver: yupResolver(pricingModelSchema(currencies)),
    defaultValues: {
      step1: {
        price: [{ value: '', unit: USD_CURRENCY }],
      },
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = methods;

  console.log('errors', errors);
  console.log('watch', watch());

  useQuery({
    queryKey: ['detailPricingFee', id],
    queryFn: () => detailPricingFee(id as string),
    enabled: !!id,
    onSuccess: (res) => {
      const data = res.data;

      setCurrencies([...data.feeCurrencies.map((o) => o.currencyCode)]);

      setValue('step1.plans', data.planId);
      setValue('step1.name', data.name);
      setValue('step1.effectiveDate.from', data.effectiveDateStart);
      setValue('step1.effectiveDate.to', data.effectiveDateEnd);
      setValue('step1.period', data.period.periodType);
      setValue('step1.periodNumber', String(data.period.number));
      setValue('step1.periodTimeUnit', data.period.periodTypeValue);
      setValue('step1.vatIncluded', data.VATIncluded);
      setValue('step1.isContactUs', data.isContactUs);
      setValue(
        'step1.price',
        data.feeCurrencies.map((o) => ({ value: String(o.amount), unit: o.currencyCode })),
      );

      setValue('step1.trialLength', data.billing.trialType);
      setValue('step1.trialLengthNumber', String(data.billing.number));
      setValue('step1.trialLengthTimeUnit', data.billing.trialTypeValue);
      setValue('step1.billingCycle', data.billing.billingCycle);
      setValue('step1.autoRenew', data.billing.autoRenew);

      const tiers = data.feeServices.map((o) => {
        return {
          service: {
            value: o.serviceId,
            name: o.serviceName,
          },
          chargeModel: o.chargeModel,
          unit: o.unit,
          period: o.periodType,
          billingCycle: o.billingCycle,
          unitTier: o.tiers[0].tierUnit,
          tier: o.tiers.map((i) => {
            const obj = {} as any;
            i.tierCurrencies.forEach((ite) => {
              obj[ite.currencyCode] = {
                unitFeeAmount: String(ite.unitFee) ?? undefined,
                flatFeeAmount: String(ite.flatFee) ?? undefined,
              };
            });
            obj.firstUnit = String(i.firstUnit) ?? undefined;
            obj.lastUnit = i.lastUnit ? String(i.lastUnit) : undefined;
            return obj;
          }),
        };
      });

      setValue('step2', tiers);
    },
  });

  const updateMutation = useMutation({
    mutationFn: editPricingFee,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('updatePricingSuccess') });
      navigate(-1);
    },
    onError: () => {
      showToast({ type: 'error', summary: error('updatePricingFail') });
    },
  });

  const onSubmit = (data: PricingModelInterface) => {
    const step1 = data.step1;
    const step2 = data.step2;

    const newData = {
      id: id as string,
      planId: step1.plans,
      name: step1.name,
      VATIncluded: step1.vatIncluded,
      isContactUs: step1.isContactUs,
      feeCurrencies: step1.price.map((i) => ({ currencyCode: i.unit, amount: Number(i.value.replaceAll(',', '')) })),
      effectiveDateStart: parseDateLocalToUTC(new Date(step1.effectiveDate.from).toISOString()) as string,
      effectiveDateEnd: step1.effectiveDate.to
        ? (parseDateLocalToUTC(new Date(step1.effectiveDate.to).toISOString()) as string)
        : undefined,
      period: {
        periodType: step1.period,
        number: step1.periodNumber ? Number(step1.periodNumber.replaceAll(',', '')) : undefined,
        periodTypeValue: step1.periodTimeUnit,
      },
      billing: {
        trialType: step1.trialLength,
        autoRenew: step1.autoRenew,
        billingCycle: step1.billingCycle,
        number: step1.trialLengthNumber ? Number(step1.trialLengthNumber.replaceAll(',', '')) : undefined,
        trialTypeValue: step1.trialLengthTimeUnit,
      },
      feeServices: step2.map((item, index) => {
        return {
          serviceId: item.service.value,
          serviceName: item.service.name,
          chargeModel: item.chargeModel as ChargeModelEnum,
          unit: item.unit as string,
          periodType: item.period as PeriodTypeEnum,
          billingCycle: item.billingCycle as BillingCycleEnum,
          orderByIndex: index,
          tiers: item.tier.map((ite, idx) => {
            const newData = Object.keys(ite)
              .filter((val) => val !== 'firstUnit' && val !== 'lastUnit' && val !== 'name')
              .map((it) => {
                return {
                  currencyCode: it,
                  unitFee: ite[it].unitFeeAmount ? Number(ite[it].unitFeeAmount.replaceAll(',', '')) : undefined,
                  flatFee: ite[it].flatFeeAmount ? Number(ite[it].flatFeeAmount.replaceAll(',', '')) : undefined,
                };
              });

            return {
              index: idx,
              firstUnit: ite.firstUnit ? Number(ite.firstUnit.replaceAll(',', '')) : undefined,
              lastUnit: ite.lastUnit ? Number(ite.lastUnit.replaceAll(',', '')) : undefined,
              tierUnit: item.unitTier,
              tierCurrencies: newData,
            };
          }),
        };
      }),
    };

    updateMutation.mutate(newData);
  };

  return (
    <LayoutSection
      label={
        <button className="flex items-center" onClick={() => navigate(-1)}>
          <SvgIcon icon="arrow-left" width={20} height={20} className="text-ic-ink-6s" />
          <Typography variant="16M" className="ml-1">
            {common('configuration.pricingModel')}
          </Typography>
        </button>
      }
      right={
        <div className="flex gap-2">
          <Button className="w-20" loading={updateMutation.isLoading} onClick={handleSubmit(onSubmit)}>
            {common('save')}
          </Button>
        </div>
      }
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1200px] bg-ic-white-6s rounded-lg border border-ic-ink-2s p-4">
          <div className="border-b border-ic-ink-2s w-full">
            {[
              { label: common('information'), value: 1 },
              { label: common('pricingModel'), value: 2 },
            ].map((o) => {
              return (
                <button
                  key={o.value}
                  className={clsx('py-3 px-4 text-sm font-normal text-ic-ink-6s', {
                    'text-ic-primary-6s font-medium border-b-2 border-ic-primary-6s': o.value === step,
                  })}
                  onClick={() => setStep(o.value)}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <FormProvider {...methods}>
            <div className={clsx(step === 1 ? 'block' : 'hidden')}>
              <Step1CreateForm />
            </div>
            <div className={clsx(step === 2 ? 'block' : 'hidden')}>
              <Step2CreateForm currencies={currencies} />
            </div>
          </FormProvider>
        </div>
        <ModalCancelCreateService open={openModel} setOpen={setOpenModel} />
      </div>
    </LayoutSection>
  );
};

export default EditPricingModels;
