import { Button, SelectPortal } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { getServiceModels } from '@/services/configuration';

import { ChooseServiceModel } from './ChooseServiceUnit';
import CheckModelUnit from './formChargeModel/CheckModelUnit';
import { PricingModelInterface } from './schema/pricing-model';

interface Props {
  currencies: string[];
}

export const Step2CreateForm = ({ currencies }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const { setValue, control, watch, trigger } = useFormContext<PricingModelInterface>();

  const { fields, append, remove } = useFieldArray({ control: control, name: 'step2' });

  const listServiceModel =
    useQuery({
      queryKey: ['getServiceModels'],
      queryFn: () => getServiceModels({ pageSize: 100 }),
    }).data?.data.items.map((i) => ({ label: i.name, value: i.id, unit: i.unit })) ?? [];

  const handleAddService = async () => {
    const check = await trigger(`step2.${watch('step2').length - 1}`);
    if (!check) {
      return;
    }
    const priceAppend = {} as any;
    currencies.forEach((mk) => {
      priceAppend[mk] = {
        unitFeeAmount: '',
        flatFeeAmount: '',
      };
    });
    priceAppend.firstUnit = '0';
    priceAppend.lastUnit = '';
    append({
      service: { name: '', value: '' },
      chargeModel: undefined,
      period: undefined,
      unit: undefined,
      tier: [priceAppend],
    });
  };

  const handleChangeService = (data: { value: string; label: string; unit: string }, index: number) => {
    setValue(`step2.${index}.service.name`, data.label);
    setValue(`step2.${index}.service.value`, data.value);
    setValue(`step2.${index}.unit`, data.unit);
  };

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      {fields.map((item, index) => {
        const onService = (_value: string, option: { value: string; label: string; unit: string }) => {
          handleChangeService(option, index);
        };

        return (
          <div className="border border-ic-ink-2s rounded-lg p-4" key={item.id}>
            {!watch(`step2.${index}.service.value`) ? (
              <div className="flex items-center justify-between w-full">
                <div className="w-full">
                  <SelectPortal onChange={onService} options={listServiceModel} placeholder="Choose a service" />
                </div>
                <button
                  className="ml-4 "
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <SvgIcon icon="delete" width={20} height={20} className="text-ic-red-6s" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-ic-ink-6s">{watch(`step2.${index}.service.name`)}</p>
                  <button
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <SvgIcon icon="delete" width={20} height={20} className="text-ic-red-6s" />
                  </button>
                </div>
                <ChooseServiceModel index={index} />
                <div className="mt-2">
                  {watch(`step2.${index}.chargeModel`) !== undefined &&
                    watch(`step2.${index}.unit`) !== undefined &&
                    watch(`step2.${index}.period`) !== undefined && <CheckModelUnit stt={index} />}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div>
        <Button onClick={handleAddService}>
          <SvgIcon icon="plus" width={20} height={20} />
          {common('addService')}
        </Button>
      </div>
    </div>
  );
};
