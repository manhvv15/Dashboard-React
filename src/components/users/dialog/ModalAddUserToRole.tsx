import { Dispatch, SetStateAction } from 'react';

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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { getApplicationPaging } from '@/services/user-management/application';
import { getAvailableRolesByUserId } from '@/services/user-management/role';
import { addUsersToRole } from '@/services/user-management/user';

interface Props {
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface FormData {
  userId: string;
  applicationId: string;
  roleIds: string[];
}
const ModalAddUserToRole = ({ userId, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        applicationId: yup.string().required(error('fieldRequired')),
        roleIds: yup.array().min(1, error('fieldRequired')).required(error('fieldRequired')),
      }),
    ),
  });

  const applicationSystems = useQuery({
    queryKey: ['getApplicationPaging'],
    queryFn: () =>
      getApplicationPaging({
        pageNumber: 0,
        pageSize: 100,
        keyword: '',
        isSystem: true,
      }),
    retry: true,
    select: (response) => {
      return response.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];
    },
    enabled: open,
  }).data;

  const roles = useQuery({
    queryKey: ['getRolePagingByApplication', watch('applicationId')],
    queryFn: () =>
      getAvailableRolesByUserId({
        keyword: '',
        applicationId: watch('applicationId'),
        workspaceId: '',
        userId: userId,
      }),
    select: (response) => {
      return response.data?.map((i) => ({ label: i.name, value: i.id })) ?? [];
    },
    enabled: !!watch('applicationId'),
    retry: true,
  }).data;

  const addUsersToRoleMutation = useMutation({
    mutationFn: addUsersToRole,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('user.changeRoleSuccessfully'),
      });
      reset();
      setOpen(false);
      queryClient.invalidateQueries(['getUserById']);
    },
    onError: () => {
      showToast({
        type: 'error',
        summary: error('somethingWentWrongPleaseTryAgain'),
      });
    },
  });

  const submitData = (data: FormData) => {
    addUsersToRoleMutation.mutate({
      roleIds: data.roleIds,
      userIds: [userId],
    });
  };
  const handleChangeApplication = (data?: string) => {
    setValue('applicationId', data as string, {
      shouldValidate: true,
    });
  };
  const handleChangeRole = (input: string[]) => {
    setValue('roleIds', input, {
      shouldValidate: true,
    });
  };

  const handleCloseModal = () => {
    reset();
    setOpen(false);
  };
  return (
    <Dialog size="sm" open={open} handler={handleCloseModal}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('user.addToApplicationRole')}</p>
        <button onClick={() => handleCloseModal()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="mt-4">
          <FormLabel required>{common('user.application')}</FormLabel>
          <SelectPortal
            placeholder={common('user.application')}
            options={applicationSystems ?? []}
            {...register('applicationId')}
            onChange={(e) => handleChangeApplication(e)}
            value={watch('applicationId')}
            searchable={false}
          />
          {errors?.applicationId?.message && (
            <FormHelperText error>{error(errors?.applicationId?.message)}</FormHelperText>
          )}
        </div>
        <div className="mt-4">
          <FormLabel required>{common('user.role')}</FormLabel>
          <MultipleSelect
            options={roles ?? []}
            placeholder={t('user.selectRole')}
            optionValue="value"
            className="w-full"
            error={!!errors?.roleIds?.message}
            onChange={handleChangeRole}
          />
          {errors?.roleIds?.message && <FormHelperText error>{error(errors?.roleIds?.message)}</FormHelperText>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModal()} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={addUsersToRoleMutation.isLoading} className="ml-3" onClick={handleSubmit(submitData)}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalAddUserToRole;
