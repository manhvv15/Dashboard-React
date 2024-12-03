import SvgIcon from '@/components/commons/SvgIcon';
import CopyToClipboard from '@/components/commons/copy-to-clip-board';
import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { urlRegex } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { GuideConnectCarrierLink } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { configWebhookUrl } from '@/services/ship4p/carrier-system';
import {
  CourierAccountViewModel,
  CourierWebhookConfig,
  GetCouriersResponse,
  IListCarrier,
} from '@/types/ship4p/carrier';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Close,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  Input,
  Tooltip,
} from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  carrierAccount: CourierAccountViewModel | IListCarrier;
  listCarrierOwn: GetCouriersResponse[] | undefined;
}

export default function ModalWebhookSetting({ isOpen, onClose, carrierAccount, listCarrierOwn }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();

  const schema = yup.object().shape({
    webhoookLink: yup
      .string()
      .required(error('required'))
      .test({
        test: (val, context) => {
          const value = val?.trim();
          const valueWebhook = `${carrierAccount.baseWebHookUrl}/${val?.trim()}`;
          if (value != null && !urlRegex.test(valueWebhook)) {
            return context.createError({
              message: error('webhookLink.invalid'),
            });
          }
          return true;
        },
      }),
  });
  const {
    formState: { errors },
    setValue,
    watch,
    register,
    handleSubmit,
  } = useForm<CourierWebhookConfig>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });
  const [webhookLink, setWebhookLink] = useState<string>(carrierAccount.webHookLink ?? '');
  const courierIds = listCarrierOwn?.find((val) => {
    return val.code?.toLowerCase() === carrierAccount.courierId?.toLowerCase();
  });

  const settingWebhook = useMutation({
    mutationFn: configWebhookUrl,
  });
  const onClearDataWebhook = () => {
    setWebhookLink('');
  };
  const onHandleSubmit = (data: CourierWebhookConfig) => {
    settingWebhook.mutate(
      {
        id: data.id,
        webhookUrl: data.webhoookLink,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: ship4p('config.webhookUrl.success'),
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
  useEffect(() => {
    setValue('id', carrierAccount.id ?? '');
    setValue('webhoookLink', carrierAccount.webHookLink ?? '');
  }, [carrierAccount]);
  return (
    <Dialog open={isOpen} size="sm" handler={onClose} className="'min-w-[1000px] : min-w-[1000px]'">
      <DialogHeader className="pb-2 font-medium leading-6 text-lg flex justify-between">
        {ship4p('modal.carrier.webhookSetting.title')}
        <div onClick={onClose} className="cursor-pointer">
          <Close />
        </div>
      </DialogHeader>
      <DialogBody className="relative my-2grid grid-cols-12 gap-4 border-ic-ink-2s rounded-xl">
        <div className="col-span-12 mb-6">
          <span className="text-sm text-ic-ink-5s">{ship4p('modal.carrier.webhookSetting.body')}</span>
        </div>
        <div className="col-span-12 relative">
          <MixLabel label={ship4p('input.carrier.webhookSetting')} required>
            <div className="flex w-full flex-1 justify-between items-center relative">
              <div
                className={clsx(
                  'px-2 flex w-full flex-1 items-center rounded-lg border ',
                  errors.webhoookLink ? 'border-ic-red-6s' : 'border-ic-ink-2s',
                )}
              >
                <div className="flex max-w-[400px]">
                  <Tooltip content={`${carrierAccount.baseWebHookUrl}/`}>
                    <div className="text-sm overflow-hidden truncate max-w-[380px]">{`${carrierAccount.baseWebHookUrl}/`}</div>
                  </Tooltip>
                </div>

                <div className="flex flex-1">
                  <Input
                    hiddenClose={!webhookLink}
                    onClearData={onClearDataWebhook}
                    className="border-none outline-none shadow-none"
                    classNameContainer="border-none outline-none !shadow-none"
                    type="text"
                    required={false}
                    {...register('webhoookLink')}
                    value={watch('webhoookLink')}
                    placeholder={ship4p('input.carrier.webhookSetting.description')}
                  />
                </div>
                <CopyToClipboard code={`${carrierAccount.baseWebHookUrl}/${webhookLink}`} />
              </div>
            </div>
            <FormHelperText error={!!errors.webhoookLink?.message}>{errors.webhoookLink?.message}</FormHelperText>
          </MixLabel>
        </div>
        <div className="col-span-12 p-4 mt-4 bg-ic-orange-1s border border-ic-orange-6s rounded-xl">
          <div className="flex ">
            <SvgIcon width={24} height={24} icon="warning" />
            <span className="ml-2 text-base text-ic-ink-6s font-medium">{t('note')} :</span>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1"></div>
            <div className="col-span-11 text-sm">
              <div>
                <span className="relative before:rounded before:absolute before:bg-black before:w-1 before:h-1 before:left-[-10px] before:top-[10px]">
                  {ship4p('warning.resetLink.content.body')}
                </span>
              </div>
              <a
                className="text-primary-6 text-sm"
                target="_blank"
                href={GuideConnectCarrierLink.Guide}
                rel="noreferrer"
              >
                {ship4p('instruct.setting.webhook.content', {
                  courierId: courierIds?.name,
                })}
              </a>
              <div>
                <span className="relative before:rounded before:absolute before:bg-black before:w-1 before:h-1 before:left-[-10px] before:top-[10px]">
                  {ship4p('warning.resetLink.content.bottom')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-end">
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            size="40"
            className="w-[160px] justify-center items-center"
            variant="outlined"
            onClick={onClose}
          >
            {t('button.close')}
          </Button>
          <Button
            type="button"
            size="40"
            className="w-[160px] justify-center items-center"
            variant="filled"
            loading={settingWebhook.isLoading}
            disabled={settingWebhook.isLoading}
            onSubmit={handleSubmit(onHandleSubmit)}
          >
            {t('save')}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
