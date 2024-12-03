import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { addProxyWorkspace, checkProxyStatus } from '@/services/pim/proxy';
import { EProxyStatus, EProxyUsingFor, IProxyWorkspaceAdd } from '@/types/pim/proxy';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  FormLabel,
  Input,
  RadioButton,
  SelectPortal,
  Switch,
} from '@ichiba/ichiba-core-ui';
import { OptionValue } from '@ichiba/ichiba-core-ui/dist/components/multiple-select/types';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export interface Props {
  visible: boolean;
  onClose: () => void;
  refetch: () => void;
}

export default function AddPopup({ visible, onClose, refetch }: Props) {
  const { t: common } = useTranslation(LocaleNamespace.Pim);
  const {} = useApp();

  const { t: error } = useTranslation('error');
  const { showToast } = useApp();

  const addSchema = yup.object().shape({
    origin: yup.string().required('fieldIsRequired'),
    ip: yup.string().required('fieldIsRequired'),
    port: yup.string().required('fieldIsRequired'),
    username: yup.string(),
    password: yup.string(),
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IProxyWorkspaceAdd>({
    resolver: yupResolver(addSchema),
    defaultValues: {
      usingFor: EProxyUsingFor.Crawler,
      status: EProxyStatus.Active,
    },
  });

  const addProxy = useMutation(addProxyWorkspace);
  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const onConfirm = (data: IProxyWorkspaceAdd) => {
    data.usingFor = +data.usingFor;
    addProxy.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: common('successfully'),
        });
        handleCloseModal();
        refetch();
      },
      onError: (err: any) => {
        const { errorNormal } = err;
        if (errorNormal) {
          showToast({
            type: 'error',
            summary: error(errorNormal),
          });
        }
      },
    });
  };

  function handleChangeStatus(event: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target;
    setValue('status', value === '1' ? EProxyStatus.Active : EProxyStatus.DeActive);
  }

  function handleSelectOrigin(_: OptionValue, option: { label: string; value: string }): void {
    if (option.value) {
      setValue('origin', option.value);
      clearErrors('origin');
    }
  }

  const checkProxyStatusApi = useMutation({
    mutationFn: checkProxyStatus,
    mutationKey: ['checkProxyStatus'],
  });
  function handleCheckProxyState() {
    const ip = watch('ip') || '';
    const port = watch('port') || '';
    const username = watch('username') || '';
    const password = watch('password') || '';
    checkProxyStatusApi.mutate(
      {
        ip,
        port,
        username,
        password,
      },
      {
        onSuccess(data) {
          if (data.data) {
            showToast({
              type: 'success',
              summary: common('proxyIsRunning'),
            });
          } else {
            showToast({
              type: 'error',
              summary: common('proxyIsNotRunning'),
            });
          }
        },
        onError() {
          showToast({
            type: 'error',
            summary: common('proxyIsNotRunning'),
          });
        },
      },
    );
  }

  return (
    <Dialog open={visible} onClose={handleCloseModal} width={700}>
      <DialogHeader>
        <div className="text-lg font-medium">
          <p>{common('addProxy')}</p>
        </div>
      </DialogHeader>
      <DialogBody>
        <FormHelperText>
          <div className="flex gap-4 items-center mb-4">
            <p>{common('proxyAndSetting.manageProxy.usingFor')}</p>
            <RadioButton
              className="!p-0"
              type="radio"
              label={common('proxyAndSetting.manageProxy.crawl')}
              defaultChecked
              value={1}
              {...register('usingFor')}
            />
            <RadioButton
              className="!p-0"
              type="radio"
              value={2}
              label={common('proxyAndSetting.manageProxy.bidding')}
              {...register('usingFor')}
            />
            <RadioButton
              className="!p-0"
              type="radio"
              value={3}
              label={common('proxyAndSetting.manageProxy.both')}
              {...register('usingFor')}
            />
          </div>

          <div>
            <FormLabel>
              {common('country')}
              <span className="text-ic-red-6s">&nbsp;*</span>
            </FormLabel>
            <SelectPortal
              placeholder={common('selectAnOption')}
              options={[
                {
                  label: 'VN',
                  value: 'VN',
                },
                {
                  label: 'US',
                  value: 'US',
                },
                {
                  label: 'JP',
                  value: 'JP',
                },
              ]}
              {...register('origin')}
              error={!!error(errors?.origin?.message || '')}
              onChange={handleSelectOrigin}
            />
          </div>

          <div className="flex justify-between mb-4">
            <div className="w-72">
              <FormLabel>
                Ip
                <span className="text-ic-red-6s">&nbsp;*</span>
              </FormLabel>
              <Input {...register('ip')} placeholder="127.0.0.1" feedbackInvalid={error(errors?.ip?.message || '')} />
            </div>
            <div className="w-72">
              <FormLabel>
                Port
                <span className="text-ic-red-6s">&nbsp;*</span>
              </FormLabel>
              <Input {...register('port')} placeholder="8080" feedbackInvalid={error(errors?.port?.message || '')} />
            </div>
          </div>

          <div className="flex mb-4 justify-between">
            <div className="w-72">
              <FormLabel>{common('proxyAndSetting.manageProxy.username')}</FormLabel>
              <Input className="!w-64" {...register('username')} placeholder="admin" />
            </div>

            <div className="w-72">
              <FormLabel>{common('proxyAndSetting.manageProxy.password')}</FormLabel>
              <Input type="password" autoComplete="off" {...register('password')} placeholder="******" />
              <div></div>
            </div>
          </div>

          <FormLabel>{common('status')}</FormLabel>
          <Switch checked={watch('status') === EProxyStatus.Active} defaultChecked onChange={handleChangeStatus} />
        </FormHelperText>
      </DialogBody>

      <DialogFooter className="flex justify-end">
        <div className="mr-3">
          <Button className="text-sm px-10" variant="outlined" onClick={handleCloseModal}>
            <span>{common('cancel')}</span>
          </Button>
        </div>
        <div className="mr-3">
          <Button
            className="text-sm px-10"
            disabled={
              !watch('ip') ||
              !watch('port') ||
              (!watch('username') && !!watch('password')) ||
              (!!watch('username') && !watch('password')) ||
              checkProxyStatusApi.isLoading
            }
            variant="outlined"
            loading={checkProxyStatusApi.isLoading}
            onClick={handleCheckProxyState}
          >
            <span>{common('proxyAndSetting.manageProxy.checkProxyState')}</span>
          </Button>
        </div>
        <div>
          <Button
            type="button"
            className="text-ic-white-6s text-sm px-10"
            disabled={addProxy.isLoading}
            onClick={handleSubmit(onConfirm)}
          >
            <span>{common('confirm')}</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
