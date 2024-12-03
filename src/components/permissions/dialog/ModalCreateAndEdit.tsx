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
  Input,
  SelectPortal,
} from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useGetAction, useGetApplication, useGetObject } from '@/hooks-query/application';
import { useApp } from '@/hooks/use-app';
import { createPermission, getPermissionById, updatePermission } from '@/services/user-management/permission';
import { PermissionByIdResponse } from '@/types/user-management/permission';
import { responseErrorCode } from '@/utils/common';

interface Props {
  type: 'edit' | 'create';
  id?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface FormData {
  id?: string;
  applicationId: string;
  objectId: string;
  actionId: string;
  method: string | null;
  endpoint: string | null;
}

const ModalCreateAndEdit = ({ type, id, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const { showToast } = useApp();
  const queryClient = useQueryClient();

  const methodOptions = [
    { value: '', label: t('No data') },
    { value: 'GET', label: t('GET') },
    { value: 'POST', label: t('POST') },
    { value: 'PUT', label: t('PUT') },
    { value: 'DELETE', label: t('DELETE') },
    { value: 'PATCH', label: t('PATCH') },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup
        .object()
        .shape({
          applicationId: yup.string().required(error('fieldRequired')).trim(),
          objectId: yup.string().required(error('fieldRequired')).trim(),
          actionId: yup.string().required(error('fieldRequired')).trim(),
        })
        .required(),
    ),
  });

  useQuery({
    queryKey: ['getPermissionById', id],
    queryFn: () => getPermissionById(id as string),
    enabled: !!id && open,
    onSuccess: (data: AxiosResponse<PermissionByIdResponse>) => {
      setValue('id', data.data.id);
      setValue('actionId', data.data.actionId);
      setValue('objectId', data.data.objectId);
      setValue('applicationId', data.data.applicationId);
      setValue('endpoint', data.data.endpoint);
      setValue('method', data.data.method);
    },
  });

  const createMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('createGroupRoleSuccessfully'),
      });
      responseSuccess();
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      // if (errorNormal && errorNormal === 'organizationCodeExisted') {
      //   setError('code', { message: error('organizationCodeExisted') });
      // }
      // if (errorNormal && errorNormal === 'organizationNameExisted') {
      //   setError('name', { message: error('organizationNameExisted') });
      // }
      if (errorNormal && errorNormal !== 'organizationCodeExisted' && errorNormal !== 'organizationNameExisted') {
        showToast({
          type: 'error',
          summary: error(errorNormal),
        });
      }
      if (errorFrom) {
        responseErrorCode(err.errorFrom).forEach(({ name, message, type }) => {
          const mess = error(message);
          setError(name, { type, message: mess });
        });
      }
    },
  });

  const editMutation = useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('editGroupRoleSuccessfully'),
      });
      responseSuccess();
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      // if (errorNormal && errorNormal === 'organizationCodeExisted') {
      //   setError('code', { message: error('organizationCodeExisted') });
      // }
      // if (errorNormal && errorNormal === 'organizationNameExisted') {
      //   setError('name', { message: error('organizationNameExisted') });
      // }

      if (errorNormal && errorNormal !== 'organizationCodeExisted' && errorNormal !== 'organizationNameExisted') {
        showToast({
          type: 'error',
          summary: error(errorNormal),
        });
      }

      if (errorFrom) {
        responseErrorCode(err.errorFrom).forEach(({ name, message, type }) => {
          const mess = error(message);
          setError(name, { type, message: mess });
        });
      }
    },
  });

  const submitData = (data: FormData) => {
    if (type === 'edit') {
      editMutation.mutate({
        id: data.id ?? '',
        actionId: data.actionId,
        applicationId: data.applicationId,
        endpoint: data.endpoint,
        method: data.method,
        objectId: data.objectId,
      });
      return;
    }
    if (type === 'create') {
      createMutation.mutate({ ...data });
      return;
    }
  };

  const responseSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries(['getPermissionPaging']);
    reset();
  };

  const handleCloseModel = () => {
    reset();
    setOpen(false);
  };
  const applications =
    useGetApplication({
      isSystem: null,
    }).data?.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];

  const objects = useGetObject({}).data?.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];
  const actions = useGetAction({}).data?.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];
  return (
    <Dialog
      size="sm"
      open={open}
      handler={setOpen}
      dismiss={{
        outsidePress: false,
      }}
    >
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">
          {type == 'create' ? common('permission.create') : common('permission.edit')}
        </p>
        <button onClick={() => handleCloseModel()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="mt-2">
          <FormLabel required>{common('application')}</FormLabel>
          <SelectPortal
            options={applications ?? []}
            onChange={(e: string) => setValue('applicationId', e)}
            value={watch('applicationId')}
          />
        </div>
        <div className="mt-2">
          <FormLabel required>{common('object')}</FormLabel>
          <SelectPortal
            options={objects ?? []}
            onChange={(e: string) => setValue('objectId', e)}
            value={watch('objectId')}
          />
        </div>
        <div className="mt-2">
          <FormLabel required>{common('action')}</FormLabel>
          <SelectPortal
            options={actions ?? []}
            onChange={(e: string) => setValue('actionId', e)}
            value={watch('actionId')}
          />
        </div>
        <div className="mt-2">
          <FormLabel>{common('method')}</FormLabel>
          <SelectPortal
            options={methodOptions ?? []}
            onChange={(e: string) => setValue('method', e)}
            value={watch('method')}
          />
        </div>
        <div className="mt-4">
          <FormLabel>{common('endpoint')}</FormLabel>
          <Input
            {...register('endpoint')}
            feedbackInvalid={errors?.endpoint?.message}
            classNameContainer="mt-2"
            hiddenClose
            name="endpoint"
          />
          {errors?.endpoint?.message && <FormHelperText error>{error(errors?.endpoint?.message)}</FormHelperText>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModel()} color="stroke" variant="outlined">
          {common('cancel')}
        </Button>
        <Button
          loading={editMutation.isLoading || createMutation.isLoading}
          onClick={handleSubmit(submitData)}
          className="ml-3"
        >
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalCreateAndEdit;
