import { Dispatch, SetStateAction } from 'react';

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  TBody,
  THead,
  Table,
  Td,
  Th,
  Tr,
} from '@ichiba/ichiba-core-ui';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { ChargeModelEnum, LocaleNamespace } from '@/constants/enums/common';
import { CurrentUsageDataByPlanItem } from '@/types/user-management/workspace';
import { formatNumber } from '@/utils/common';

interface Props {
  data: CurrentUsageDataByPlanItem | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalServiceModelDetail = ({ data, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const isShowColumnTier = () => {
    if (
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Fixed ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Percentage ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Graduated ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Volume
    )
      return true;
    return false;
  };
  const isShowColumnFirstUnit = () => {
    if (
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Fixed ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Percentage ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Graduated ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Volume
    )
      return true;
    return false;
  };
  const isShowColumnLastUnit = () => {
    if (
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Fixed ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Percentage ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Graduated ||
      data?.calculatorResult?.chargeModel == ChargeModelEnum.Volume
    )
      return true;
    return false;
  };

  return (
    <Dialog size="lg" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">
          {common('serviceDetail')}: {data?.name}
        </p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm font-normal">
          {common('changreModel')}: {data?.calculatorResult?.chargeModelName}
        </p>
        <div className="my-4">
          <Table className="table">
            <THead className="w-full table table-fixed ">
              <Tr className="h-full">
                {isShowColumnTier() && <Th className="text-center h-10"></Th>}
                {isShowColumnFirstUnit() && <Th className="text-right h-10">{common('firstUnit')}</Th>}
                {isShowColumnLastUnit() && <Th className="text-right h-10">{common('lastUnit')}</Th>}
                <Th className="text-right h-10">{common('unitFee')}</Th>
                <Th className="text-right h-10">{common('flatFee')}</Th>
              </Tr>
            </THead>
            {!!data?.calculatorResult?.tiers && !!data?.calculatorResult?.tiers.length && (
              <TBody className="max-h-[470px] block w-full overflow-y-auto h-full">
                {data?.calculatorResult?.tiers?.map((item, index) => {
                  return (
                    <Tr className={clsx(` table-fixed table w-full`)} borderBottom key={index}>
                      {isShowColumnTier() && <Td className="font-normal text-center"> tier {index + 1}</Td>}{' '}
                      {isShowColumnFirstUnit() && (
                        <Td className="font-normal text-right">
                          {formatNumber(item.firstUnit ?? 0)} {item.unit}
                        </Td>
                      )}{' '}
                      {isShowColumnLastUnit() && (
                        <Td className="font-normal text-right">
                          {formatNumber(item.lastUnit ?? 0)}
                          {item.unit}
                        </Td>
                      )}
                      <Td className="font-normal text-right">
                        {item.unitFee} {item.currencyCode}
                      </Td>
                      <Td className="font-normal text-right">
                        {item.flatFee} {item.currencyCode}
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            )}
          </Table>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('close')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalServiceModelDetail;
