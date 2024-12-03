import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import ListPriceMarketTierOption2 from './ListPriceMarketTierOption2';

import { showError } from '../lib';
import { PricingModelInterface } from '../schema/pricing-model';

interface Props {
  stt: number;
}

export default function TableGraduated({ stt }: Props) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<PricingModelInterface>();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const prices = watch(`step1.price`).map((i) => i.unit);

  const { fields } = useFieldArray({
    control,
    name: `step2.${stt}.tier`,
  });

  const errorPrice = errors.step2?.[stt]?.tier as any;

  return (
    <div>
      <div className="scroll border border-ic-ink-2s rounded-lg bg-ic-white-6s w-full overflow-x-auto overflow-hidden">
        <table className=" w-full">
          <thead className=" border-b border-ic-ink-2s ">
            <tr>
              {prices.map((item) => {
                return (
                  <>
                    <th
                      key={item}
                      className="py-2 border-x border-ic-ink-2s text-sm font-medium leading-5 text-ic-ink-6s "
                    >
                      {common('unitFee')}
                    </th>
                    <th
                      key={item}
                      className="py-2 border-x border-ic-ink-2s text-sm font-medium leading-5 text-ic-ink-6s "
                    >
                      {common('flatFee')}
                    </th>
                  </>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              return (
                <tr className="p-2 border-x border-ic-ink-2s" key={field.id}>
                  <ListPriceMarketTierOption2 packageIndex={stt} column={index} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showError(errorPrice).length > 0 && (
        <p className="mt-3 text-sm font-normal leading-5 text-ic-red-6s ml-4">
          {showError(errorPrice).map((i) => (
            <p key={i}>{error(i)}</p>
          ))}
        </p>
      )}
    </div>
  );
}
