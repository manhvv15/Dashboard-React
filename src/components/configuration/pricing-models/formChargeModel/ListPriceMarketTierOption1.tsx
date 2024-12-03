import React, { useEffect } from 'react';

import { InputNumber } from '@ichiba/ichiba-core-ui';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ChargeModelEnum, LocaleNamespace } from '@/constants/enums/common';

import { formatNumber } from '@/utils/common';
import { PricingModelInterface } from '../schema/pricing-model';

interface Prop {
  column: number;
  packageIndex: number;
  fields: any[];
}

export default function ListPriceMarketTierOption1({ column, packageIndex, fields }: Prop) {
  const {
    getValues,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useFormContext<PricingModelInterface>();
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const chargeModel = getValues(`step2.${packageIndex}.chargeModel`);
  const prices = watch(`step1.price`).map((i) => i.unit);

  useEffect(() => {
    if (getValues(`step2.${packageIndex}.tier`).length > 0) {
      if (chargeModel === ChargeModelEnum.Graduated) {
        const data = column === 0 ? 'The first' : `The next`;
        setValue(`step2.${packageIndex}.tier.${column}.name`, data as never);
      } else {
        setValue(`step2.${packageIndex}.tier.${column}.name`, `Tier ${column + 1}` as never);
      }
    }
  }, [column, getValues(`step2.${packageIndex}.tier`)]);

  const formatPrice = ((getValues(`step2.${packageIndex}.tier.${column}.firstUnit`) ?? '') as string)?.replaceAll(
    ',',
    '',
  );

  return (
    <React.Fragment>
      <td className="p-2 border-x border-ic-ink-2s min-w-[64px]">
        <span className="whitespace-nowrap text-sm font-normal leading-5 text-ic-ink-6s">{`${common(
          'tier',
        )} ${column + 1}`}</span>
      </td>
      <td className="p-2 border-x border-ic-ink-2s min-w-[96px]">
        <span
          title={`${formatNumber(Number(formatPrice))}`}
          className="whitespace-nowrap text-sm font-normal leading-5 text-ic-ink-6s truncate"
        >{`${formatNumber(Number(formatPrice))} ${column > 0 ? '+' : ''}`}</span>
      </td>

      <td className="p-2 border-x border-ic-ink-2s min-w-[112px]">
        <InputNumber
          hiddenClose
          min={0}
          fractionDigits={false}
          title={getValues(`step2.${packageIndex}.tier.${column}.lastUnit`)}
          defaultValue={watch(`step2.${packageIndex}.tier.${column}.lastUnit`)}
          placeholder={common('enter')}
          onChange={(e) => {
            const value = e.target.value as never;
            clearErrors(`step2.${packageIndex}.tier.${column}.lastUnit`);
            setValue(`step2.${packageIndex}.tier.${column}.lastUnit`, value);
            if (column + 1 < fields.length) {
              setValue(`step2.${packageIndex}.tier.${column + 1}.firstUnit`, value);
            }
          }}
          error={!!(errors?.step2?.[packageIndex] as any)?.tier?.[column]?.lastUnit?.message}
        />
      </td>
      {prices.map((item) => {
        return (
          <>
            <td className="p-2 border-x border-ic-ink-2s min-w-[200px]" key={item}>
              <InputNumber
                hiddenClose
                placeholder={common('unitFee')}
                onChange={(e) => {
                  const value = e.target.value as never;
                  clearErrors(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`);
                  setValue(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`, value);
                }}
                defaultValue={getValues(`step2.${packageIndex}.tier.${column}.${item}.unitFeeAmount`)}
                error={!!(errors?.step2?.[packageIndex] as any)?.tier?.[column]?.[item]?.unitFeeAmount?.message}
                icon={<p className="text-base font-normal leading-3 text-ic-ink-6s ml-2">%</p>}
              />
            </td>
            <td className="p-2 border-x border-ic-ink-2s min-w-[200px]" key={item}>
              <InputNumber
                hiddenClose
                icon={<p className="text-sm font-medium text-ic-ink-6s">{item}</p>}
                placeholder={common('flatFee')}
                onChange={(e) => {
                  const value = e.target.value as never;
                  clearErrors(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`);
                  setValue(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`, value);
                }}
                defaultValue={watch(`step2.${packageIndex}.tier.${column}.${item}.flatFeeAmount`)}
                error={!!(errors?.step2?.[packageIndex] as any)?.tier?.[column]?.[item]?.flatFeeAmount?.message}
              />
            </td>
          </>
        );
      })}
    </React.Fragment>
  );
}
