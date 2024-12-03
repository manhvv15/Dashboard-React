import { ChangeEvent, Dispatch, SetStateAction } from 'react';

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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { REGEX_ORGANIZATION_CODE } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { createObject, getObjectById, getObjectPaging, updateObject } from '@/services/user-management/object';
import { ObjectByIdResponse } from '@/types/user-management/object';
import { responseErrorCode } from '@/utils/common';

interface Props {
  type: 'edit' | 'create';
  id?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface FormData {
  id?: string;
  code: string;
  name: string;
  parentId?: string;
}

const ModalCreateAndEdit = ({ type, id, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const { showToast } = useApp();
  const queryClient = useQueryClient();

  const listObject = useQuery({
    queryKey: ['getObjectByCreate'],
    queryFn: () => getObjectPaging({ pageNumber: 0, pageSize: 1000 }),
    select: (response) => {
      const result = response.data?.items.filter((i) => i.id != id).map((i) => ({ label: i.name, value: i.id })) ?? [];
      result.unshift({
        label: 'No value',
        value: '',
      });
      return result;
    },
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup
        .object()
        .shape({
          code: yup
            .string()
            .required(error('fieldRequired'))
            .matches(REGEX_ORGANIZATION_CODE, error('validateObjectCodeRule'))
            .trim(),
          name: yup
            .string()
            .required(error('fieldRequired'))
            .min(3, error('validateObjectNameRule'))
            .max(250, error('validateObjectNameRule'))
            .trim(),
        })
        .required(),
    ),
  });

  useQuery({
    queryKey: ['getObjectById', id],
    queryFn: () => getObjectById(id as string),
    enabled: !!id && open,
    onSuccess: (data: AxiosResponse<ObjectByIdResponse>) => {
      setValue('id', data.data.id);
      setValue('code', data.data.code);
      setValue('name', data.data.name);
      setValue('parentId', data.data.parentId);
    },
  });

  const createObjectMutation = useMutation({
    mutationFn: createObject,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('createObjectSuccessfully'),
      });
      responseSuccess();
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorNormal && errorNormal === 'codeExisted') {
        setError('code', { message: error('codeExisted') });
      }
      if (errorNormal && errorNormal === 'nameExisted') {
        setError('name', { message: error('nameExisted') });
      }
      if (errorNormal && errorNormal !== 'codeExisted' && errorNormal !== 'nameExisted') {
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

  const editObjectMutation = useMutation({
    mutationFn: updateObject,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('editObjectSuccessfully'),
      });
      responseSuccess();
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorNormal && errorNormal === 'codeExisted') {
        setError('code', { message: error('codeExisted') });
      }
      if (errorNormal && errorNormal === 'nameExisted') {
        setError('name', { message: error('nameExisted') });
      }

      if (errorNormal && errorNormal !== 'codeExisted' && errorNormal !== 'nameExisted') {
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
      editObjectMutation.mutate({
        id: data.id ?? '',
        code: data.code,
        name: data.name,
        parentId: getValues('parentId'),
      });
      return;
    }
    if (type === 'create') {
      createObjectMutation.mutate({ ...data });
      return;
    }
  };

  const responseSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries(['getObjectPaging']);
    reset();
  };

  const handleCloseModel = () => {
    reset();
    setOpen(false);
  };

  const handleChangeParent = (data?: string) => {
    setValue('parentId', data as string);
  };
  const handleChangeName = (event?: ChangeEvent<HTMLInputElement>) => {
    if (!!event?.target.value && !!event?.target.value.trim()) setValue('code', processString(event?.target.value));
  };

  const processString = (inputString: string) => {
    const normalizedString = inputString.normalize('NFD');
    const withoutDiacritics = normalizedString.replace(/[\u0300-\u036f]/g, '');

    const words = withoutDiacritics.split(' ');
    const capitalizedWords = words.map((word) => word.toUpperCase());
    const processedString = capitalizedWords.join('_');

    return processedString;
  };
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
          {type == 'create' ? common('object.create') : common('object.edit')}
        </p>
        <button onClick={() => handleCloseModel()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div>
          <div className="mt-2">
            <FormLabel>{common('object.objectParent')}</FormLabel>
            <SelectPortal
              options={listObject.data ?? []}
              onChange={(e) => handleChangeParent(e)}
              value={watch('parentId')}
            />
          </div>
        </div>
        <div className="mt-4">
          <FormLabel required>{common('name')}</FormLabel>
          <Input
            {...register('name')}
            feedbackInvalid={errors?.name?.message}
            classNameContainer="mt-2"
            placeholder={common('name')}
            hiddenClose
            onChange={(event) => handleChangeName(event)}
            name="name"
          />
          {errors?.name?.message && <FormHelperText error>{error(errors?.name?.message)}</FormHelperText>}
        </div>
        <div className="mt-4">
          <FormLabel required>{common('code')}</FormLabel>
          <Input
            feedbackInvalid={errors?.code?.message}
            {...register('code')}
            onChange={(event) => {
              event.target.value = event.target.value.toUpperCase();
            }}
            classNameContainer="mt-2"
            placeholder={common('code')}
            hiddenClose
            name="code"
          />
          {errors?.code?.message && <FormHelperText error>{error(errors?.code?.message)}</FormHelperText>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModel()} color="stroke" variant="outlined">
          {common('cancel')}
        </Button>
        <Button
          loading={editObjectMutation.isLoading || createObjectMutation.isLoading}
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
