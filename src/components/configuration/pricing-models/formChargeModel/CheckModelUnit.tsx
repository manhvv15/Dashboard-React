import { useFormContext } from 'react-hook-form';

import { ChargeModelEnum } from '@/constants/enums/common';

import TableGraduatedV2 from './TableGraduatedV2';
import TableMedium from './TableMedium';
import TablePercentage from './TablePercentage';
import TableStandard from './TableStandard';

import { PricingModelInterface } from '../schema/pricing-model';

interface Props {
  stt: number;
}

export default function CheckModelUnit({ stt }: Props) {
  const { watch } = useFormContext<PricingModelInterface>();

  const chargeModel = watch(`step2.${stt}.chargeModel`);

  return (
    <div className="mt-4 w-full">
      {chargeModel === ChargeModelEnum.PerUnit && <TableStandard stt={stt} />}

      {chargeModel === ChargeModelEnum.Fixed && <TableMedium stt={stt} />}

      {chargeModel === ChargeModelEnum.Percentage && <TablePercentage stt={stt} />}

      {chargeModel === ChargeModelEnum.Graduated && <TableGraduatedV2 stt={stt} />}

      {chargeModel === ChargeModelEnum.Volume && <TableGraduatedV2 stt={stt} />}
    </div>
  );
}
