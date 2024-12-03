import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { getAllProxyWorkspace, upsertProxySourceWorkspace } from '@/services/pim/proxy';
import { getAllSource } from '@/services/pim/source';
import { IProxySourceWorkspaceModel, IProxyWorkspace, ProxyOption } from '@/types/pim/proxy';
import { ISource } from '@/types/pim/source';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormHelperText,
  FormLabel,
  MultipleSelect,
  SelectPortal,
} from '@ichiba/ichiba-core-ui';
import { OptionValue } from '@ichiba/ichiba-core-ui/dist/components/multiple-select/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
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

  const { t: error } = useTranslation('error');
  const { showToast } = useApp();

  const addSchema = yup.object().shape({
    sourceId: yup.string().required('fieldIsRequired'),
    proxyIds: yup.array().min(1, 'fieldIsRequired').required('fieldIsRequired'),
  });

  const {
    setValue,
    handleSubmit,
    reset,
    register,
    clearErrors,
    formState: { errors },
  } = useForm<IProxySourceWorkspaceModel>({
    resolver: yupResolver(addSchema),
  });

  const useAddProxySourceWp = useMutation(upsertProxySourceWorkspace);
  const [sources, setSources] = useState<ProxyOption[]>();
  const [ips, setIps] = useState<ProxyOption[]>();
  useQuery({
    queryKey: ['getAllSource'],
    enabled: visible,
    queryFn: () => getAllSource(),
    onSuccess: (response: AxiosResponse<ISource[]>) => {
      const sourceList = [] as ProxyOption[];
      response.data.forEach((item) => {
        sourceList.push({
          label: item.name,
          value: item.id,
        } as ProxyOption);
      });
      setSources(sourceList);
    },
  });
  useQuery({
    queryKey: ['getAllProxyWorkspace'],
    enabled: visible,
    queryFn: () => getAllProxyWorkspace(),
    onSuccess: (res: AxiosResponse<IProxyWorkspace[]>) => {
      setIps(
        res.data.map((x) => ({
          label: x.ip + (x.origin ? ` (${x.origin})` : ''),
          value: x.id,
        })),
      );
    },
  });

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const onConfirm = (data: IProxySourceWorkspaceModel) => {
    useAddProxySourceWp.mutate(data, {
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
            summary: common(errorNormal),
          });
        }
      },
    });
  };
  function handleSelectSource(val: OptionValue): void {
    if (val) {
      setValue('sourceId', val as string);
      clearErrors('sourceId');
    }
  }

  function handleSelectIps(value: OptionValue[]): void {
    setValue('proxyIds', value as string[]);
    if (value?.length) {
      clearErrors('proxyIds');
    }
  }

  return (
    <Dialog open={visible} onClose={handleCloseModal}>
      <DialogHeader>
        <div className="text-lg font-medium">
          <p>{common('proxyAndSetting.proxyConfig.addNewConfig')}</p>
        </div>
      </DialogHeader>
      <DialogBody>
        <FormHelperText>
          <div>
            <FormLabel>
              {common('proxyAndSetting.proxyConfig.source')}
              <span className="text-ic-red-6s">&nbsp;*</span>
            </FormLabel>
            <SelectPortal
              placeholder={common('selectAnOption')}
              searchable
              options={sources || []}
              error={!!error(errors?.sourceId?.message || '')}
              {...(register('sourceId'),
              {
                onChange: (e) => handleSelectSource(e),
              })}
            />

            <FormLabel className="mt-4">
              {common('proxyAndSetting.proxyConfig.ip')}
              <span className="text-ic-red-6s">&nbsp;*</span>
            </FormLabel>
            <MultipleSelect
              placeholder={common('selectAnOption')}
              searchable
              options={ips || []}
              error={!!error(errors?.proxyIds?.message || '')}
              {...(register('proxyIds'),
              {
                onChange: (e) => handleSelectIps(e),
              })}
            />
          </div>
        </FormHelperText>
      </DialogBody>

      <DialogFooter className="flex justify-end">
        <div className="mr-3">
          <Button className="text-sm px-10" variant="outlined" onClick={handleCloseModal}>
            <span>{common('cancel')}</span>
          </Button>
        </div>
        <div>
          <Button
            className="text-ic-white-6s text-sm px-10"
            disabled={useAddProxySourceWp.isLoading}
            loading={useAddProxySourceWp.isLoading}
            onClick={handleSubmit(onConfirm)}
          >
            <span>{common('confirm')}</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
