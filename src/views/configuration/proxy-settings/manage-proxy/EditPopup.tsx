import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { checkProxyStatus, getProxyWorkspaceById, updateProxyWorkspace } from '@/services/pim/proxy';
import { EProxyStatus, EProxyUsingFor, IProxyWorkspaceAdd, IProxyWorkspaceEdit } from '@/types/pim/proxy';
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
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export interface Props {
  visible: boolean;
  onClose: () => void;
  id?: string;
  refetch: () => void;
}

export default function EditPopup({ visible, onClose, id, refetch }: Props) {
  const { t: common } = useTranslation(LocaleNamespace.Pim);

  const { t: error } = useTranslation('error');
  const { showToast } = useApp();

  const updateSchema = yup.object().shape({
    origin: yup.string().nullable().required('fieldIsRequired'),
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
    resolver: yupResolver(updateSchema),
  });

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  useQuery({
    queryFn: () => getProxyWorkspaceById({ id: id || '' }),
    enabled: !!id,
    onSuccess: (data: any) => {
      reset(data.data);
    },
  });

  const editProxy = useMutation(updateProxyWorkspace);

  const onConfirm = (data: IProxyWorkspaceEdit) => {
    data.usingFor = +data.usingFor!;
    editProxy.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: common('editProxySuccess'),
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

  function handleChangeStatus(): void {
    setValue('status', watch('status') === EProxyStatus.Active ? EProxyStatus.DeActive : EProxyStatus.Active);
  }

  function handleSelectOrigin(_: OptionValue, option: { label: string; value: string }): void {
    if (option.value) {
      setValue('origin', option.value);
      clearErrors('origin');
    }
  }

  function handleChangeUsingFor(e: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    setValue('usingFor', +value);
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
          <p>{common('editProxy')}</p>
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
              checked={watch('usingFor') === EProxyUsingFor.Crawler}
              value={1}
              onChange={handleChangeUsingFor}
            />
            <RadioButton
              className="!p-0"
              type="radio"
              value={2}
              checked={watch('usingFor') === EProxyUsingFor.Bidding}
              label={common('proxyAndSetting.manageProxy.bidding')}
              onChange={handleChangeUsingFor}
            />
            <RadioButton
              className="!p-0"
              type="radio"
              value={3}
              checked={watch('usingFor') === EProxyUsingFor.Both}
              label={common('proxyAndSetting.manageProxy.both')}
              onChange={handleChangeUsingFor}
            />
          </div>

          <div>
            <FormLabel>
              {common('country')}
              <span className="text-ic-red-6s">&nbsp;*</span>
            </FormLabel>
            <SelectPortal
              className="mb-4"
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
              value={watch('origin')}
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
              <Input {...register('username')} placeholder="admin" />
            </div>

            <div className="w-72">
              <FormLabel>{common('proxyAndSetting.manageProxy.password')}</FormLabel>
              <Input
                type="password"
                className="w-[232px] max-w-[232px]"
                autoComplete="off"
                {...register('password')}
                placeholder="*****"
              />
            </div>
          </div>

          <FormLabel>{common('proxyAndSetting.manageProxy.status')}</FormLabel>
          <Switch checked={watch('status') === EProxyStatus.Active} onChange={handleChangeStatus} />
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
            variant="outlined"
            disabled={
              !watch('ip') ||
              !watch('port') ||
              (!watch('username') && !!watch('password')) ||
              (!!watch('username') && !watch('password')) ||
              checkProxyStatusApi.isLoading
            }
            loading={checkProxyStatusApi.isLoading}
            onClick={handleCheckProxyState}
          >
            <span>{common('proxyAndSetting.manageProxy.checkProxyState')}</span>
          </Button>
        </div>
        <div>
          <Button
            className="text-ic-white-6s text-sm px-10"
            disabled={editProxy.isLoading}
            loading={editProxy.isLoading}
            onClick={handleSubmit(onConfirm)}
          >
            <span>{common('confirm')}</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
