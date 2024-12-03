import React from 'react';

import { InputNumber } from '@ichiba/ichiba-core-ui';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import { PricingModelInterface } from '../schema/pricing-model';

interface Prop {
  column: number;
  packageIndex: number;
}

export default function ListPriceMarketTierOption2({ column, packageIndex }: Prop) {
  const {
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
    watch,
  } = useFormContext<PricingModelInterface>();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const prices = watch(`step1.price`).map((i) => i.unit);

  return (
    <React.Fragment>
      {prices.map((item) => {
        return (
          <>
            <td className="p-2 border-x border-ic-ink-2s min-w-[200px]" key={item}>
              <InputNumber
                icon={<p className="text-sm  font-medium text-ic-ink-6s">{item}</p>}
                hiddenClose
                fractionDigits={false}
                placeholder={common('unitFee')}
                onChange={(e) => {
                  const value = e.target.value as never;
                  clearErrors(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`);
                  setValue(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`, value);
                  if (value) {
                    clearErrors(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`);
                  }
                }}
                defaultValue={getValues(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`)}
                error={!!(errors?.step2?.[packageIndex] as any)?.tier?.[column]?.[item]?.unitFeeAmount?.message}
              />
            </td>
            <td className="p-2 border-x border-ic-ink-2s min-w-[200px]" key={item}>
              <InputNumber
                icon={<p className="text-sm  font-medium text-ic-ink-6s">{item}</p>}
                hiddenClose
                fractionDigits={false}
                placeholder={common('flatFee')}
                onChange={(e) => {
                  const value = e.target.value as never;
                  clearErrors(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`);
                  setValue(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`, value);
                  if (value) {
                    clearErrors(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`);
                  }
                }}
                defaultValue={getValues(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`)}
                error={!!(errors?.step2?.[packageIndex] as any)?.tier?.[column]?.[item]?.flatFeeAmount?.message}
              />
            </td>
          </>
        );
      })}
    </React.Fragment>
  );
}
