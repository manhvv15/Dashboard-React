import React from 'react';

import { InputNumber } from '@ichiba/ichiba-core-ui';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ChargeModelEnum, LocaleNamespace } from '@/constants/enums/common';

import { PricingModelInterface } from '../schema/pricing-model';

interface Prop {
  column: number;
  packageIndex: number;
}

export default function ListPriceMarketNotTier({ column, packageIndex }: Prop) {
  const {
    setValue,
    getValues,
    formState: { errors },
    watch,
    clearErrors,
  } = useFormContext<PricingModelInterface>();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const chargeModel = watch(`step2.${packageIndex}.chargeModel`);
  const prices = watch(`step1.price`).map((i) => i.unit);

  return (
    <React.Fragment>
      {prices.map((item) => {
        const checkMessage =
          chargeModel === ChargeModelEnum.PerUnit
            ? (errors?.step2?.[packageIndex] as any)?.tier?.[column]?.[item]?.unitFeeAmount?.message
            : (errors?.step2?.[packageIndex] as any)?.tier?.[column]?.[item]?.flatFeeAmount?.message;
        return (
          <td className="p-2 border-x border-ic-ink-2s" key={item}>
            <InputNumber
              hiddenClose
              fractionDigits={false}
              placeholder={chargeModel === ChargeModelEnum.PerUnit ? common('unitFee') : common('flatFee')}
              icon={<p className="text-sm font-medium text-ic-ink-6s">{item}</p>}
              onChange={(e) => {
                const value = e.target.value as never;
                if (chargeModel === ChargeModelEnum.PerUnit) {
                  clearErrors(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`);
                  setValue(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`, value);
                  return;
                }
                clearErrors(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`);
                setValue(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`, value);
              }}
              defaultValue={getValues(
                chargeModel === ChargeModelEnum.PerUnit
                  ? `step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`
                  : `step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`,
              )}
              error={!!checkMessage}
            />
          </td>
        );
      })}
    </React.Fragment>
  );
}
