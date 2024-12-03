import { Dispatch, SetStateAction } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  Input,
  Textarea,
} from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'usehooks-ts';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { createMerchantAccountPayme, getMerchantAccountPayme } from '@/services/payment-method';
import { responseErrorCode } from '@/utils/common';
import { showToast } from '@/utils/toasts';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface CreateMerchantAccountPayme {
  name: string;
  xapiClient: string;
  privateKey: string;
  publicKey: string;
  workspaceId: string;
  marketId: string;
  payType: string[];
  countryCode: string;
  isActive?: boolean;
  paymePublicKey: string;
  apiEndPoint: string;
}

const ModalPayme = ({ open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const copyApi = useCopyToClipboard()[1];
  const copyPublickey = useCopyToClipboard()[1];

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    setValue,
    reset,
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

  useQuery({
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
      }
    },
    retry: (failureCount, res: any) => failureCount < 0 && res.status !== 400,
  });

  const createMutation = useMutation({
    mutationFn: createMerchantAccountPayme,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('createPaymeSuccess'),
      });
      queryClient.invalidateQueries(['getAllPaymentMethod']);
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

  const onSubmit = (data: CreateMerchantAccountPayme) => {
    createMutation.mutate({
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
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-end">
        <button onClick={handleClose}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full overflow-y-auto flex flex-col gap-y-4 max-h-[80vh]">
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
            <div className="flex">
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
                  <img src={`/static/images/payment/banktransfer.svg`} className="mr-4" width={32} height={20} alt="" />
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
      </DialogBody>
      <DialogFooter className="flex gap-x-4">
        <Button onClick={handleClose} color="danger" variant="filled">
          {common('cancel')}
        </Button>
        <Button loading={createMutation.isLoading} onClick={handleSubmit(onSubmit)}>
          {common('save')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalPayme;
