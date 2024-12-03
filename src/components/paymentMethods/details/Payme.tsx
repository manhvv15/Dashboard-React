import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, FormHelperText, Input, Switch, Textarea } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'usehooks-ts';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import {
  generateMerchantKeyAccount,
  getMerchantAccountPayme,
  updateMerchantAccountPayme,
  updateStatusMerchantAccount,
} from '@/services/payment-method';
import { PaymentMethodEnum } from '@/types/enums/payment';
import { MerchantAccountStatusEnum, MerchantAccountTypeEnum } from '@/types/payment-methods/enum';
import { responseErrorCode } from '@/utils/common';
import { showToast } from '@/utils/toasts';

import ModalConfirmGeneratePublicKey from '../dialogs/ModalConfirmGeneratePublicKey';
import ModalDeleteFromMyMethod from '../dialogs/ModalDeleteFromMyMethod';
import { CreateMerchantAccountPayme } from '../dialogs/ModalPayme';

const Payme = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const [open, setOpen] = useState(false);

  const copyApi = useCopyToClipboard()[1];
  const copyPublickey = useCopyToClipboard()[1];

  const [statusOfPayme, setStatusOfPayme] = useState<boolean>();
  const [openGeneralKey, setOpenGeneralKey] = useState<boolean>(false);

  const [enableGenerateMerchantKey, setEnableGenerateMerchantKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    setValue,
  } = useForm<CreateMerchantAccountPayme>({
    mode: 'onChange',
    resolver: yupResolver(
      yup
        .object()
        .shape({
          xapiClient: yup.string().required(common('thisFieldIsRequire')),
          publicKey: yup.string().required(common('thisFieldIsRequire')),
        })
        .required(),
    ),
  });

  const { refetch, isLoading: loadingData } = useQuery({
    queryKey: ['getMerchantAccountPayme'],
    queryFn: () => getMerchantAccountPayme(),
    onSuccess: (response) => {
      if (response.data) {
        setValue('name', response.data.name || '');
        setValue('xapiClient', response.data.xapiClient || '');
        setValue('privateKey', response.data.privateKey || '');
        setValue('publicKey', response.data.publicKey || '');
        setValue('payType', response.data?.payType?.split(',') || []);
        setValue('apiEndPoint', response.data.apiEndPoint);
        setValue('paymePublicKey', response.data.paymePublicKey);
        setStatusOfPayme(response.data.status === MerchantAccountStatusEnum.IntegrationSuccessfull);
      }
    },
    retry: (failureCount, res: any) => failureCount < 0 && res.status !== 400,
  });

  const { isInitialLoading: generateKeyLoading, isFetching: generateKeyFetching } = useQuery({
    queryKey: ['generateMerchantKeyAccount'],
    queryFn: generateMerchantKeyAccount,
    enabled: enableGenerateMerchantKey,
    onSuccess: (response) => {
      setValue('privateKey', response?.data?.privateKey || '');
      setValue('publicKey', response?.data?.publicKey || '');
      setValue('xapiClient', '');
      setValue('paymePublicKey', '');
      setEnableGenerateMerchantKey(false);
      setOpenGeneralKey(false);
      showToast({
        type: 'success',
        summary: common('payment.payme.generateMerchantKey.toast.success'),
      });
    },
    onError: (err: any) => {
      updateToastOnError(err);
    },
    retry: (failureCount, res: any) => failureCount < 0 && res.status !== 400,
    cacheTime: 0,
  });

  const updateMutation = useMutation({
    mutationFn: updateMerchantAccountPayme,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('updatePaymeSuccess'),
      });
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;

      if (errorFrom) {
        responseErrorCode(errorFrom).forEach(({ name, message, type }) => {
          const mess = err.t(message);
          setError(`paypal.${name}` as any, {
            type,
            message: mess,
          });
        });
        return;
      }
      showToast({
        type: 'error',
        summary: error(errorNormal),
      });
    },
  });

  const updateStatusMerchantAccountMutation = useMutation({
    mutationFn: updateStatusMerchantAccount,
    onSuccess: () => {
      refetch();
      showToast({
        type: 'success',
        summary: common('updateSuccess'),
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('updateFailed'),
      });
    },
  });

  const onUpdateStatusMerchantAccount = () => {
    updateStatusMerchantAccountMutation.mutate({
      isActive: !statusOfPayme,
      type: PaymentMethodEnum.Payme,
    });
  };

  const updateToastOnError = (err: any) => {
    if (err.errorFrom) {
      Object.values(err.errorFrom).forEach((val) => {
        showToast({ type: 'error', summary: error(val as string) });
      });
    }
    if (err.errorDescription) {
      showToast({ type: 'error', summary: err.errorDescription });
    }
    if (err.errorCode) {
      showToast({ type: 'error', summary: error(err.errorCode) });
    }
    if (err.errorNormal) {
      showToast({ type: 'error', summary: error(err.errorNormal) });
    }
  };

  const onSubmit = (data: CreateMerchantAccountPayme) => {
    updateMutation.mutate({
      countryCode: window.region as string,
      name: data.name.trim(),
      xapiClient: data.xapiClient.trim(),
      privateKey: data.privateKey.trim(),
      publicKey: data.publicKey.trim(),
      paymePublicKey: data.paymePublicKey.trim(),
      apiEndPoint: data.apiEndPoint.trim(),
      marketId: data.marketId,
      payType: data.payType,
      isActive: data.isActive,
    });
  };

  const handleOpenGeneralKey = () => {
    setOpenGeneralKey(true);
  };

  const onSubmitConfirmGenerateModal = () => {
    setEnableGenerateMerchantKey(true);
  };

  return (
    <div className="relative w-full h-full ">
      <div className="rounded-lg p-6 border border-ic-ink-2s w-full">
        <div className="flex items-center justify-between">
          <p className="text-lg font-normal leading-6 text-ic-ink-6s">{common('paymeConfiguration')}</p>
          <div className="flex items-center gap-x-2">
            <span className="text-base font-normal leading-6 text-ic-ink-6s">{common('activeStatus')}</span>
            <Switch onChange={onUpdateStatusMerchantAccount} checked={statusOfPayme} />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-y-4">
          <div className="mb-4">
            <p className="mb-2 text-lg font-medium leading-6">{common('payment.payme.active.form.step1')}</p>
            <span className="text-sm font-normal text-ic-ink-5s">{common('payment.payme.active.form.step1.des')}</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between">
              <label className="text-base font-normal text-ic-ink-6s">
                {`${common('payment.payme.active.form.step1.apiEndPoint')}:`}
              </label>
              <button onClick={() => copyApi(getValues('apiEndPoint'))}>
                <SvgIcon
                  icon="file-blank-copy"
                  width={20}
                  height={20}
                  className="text-ic-ink-6s active:mb-[2px] active:text-ic-primary-6s"
                />
              </button>
            </div>

            <Input
              disabled
              placeholder={common('payment.payme.active.form.step1.apiEndPoint')}
              required={true}
              hiddenClose
              {...register('apiEndPoint', { required: true })}
              feedbackInvalid={errors.apiEndPoint?.message}
            />
            {errors.apiEndPoint?.message && <FormHelperText error>{errors.apiEndPoint?.message}</FormHelperText>}
          </div>
          <div className="mb-4">
            <div className="flex justify-between">
              <label className="text-ic-ink-6s">{`${common('payment.payme.active.form.step1.merchantPublickey')}:`}</label>
              <div className="flex gap-x-3">
                <button onClick={handleOpenGeneralKey}>
                  <SvgIcon
                    icon="sim-refresh-update"
                    width={20}
                    height={20}
                    className="text-ic-ink-6s active:mb-[2px] active:text-ic-primary-6s"
                  />
                </button>
                <button className="" onClick={() => copyPublickey(getValues('publicKey'))}>
                  <SvgIcon
                    icon="file-blank-copy"
                    width={20}
                    height={20}
                    className="text-ic-ink-6s active:mb-[2px] active:text-ic-primary-6s"
                  />
                </button>
              </div>
            </div>

            <Textarea
              rows={5}
              disabled
              plainText
              placeholder={common('payment.payme.active.form.step1.merchantPublickey')}
              {...register('publicKey', { required: true })}
              feedbackInvalid={errors.publicKey?.message}
            />

            {errors.publicKey?.message && <FormHelperText error>{errors.publicKey?.message}</FormHelperText>}
          </div>
          <div className="mb-4">
            <p className="mb-2 text-lg font-medium leading-6">{common('payment.payme.active.form.step2')}</p>
            <span className="text-sm font-normal text-ic-ink-5s">{common('payment.payme.active.form.step2.des')}</span>
          </div>
          <div className="mb-4">
            <label className="text-ic-ink-6s">{`${common('payment.payme.active.form.xapiClient')}:`}</label>
            <Input
              hiddenClose
              placeholder={common('payment.payme.active.form.xapiClient')}
              {...register('xapiClient', { required: true })}
              feedbackInvalid={errors.xapiClient?.message}
            />
            {errors.xapiClient?.message && <FormHelperText error>{errors.xapiClient?.message}</FormHelperText>}
          </div>
          <div className="mb-4">
            <label className="text-ic-ink-6s">{`${common('payment.payme.active.form.step2.paymePublicKey')}:`}</label>
            <br></br>
            <Textarea
              rows={5}
              placeholder={common('payment.payme.active.form.step2.paymePublicKey')}
              {...register('paymePublicKey', { required: true })}
              feedbackInvalid={errors.paymePublicKey?.message}
            />
            {errors.paymePublicKey?.message && <FormHelperText error>{errors.paymePublicKey?.message}</FormHelperText>}
          </div>
          <div className="mb-4">
            <p className="mb-2 text-lg font-medium leading-6">{common('payment.payme.active.form.step3')}</p>
            <span className="text-sm font-normal text-ic-ink-5s">{common('payment.payme.active.form.step3.des')}</span>
            <div className="flex items-center mt-0.5 gap-4 mb-3">
              <Checkbox
                id="payTypeVietQR"
                {...register('payType')}
                label={
                  <label
                    htmlFor="payTypeVietQR"
                    className="flex cursor-pointer ml-2 text-base font-normal leading-5 text-ic-ink-6s"
                  >
                    <img
                      src={`/static/images/payment/banktransfer.svg`}
                      className="mr-4"
                      width={32}
                      height={20}
                      alt=""
                    />
                    {common('payment.payme.active.form.vietqr')}
                  </label>
                }
                value="VIETQR"
              />
            </div>
            <div className="flex items-center mt-0.5 gap-4 mb-3">
              <Checkbox
                id="payTypeWallet"
                {...register('payType')}
                label={
                  <label
                    htmlFor="payTypeWallet"
                    className="flex cursor-pointer ml-2 text-base font-normal leading-5 text-ic-ink-6s"
                  >
                    <img src={`/static/images/payment/payme.svg`} className="mr-4" width={32} height={20} alt="" />
                    {common('payment.payme.active.form.paymewallet')}
                  </label>
                }
                value="PAYMEWALLET"
              />
            </div>
            <div className="flex items-center mt-0.5 gap-4 ">
              <Checkbox
                id="payTypeCard"
                {...register('payType')}
                label={
                  <label
                    htmlFor="payTypeCard"
                    className="flex cursor-pointer ml-2 text-base font-normal leading-5 text-ic-ink-6s"
                  >
                    <img className="mr-4" src={`/static/images/payment/atm.svg`} width={32} height={20} alt="" />
                    {common('payment.payme.active.form.linkcard')}
                  </label>
                }
                value="LINKCARD"
              />
            </div>
          </div>
          <div className="mb-4 text-base text-ic-black-5">
            {common('payment.payme.active.form.termOfService')}{' '}
            <a href="https://docs.ichiba.net/en/docs/legal/terms-and-conditions" className="text-blue-6">
              {common('payment.payme.active.form.termOfServiceLink')}
            </a>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end w-full gap-x-4 border-t border-ic-ink-2s p-4">
        <Button onClick={() => setOpen(true)} color="danger" variant="filled">
          {common('removeFromMyMethod')}
        </Button>
        <Button loading={loadingData} onClick={handleSubmit(onSubmit)} className="px-10">
          {common('save')}
        </Button>
      </div>
      <ModalConfirmGeneratePublicKey
        open={openGeneralKey}
        setOpen={setOpenGeneralKey}
        onConfirm={onSubmitConfirmGenerateModal}
        isLoading={generateKeyLoading && generateKeyFetching}
      />
      <ModalDeleteFromMyMethod open={open} setOpen={setOpen} type={MerchantAccountTypeEnum.Payme} />
    </div>
  );
};

export default Payme;
