import {
  BillingCycleEnum,
  ChargeModelEnum,
  PeriodTypeEnum,
  TrialTypeEnum,
  TrialTypeValueEnum,
  UnitServiceModelEnum,
} from '@/constants/enums/common';

export const periodList = [
  // {
  //   label: 'Weekly',
  //   value: PeriodTypeEnum.Weekly,
  // },
  {
    label: 'Monthly',
    value: PeriodTypeEnum.Monthly,
  },
  // {
  //   label: 'Quarterly',
  //   value: PeriodTypeEnum.Quarterly,
  // },
  {
    label: 'Yearly',
    value: PeriodTypeEnum.Yearly,
  },
  // {
  //   label: 'Customize',
  //   value: PeriodTypeEnum.Customize,
  // },
];

export const periodValueList = [
  {
    label: 'Days',
    value: TrialTypeValueEnum.Days,
  },
  {
    label: 'Weeks',
    value: TrialTypeValueEnum.Weeks,
  },

  {
    label: 'Months',
    value: TrialTypeValueEnum.Months,
  },
  {
    label: 'Quarters',
    value: TrialTypeValueEnum.Quarters,
  },
  {
    label: 'Years',
    value: TrialTypeValueEnum.Years,
  },
];

export const trialLengthList = [
  {
    label: 'NoTrial',
    value: TrialTypeEnum.NoTrial,
  },
  {
    label: 'Weekly',
    value: TrialTypeEnum.Weekly,
  },
  {
    label: 'Monthly',
    value: TrialTypeEnum.Monthly,
  },
  {
    label: 'Quarterly',
    value: TrialTypeEnum.Quarterly,
  },
  {
    label: 'Yearly',
    value: TrialTypeEnum.Yearly,
  },
  {
    label: 'Customize',
    value: TrialTypeEnum.Customize,
  },
];

export const billingList = [
  {
    label: 'Start',
    value: BillingCycleEnum.Start,
  },
  {
    label: 'End',
    value: BillingCycleEnum.End,
  },
];

export const chargeModelList = [
  {
    label: 'Per unit',
    value: ChargeModelEnum.PerUnit,
  },
  {
    label: 'Fixed',
    value: ChargeModelEnum.Fixed,
  },
  {
    label: 'Percentage',
    value: ChargeModelEnum.Percentage,
  },
  {
    label: 'Graduated',
    value: ChargeModelEnum.Graduated,
  },
  {
    label: 'Volume',
    value: ChargeModelEnum.Volume,
  },
];

export const unitModelList = [
  {
    label: 'Weight',
    value: UnitServiceModelEnum.Weight,
  },
  {
    label: 'Package',
    value: UnitServiceModelEnum.Package,
  },
  {
    label: 'Package item',
    value: UnitServiceModelEnum.PackageItem,
  },
  {
    label: 'Package value',
    value: UnitServiceModelEnum.PackageValue,
  },
  {
    label: 'Shipment value',
    value: UnitServiceModelEnum.ShipmentValue,
  },
  {
    label: 'Shipment',
    value: UnitServiceModelEnum.Shipment,
  },
  {
    label: 'Order',
    value: UnitServiceModelEnum.Order,
  },
  {
    label: 'Order value',
    value: UnitServiceModelEnum.OrderValue,
  },
  {
    label: 'Order item',
    value: UnitServiceModelEnum.OrderItem,
  },
  {
    label: 'Package cod',
    value: UnitServiceModelEnum.PackageCod,
  },
];
