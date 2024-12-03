import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { CARRIER_ID } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { addOnShippingFeeSettings, getDetailCourierDetail } from '@/services/ship4p/carrier-system';
import { AddOnTypeEnum } from '@/types/enums/carrier';
import { AddOnShippingSettingRequest, GetCouriersResponse, ICarrierDetail } from '@/types/ship4p/carrier';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  InputNumber,
  LoadingOverlay,
} from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
interface props {
  courierSystemId: string;
  visible: boolean;
  listCarrierOwn: GetCouriersResponse[] | undefined;
  onClose: () => void;
}
const AddOnShippingFeeSetting = ({ courierSystemId, visible, onClose, listCarrierOwn }: props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { t: tShip4p } = useTranslation(LocaleNamespace.Ship4p);
  const [currencyByCourier, setCurrencyByCourier] = useState<string>('');
  const { showToast } = useApp();
  const schema = yup.object().shape({
    id: yup.string().required(error('required')),
    addOnAmount: yup.number().required(error('required')),
  });
  const {
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm<AddOnShippingSettingRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      addOnType: AddOnTypeEnum.Amount,
    },
    mode: 'onBlur',
  });
  const [courierSystem, setCourierSystem] = useState<ICarrierDetail>({} as ICarrierDetail);
  const { isLoading } = useQuery({
    queryKey: ['getDetailCourierSystem', courierSystemId],
    queryFn: () =>
      getDetailCourierDetail({
        id: courierSystemId,
      }),
    onSuccess: (res) => {
      setCourierSystem(res.data);
    },
    enabled: visible && !!courierSystemId,
  });
  const onHandleClose = () => {
    onClose();
  };
  useEffect(() => {
    if (courierSystem && listCarrierOwn) {
      setValue('id', courierSystem.id ?? '');
      setValue('addOnAmount', courierSystem.addOnAmount ?? 0);
      if (courierSystem.addOnType) {
        setValue('addOnType', courierSystem.addOnType);
      }
      const carrier = (listCarrierOwn || []).find((e) => e.code === courierSystem.courierId);
      setCurrencyByCourier(carrier?.currency ?? '');
    }
  }, [courierSystem, listCarrierOwn]);
  const onChangeAddOnAmount = (value: React.ChangeEvent<HTMLInputElement>) => {
    const val = value.currentTarget.value;
    var amountAddOn = val.replaceAll(',', '');
    setValue('addOnAmount', Number(amountAddOn));
  };
  const addOnShippingFeeSetting = useMutation({
    mutationFn: addOnShippingFeeSettings,
  });
  const onHandleSubmit = (data: AddOnShippingSettingRequest) => {
    addOnShippingFeeSetting.mutate(
      {
        id: data.id,
        addOnAmount: data.addOnAmount,
        addOnType: data.addOnType,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: tShip4p('config.addon.shipping.setting.success'),
          });
          onClose();
        },
        onError: () => {
          showToast({
            type: 'error',
            detail: error('export.error'),
          });
        },
      },
    );
  };
  const onClearAddOnAmount = () => {
    setValue('addOnAmount', 0);
  };
  const onChangeAddon = (value: AddOnTypeEnum) => {
    setValue('addOnType', value);
    setValue('addOnAmount', 0);
  };
  return (
    <Dialog open={visible} size="sm" handler={onClose} className="!min-w-[1000px]' : '!min-w-[1000px]">
      <DialogHeader>
        <div className="flex justify-between w-full items-center">
          <span>{tShip4p('addOn.shippingFee.Title')}</span>
          <SvgIcon onClick={onHandleClose} icon="close" className="cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody>
        <LoadingOverlay className="flex flex-col w-full" isLoading={isLoading}>
          <div className="flex flex-col gap-2">
            <div className="flex px-0.5 py-2 flex-row gap-3">
              <div>
                {courierSystem.logoUrl ? (
                  <img src={courierSystem.logoUrl} height={48} width={48} />
                ) : (
                  <SvgIcon icon="carrier-default" height={48} width={48} />
                )}
              </div>
              <div className="text-sm text-ic-ink-6s flex flex-col gap-2">
                <span className="font-medium">
                  {courierSystem.courierId === CARRIER_ID.SHIPPOUSPS ? CARRIER_ID.USPS : courierSystem.courierId}
                </span>
                <span>{courierSystem.accountId}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-between text-ic-ink-6s items-center">
                <span className="text-sm">{tShip4p('addOn.shippingFee.model.title')}</span>
                <div className="flex gap-1">
                  {
                    <span
                      onClick={() => onChangeAddon(AddOnTypeEnum.Amount)}
                      className={clsx(
                        'py-1 px-2 rounded-lg text-sm',
                        watch('addOnType') === AddOnTypeEnum.Amount
                          ? 'border border-ic-primary-6s text-ic-primary-6s'
                          : 'border border-ic-ink-3s text-ic-ink-3s hover:text-ic-ink-3s hover:bg-ic-ink-1s transition ease-in-out  cursor-pointer',
                      )}
                    >
                      {courierSystem.currency ?? currencyByCourier}
                    </span>
                  }
                  <span
                    onClick={() => onChangeAddon(AddOnTypeEnum.Percentage)}
                    className={clsx(
                      'py-1 px-2  text-sm rounded-lg',
                      watch('addOnType') === AddOnTypeEnum.Percentage
                        ? 'border border-ic-primary-6s text-ic-primary-6s'
                        : 'border border-ic-ink-3s cursor-pointer hover:text-ic-ink-3s hover:bg-ic-ink-1s transition ease-in-out text-ic-ink-2s',
                    )}
                  >{`%`}</span>
                </div>
              </div>
              <div>
                <InputNumber
                  onClearData={onClearAddOnAmount}
                  hiddenClose={!watch('addOnAmount')}
                  value={watch('addOnAmount')}
                  onChange={onChangeAddOnAmount}
                  error={!!errors.addOnAmount?.message}
                />
                <FormHelperText error={!!errors.addOnAmount?.message}>{errors.addOnAmount?.message}</FormHelperText>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </DialogBody>
      <DialogFooter>
        <div className="flex items-center justify-end">
          <Button
            type="button"
            size="40"
            color="primary"
            variant="outlined"
            className=" w-[160px] mr-4 rounded-lg py-2 px-4 justify-center text-sm font-normal leading-6"
            onClick={onHandleClose}
          >
            {common('button.cancel')}
          </Button>
          <Button
            type="button"
            size="40"
            color="primary"
            variant="filled"
            disabled={addOnShippingFeeSetting.isLoading}
            loading={addOnShippingFeeSetting.isLoading}
            className="w-[160px] rounded-lg py-2 px-4 justify-center text-sm font-normal leading-6"
            onClick={handleSubmit(onHandleSubmit)}
          >
            {common('confirm')}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
export default AddOnShippingFeeSetting;
