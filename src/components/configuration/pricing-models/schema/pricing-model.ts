import * as yup from 'yup';

import {
  BillingCycleEnum,
  ChargeModelEnum,
  PeriodTypeEnum,
  PeriodTypeValueEnum,
  TrialTypeEnum,
  TrialTypeValueEnum,
} from '@/constants/enums/common';

interface ObjCustomer {
  [key: string]: {
    unitFeeAmount: string;
    flatFeeAmount: string;
  };
}

interface ObjFix {
  firstUnit?: string;
  lastUnit?: string;
  name?: string;
}

export interface PricingModelInterface {
  step1: {
    plans: string;
    effectiveDate: {
      from: string;
      to?: string;
    };
    name: string;
    period: PeriodTypeEnum;
    periodNumber?: string;
    periodTimeUnit?: PeriodTypeValueEnum;

    vatIncluded: boolean;
    isContactUs: boolean;
    price: { value: string; unit: string }[];
    choosePrice: string[];
    trialLength: TrialTypeEnum;
    trialLengthNumber?: string;
    trialLengthTimeUnit?: TrialTypeValueEnum;
    billingCycle: BillingCycleEnum;
    autoRenew: boolean;
  };
  step2: {
    service: {
      name: string;
      value: string;
    };
    chargeModel?: ChargeModelEnum;
    unit?: string;
    period?: PeriodTypeEnum;
    billingCycle?: BillingCycleEnum;
    unitTier?: string;
    tier: (ObjCustomer & ObjFix)[];
  }[];
}

const setFistUnit = (chargeModel: ChargeModelEnum) => {
  if (chargeModel === ChargeModelEnum.PerUnit) {
    return true;
  }
  return false;
};

const setLastUnit = (chargeModel: ChargeModelEnum, tiers: any, context: any) => {
  const pathError = context.path.match(/\d+/g);

  const lastIndex = pathError[2];

  const tierLength = tiers.length - 1;

  if (chargeModel === ChargeModelEnum.PerUnit) {
    return true;
  }

  if (tiers.length > 1 && lastIndex && lastIndex < tierLength) {
    const checkLastUnit =
      Number(tiers[Number(lastIndex)]?.firstUnit?.replaceAll(',', '')) >=
      Number(tiers[Number(lastIndex)]?.lastUnit?.replaceAll(',', ''));

    if (!tiers[Number(pathError[2])]?.lastUnit) {
      return context.createError({
        path: context.path,
        message: 'fieldRequired',
      });
    }
    if (checkLastUnit) {
      return context.createError({
        path: context.path,
        message: 'firstUnitLessThanLastUnit',
      });
    }
    return true;
  }

  return true;
};

const setUnitFeeAmount = (chargeModel: ChargeModelEnum, parent: any, value: string | undefined) => {
  if (chargeModel === ChargeModelEnum.Graduated || chargeModel === ChargeModelEnum.Volume) {
    return !!parent.flatFeeAmount || !!value;
  }

  if (chargeModel === ChargeModelEnum.PerUnit || chargeModel === ChargeModelEnum.Percentage) {
    return !!value;
  }

  return true;
};

const setFlatFeeAmount = (chargeModel: ChargeModelEnum, parent: any, value: string | undefined) => {
  if (chargeModel === ChargeModelEnum.Graduated || chargeModel === ChargeModelEnum.Volume) {
    return !!parent.unitFeeAmount || (!!value && !parent.unitFeeAmount);
  }

  if (chargeModel === ChargeModelEnum.Fixed) {
    return !!value;
  }

  if (chargeModel === ChargeModelEnum.PerUnit || chargeModel === ChargeModelEnum.Percentage) {
    return true;
  }

  return !!value;
};

const tiers = (currencies: string[]) => {
  const market = {} as any;

  currencies.forEach((item) => {
    const dd = {} as any;
    dd.unitFeeAmount = yup.string().test('required', 'required', (unitFeeAmount, ctx: any) => {
      const { parent } = ctx;
      const { chargeModel } = ctx.from[2].value;

      return setUnitFeeAmount(chargeModel, parent, unitFeeAmount);
    });

    dd.flatFeeAmount = yup.string().test('required', 'required', (flatFeeAmount, ctx: any) => {
      const { parent } = ctx;
      const { chargeModel } = ctx.from[2].value;

      return setFlatFeeAmount(chargeModel, parent, flatFeeAmount);
    });
    market[item] = yup.object().shape(dd);
  });

  market.firstUnit = yup.string().test('required', 'required', (value, context: any) => {
    const { chargeModel } = context.from[1].value;

    return setFistUnit(Number(chargeModel)) || !!value;
  });

  market.lastUnit = yup.string().test('required', 'required', (_value, context: any) => {
    const { chargeModel } = context.from[1].value;

    const { tier } = context.from[1].value;

    return setLastUnit(Number(chargeModel), tier, context);
  });

  market.name = yup.string().nullable();

  return market;
};

export const pricingModelSchema = (currencies: string[]) => {
  return yup
    .object()
    .shape(
      {
        step1: yup.object().shape({
          plans: yup.string().required('fieldRequired'),
          effectiveDate: yup
            .object({
              from: yup.string().required('fieldRequired'),
              to: yup.string().notRequired().nullable(),
            })
            .required('fieldRequired'),
          // name: yup.string().required('fieldRequired'),

          period: yup.string().required('fieldRequired'),
          periodNumber: yup.string().when('period', (period) => {
            if (Number(period) === PeriodTypeEnum.Customize) {
              return yup.string().required('fieldRequired');
            }
            return yup.string().notRequired();
          }),
          periodTimeUnit: yup.number().when('period', (period) => {
            if (Number(period) === PeriodTypeEnum.Customize) {
              return yup.number().required('fieldRequired');
            }
            return yup.number().notRequired();
          }),
          vatIncluded: yup.boolean(),
          isContactUs: yup.boolean(),
          price: yup.array().of(
            yup
              .object()
              .shape({
                value: yup.string().required('fieldRequired'),
                unit: yup.string().required('fieldRequired'),
              })
              .required('fieldRequired'),
          ),
          choosePrice: yup.array(),
          trialLength: yup.number().required('fieldRequired'),
          trialLengthNumber: yup.string().when('trialLength', (period) => {
            if (Number(period) === TrialTypeEnum.Customize) {
              return yup.string().required('fieldRequired');
            }
            return yup.string().notRequired();
          }),
          trialLengthTimeUnit: yup.number().when('trialLength', (period) => {
            if (Number(period) === TrialTypeEnum.Customize) {
              return yup.number().required('fieldRequired');
            }
            return yup.number().notRequired();
          }),
          billingCycle: yup.number().required('fieldRequired'),
          autoRenew: yup.boolean(),
        }),
        step2: yup.array().of(
          yup.object().shape({
            service: yup.object().shape({
              name: yup.string().nullable().notRequired(),
              value: yup.string().required('fieldRequired'),
            }),
            chargeModel: yup.number().required('fieldRequired'),
            unit: yup.string().required('fieldRequired'),
            period: yup.number().required('fieldRequired'),
            billingCycle: yup.number().required('fieldRequired'),
            unitTier: yup.string().nullable().notRequired(),
            tier: yup.array().of(yup.object().shape(tiers(currencies))),
          }),
        ),
      },
      [
        ['period', 'periodNumber'],
        ['period', 'periodTimeUnit'],
        ['trialLength', 'trialLengthNumber'],
        ['trialLength', 'trialLengthTimeUnit'],
      ],
    )
    .required();
};
