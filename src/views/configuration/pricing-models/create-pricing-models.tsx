import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stepper, Typography } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { flushSync } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
import { createPricing } from '@/services/configuration';
import { parseDateLocalToUTC } from '@/utils/common';

const CreatePricingModels = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

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

  const { trigger, watch, handleSubmit } = methods;

  const createMutation = useMutation({
    mutationFn: createPricing,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('createPricingSuccess') });
      navigate(-1);
    },
    onError: () => {
      showToast({ type: 'error', summary: error('createPricingFail') });
    },
  });

  const handleSubmitStep1 = async () => {
    const check = await trigger('step1');
    if (check) {
      flushSync(() => {
        setCurrencies(watch('step1.price').map((i) => i.unit));
      });
      setStep(2);
    }
  };

  const onSubmit = (data: PricingModelInterface) => {
    const step1 = data.step1;
    const step2 = data.step2;

    const newData = {
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

    createMutation.mutate(newData);
  };

  const handleBackToStep1 = () => {
    setStep(1);
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
          {step === 1 ? (
            <>
              <Button className="w-20" onClick={handleSubmitStep1}>
                {common('next')}
              </Button>
            </>
          ) : (
            <>
              <Button className="w-20" variant="outlined" onClick={handleBackToStep1}>
                {common('back')}
              </Button>
              <Button className="w-20" loading={createMutation.isLoading} onClick={handleSubmit(onSubmit)}>
                {common('save')}
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1200px] bg-ic-white-6s rounded-lg border border-ic-ink-2s p-4">
          <div className="px-4 py-2 bg-ic-light flex items-center gap-2">
            <div className="flex-1 space-y-2">
              <Typography variant="18M">{common('createAPricingModel')}</Typography>
            </div>
            <div className="flex-1">
              <Stepper
                activeIndex={step - 1}
                items={[
                  {
                    description: (
                      <Typography variant="14R" className="text-ic-ink-5s">
                        {common('information')}
                      </Typography>
                    ),
                    placeholder: '',
                  },
                  {
                    description: (
                      <Typography variant="14R" className="text-ic-ink-5s">
                        {common('pricingModel')}
                      </Typography>
                    ),
                    placeholder: '',
                  },
                ]}
                className="z-50"
              />
            </div>
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

export default CreatePricingModels;
