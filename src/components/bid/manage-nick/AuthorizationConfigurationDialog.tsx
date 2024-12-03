import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { getAllWorkspace, updateAuthorizationConfig } from '@/services/bid';
import { AuthorizationConfigurationEnum } from '@/types/bid/enum';
import { AuthorizationConfigurationRequest } from '@/types/bid/interface';
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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

type Props = {
  opened: boolean;
  onClose: () => void;
};
export const AuthorizationConfigurationDialog = ({ opened, onClose }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: bid } = useTranslation(LocaleNamespace.Bid);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const {
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AuthorizationConfigurationRequest>({
    resolver: yupResolver(
      yup.object({
        workspaceIds: yup.array().min(1, 'fieldIsRequired').required('fieldIsRequired'),
        authorizeBidType: yup.number().required('fieldIsRequired'),
      }),
    ),
    defaultValues: {
      workspaceIds: [],
    },
  });

  function handleChangeConfig(_: OptionValue, option: { label: string; value: AuthorizationConfigurationEnum }): void {
    setValue('authorizeBidType', option.value, { shouldValidate: true });
  }

  const { showToast } = useApp();
  const updateConfigAsync = useMutation({
    mutationFn: updateAuthorizationConfig,
  });
  function onSave(data: AuthorizationConfigurationRequest) {
    updateConfigAsync.mutate(data, {
      onSuccess: () => {
        showToast({
          type: 'success',
          summary: common('updateSuccess'),
        });
        onClose();
      },
      onError: () => {
        showToast({
          type: 'error',
          summary: error('updateFaild'),
        });
      },
    });
  }

  const { data: workspaces } = useQuery({
    queryKey: ['getAllWorkspace'],
    queryFn: () => getAllWorkspace(),
  });

  function handleChangeWorkspace(value: string[]): void {
    setValue('workspaceIds', value, { shouldValidate: true });
  }

  return (
    <Dialog open={opened}>
      <DialogHeader>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium text-ic-ink-6s">{bid('authorizationConfiguration')}</p>
          <p className="text-sm font-normal text-ic-ink-5s">{bid('authorizationConfigurationDesc')}</p>
        </div>
      </DialogHeader>
      <DialogBody>
        <FormHelperText className="p-0">
          <div className="flex flex-col gap-3">
            <div>
              <FormLabel>
                <p>
                  {bid('config')} <span className="text-red-600">*</span>
                </p>
              </FormLabel>
              <SelectPortal
                options={[
                  {
                    label: bid('authorizationForIchiba'),
                    value: AuthorizationConfigurationEnum.AuthorizationForIchiba,
                  },
                  {
                    label: bid('workspaceForSelfManagedBidAccounts'),
                    value: AuthorizationConfigurationEnum.WorkspaceForSelfManagedBidAccounts,
                  },
                ]}
                placeholder="Select an option"
                value={watch('authorizeBidType')}
                onChange={handleChangeConfig}
                error={!!errors.authorizeBidType?.message}
                helperText={error(errors.authorizeBidType?.message as string)}
              />
            </div>
            {watch().authorizeBidType && (
              <div>
                <FormLabel>
                  {bid('workspace')} <span className="text-red-600">*</span>
                </FormLabel>
                <MultipleSelect
                  options={workspaces?.data?.filter((x) => x.authorizeBidType !== watch().authorizeBidType) ?? []}
                  onChange={handleChangeWorkspace}
                  optionLabel={(x) => x.workspaceName}
                  optionValue={(x) => x.workspaceId}
                  placeholder={bid('selectOptions')}
                  error={!!errors.workspaceIds?.message}
                  helperText={error(errors.workspaceIds?.message as string)}
                  preventAutoSuggestion
                  clearable
                  searchable={false}
                  onReset={() => setValue('workspaceIds', [], { shouldValidate: true })}
                />
              </div>
            )}
          </div>
        </FormHelperText>
      </DialogBody>
      <DialogFooter>
        <Button onClick={onClose} color="stroke" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={updateConfigAsync.isLoading} onClick={handleSubmit(onSave)}>
          {common('save')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
