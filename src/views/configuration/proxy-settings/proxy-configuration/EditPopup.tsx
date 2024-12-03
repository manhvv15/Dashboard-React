import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { getAllProxyWorkspace, upsertProxySourceWorkspace } from '@/services/pim/proxy';
import { getAllSource } from '@/services/pim/source';
import {
  EProxyUsingFor,
  IProxySourceWorkspace,
  IProxySourceWorkspaceModel,
  IProxyWorkspace,
  ProxyOption,
} from '@/types/pim/proxy';
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
  currentItem?: IProxySourceWorkspace;
  refetch: () => void;
}

export default function EditPopup({ visible, onClose, currentItem, refetch }: Props) {
  const { t: common } = useTranslation(LocaleNamespace.Pim);

  const { t: error } = useTranslation('error');
  const { showToast } = useApp();

  const updateSchema = yup.object().shape({
    sourceId: yup.string().required('fieldIsRequired'),
    proxyIds: yup.array().min(1, 'fieldIsRequired').required('fieldIsRequired'),
  });

  const {
    setValue,
    handleSubmit,
    reset,
    register,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<IProxySourceWorkspaceModel>({
    resolver: yupResolver(updateSchema),
    defaultValues: {
      proxyIds: currentItem?.proxyInfos?.map((x) => x.id) || [],
      sourceId: currentItem?.sourceId || '',
    },
  });

  const useAddProxySourceWp = useMutation(upsertProxySourceWorkspace);
  const [sources, setSources] = useState<ProxyOption[]>();
  const [ips, setIps] = useState<ProxyOption[]>();

  const handleCloseModal = () => {
    reset();
    onClose();
  };
  // get all proxy
  useQuery({
    queryKey: ['getAllProxyWorkspace'],
    queryFn: () => getAllProxyWorkspace(),
    onSuccess: (res: AxiosResponse<IProxyWorkspace[]>) => {
      setIps(
        res.data
          .filter((x) => x.usingFor !== EProxyUsingFor.Bidding)
          .map((x) => ({
            label: x.ip + (x.origin ? ` (${x.origin})` : ''),
            value: x.id,
          })),
      );
    },
  });

  // get all source
  useQuery({
    queryKey: ['getAllSource'],
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
            summary: error(errorNormal),
          });
        }
      },
    });
  };

  function handleSelectIps(val: OptionValue[]): void {
    setValue('proxyIds', val as string[]);
    if (val?.length > 0) {
      clearErrors('proxyIds');
    }
  }

  return (
    <Dialog open={visible} onClose={handleCloseModal}>
      <DialogHeader>
        <div className="text-lg font-medium">
          <p>{common('proxyAndSetting.proxyConfig.editConfig')}</p>
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
              disabled
              value={currentItem?.sourceId}
              defaultValue={currentItem?.sourceId}
            />
            <FormLabel className="mt-4">
              {common('proxyAndSetting.proxyConfig.ip')}
              <span className="text-ic-red-6s">&nbsp;*</span>
            </FormLabel>
            {!!ips?.length && (
              <MultipleSelect
                placeholder={common('selectAnOption')}
                searchable
                defaultValue={watch('proxyIds') as string[]}
                options={ips || []}
                error={!!error(errors?.proxyIds?.message || '')}
                {...(register('proxyIds'),
                {
                  onChange: (e) => handleSelectIps(e),
                })}
              />
            )}
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
