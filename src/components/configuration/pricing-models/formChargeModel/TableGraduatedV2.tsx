import clsx from 'clsx';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';

import ListPriceMarketTierOption3 from './ListPriceMarketTierOption3';

import { showError } from '../lib';
import { PricingModelInterface } from '../schema/pricing-model';

interface Props {
  stt: number;
}

export default function TableGraduatedV2({ stt }: Props) {
  const {
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
    getValues,
  } = useFormContext<PricingModelInterface>();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const prices = watch(`step1.price`).map((i) => i.unit);

  const { fields, remove, append } = useFieldArray({
    control,
    name: `step2.${stt}.tier`,
  });

  const errorPrice = errors.step2?.[stt]?.tier as any;

  const onRemoveRow = (index: number) => {
    remove(index);
    const priceLength = watch(`step2.${stt}.tier`);
    if (index > 0 && index <= priceLength.length - 1) {
      const price = watch(`step2.${stt}.tier.${index}`);
      price.firstUnit = watch(`step2.${stt}.tier.${index - 1}`).lastUnit;
      setValue(`step2.${stt}.tier.${index}`, price);
    }
  };

  const onAppend = async () => {
    const checkError = await trigger(`step2.${stt}.tier`);
    if (checkError) {
      const priceAppend = {} as any;
      prices.forEach((shipping) => {
        priceAppend[shipping] = {
          unitFeeAmount: '',
          flatFeeAmount: '',
        };
      });
      priceAppend.firstUnit = '0';
      priceAppend.lastUnit = '';

      append(priceAppend);
      setValue(
        `step2.${stt}.tier.${fields.length}.firstUnit`,
        getValues(`step2.${stt}.tier.${fields.length - 1}.lastUnit`),
      );
    }
  };

  return (
    <div>
      <div className="scroll border border-ic-ink-2s rounded-lg bg-white w-full overflow-x-auto overflow-hidden">
        <table className=" w-full">
          <thead className=" border-b border-ic-ink-2s ">
            <tr>
              <th
                className="py-2 border-x border-ic-ink-2s text-sm font-medium leading-5 text-ic-ink-6s "
                align="center"
                colSpan={1}
                rowSpan={2}
              ></th>
              <th
                className="py-2 border-x border-ic-ink-2s text-sm font-medium leading-5 text-ic-ink-6s "
                align="center"
                colSpan={1}
                rowSpan={2}
              >
                {common('firstUnit')}
              </th>
              <th
                className="py-2 border-x border-ic-ink-2s text-sm font-medium leading-5 text-ic-ink-6s "
                align="center"
                colSpan={1}
                rowSpan={2}
              >
                {common('lastUnit')}
              </th>
            </tr>
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
              const onAction = () => {
                onRemoveRow(index);
              };
              return (
                <tr className="p-2 border-x border-ic-ink-2s" key={field.id}>
                  <ListPriceMarketTierOption3 fields={fields} packageIndex={stt} column={index} />
                  <td align="center" className="p-2 border-x border-ic-ink-2s min-w-[64px]">
                    <button type="button" className={clsx(index === 0 && 'pointer-events-none')} onClick={onAction}>
                      <SvgIcon
                        icon="trash-delete-bin-2"
                        width={24}
                        height={24}
                        className={fields.length === 1 ? 'text-ic-red-4s' : 'text-ic-red-6s'}
                      />
                    </button>
                  </td>
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
      <button type="button" onClick={onAppend} className="flex items-center mt-4">
        <SvgIcon icon="plus" width={24} height={24} className="text-ic-primary-6s" />
        <p className="ml-1 text-sm font-medium text-ic-primary-6s leading-5">{common('addAnotherTier')}</p>
      </button>
    </div>
  );
}
