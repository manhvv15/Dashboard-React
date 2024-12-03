import { ChangeEvent } from 'react';

import { FormHelperText, InputNumber } from '@ichiba/ichiba-core-ui';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import { PricingModelInterface } from './schema/pricing-model';

interface Props {
  index: number;
}

export const ChoosePrice = ({ index }: Props) => {
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const {
    setValue,
    formState: { errors },
    watch,
    clearErrors,
  } = useFormContext<PricingModelInterface>();

  const handleChangePriceValue = (value: ChangeEvent<HTMLInputElement>) => {
    clearErrors(`step1.price.${index}.value`);
    setValue(`step1.price.${index}.value`, value.target.value.replaceAll(',', ''));
  };

  return (
    <div>
      <div className="flex items-center">
        <div className="w-full max-w-[300px]">
          <InputNumber
            placeholder="Input price"
            onChange={handleChangePriceValue}
            error={
              !!(errors.step1?.price ?? [])[index]?.value?.message ||
              !!(errors.step1?.price ?? [])[index]?.unit?.message
            }
            value={watch(`step1.price.${index}.value`)}
            hiddenClose
            icon={
              <span className="text-sm font-normal text-ic-ink-6s border-l border-ic-ink-2s pl-2">
                {watch(`step1.price.${index}.unit`)}
              </span>
            }
          />
        </div>
      </div>
      <FormHelperText error>
        {error(
          ((errors.step1?.price ?? [])[index]?.value?.message as string) ||
            ((errors.step1?.price ?? [])[index]?.unit?.message as string),
        )}
      </FormHelperText>
    </div>
  );
};
