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
import { createAction, getActionById, updateAction } from '@/services/user-management/action';
import { ActionByIdResponse } from '@/types/user-management/action';
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
  displayOrder?: number;
}

const ModalCreateAndEdit = ({ type, id, open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const { showToast } = useApp();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup
        .object()
        .shape({
          code: yup
            .string()
            .required(error('fieldRequired'))
            .matches(REGEX_ORGANIZATION_CODE, error('validateOrganizationCodeRule'))
            .min(3, error('validateOrganizationCodeLength'))
            .max(50, error('validateOrganizationCodeLength'))
            .trim(),
          name: yup
            .string()
            .required(error('fieldRequired'))
            .min(3, error('validateOrganizationNameRule'))
            .max(250, error('validateOrganizationNameRule'))
            .trim(),
        })
        .required(),
    ),
  });

  useQuery({
    queryKey: ['getActionById', id],
    queryFn: () => getActionById(id as string),
    enabled: !!id && open,
    onSuccess: (data: AxiosResponse<ActionByIdResponse>) => {
      setValue('id', data.data.id);
      setValue('code', data.data.code);
      setValue('name', data.data.name);
      setValue('displayOrder', data.data.displayOrder);
    },
  });

  const createActionMutation = useMutation({
    mutationFn: createAction,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('createActionSuccessfully'),
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

  const editActionMutation = useMutation({
    mutationFn: updateAction,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('editActionSuccessfully'),
      });
      responseSuccess();
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorNormal && errorNormal === 'actionCodeExisted') {
        setError('code', { message: error('actionCodeExisted') });
      }
      if (errorNormal && errorNormal === 'actionNameExisted') {
        setError('name', { message: error('actionNameExisted') });
      }

      if (errorNormal && errorNormal !== 'actionCodeExisted' && errorNormal !== 'actionNameExisted') {
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
      editActionMutation.mutate({
        id: data.id ?? '',
        code: data.code,
        name: data.name,
        displayOrder: data.displayOrder,
      });
      return;
    }
    if (type === 'create') {
      createActionMutation.mutate({ ...data });
      return;
    }
  };

  const responseSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries(['getActionPaging']);
    reset();
  };

  const handleCloseModel = () => {
    reset();
    setOpen(false);
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
          {type == 'create' ? common('create') : common('edit')}
        </p>
        <button onClick={() => handleCloseModel()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div>
          <FormLabel required>{common('name')}</FormLabel>
          <Input
            {...register('name')}
            feedbackInvalid={errors?.name?.message}
            classNameContainer="mt-2"
            placeholder={common('name')}
            hiddenClose
            name="name"
            onChange={(event) => handleChangeName(event)}
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

        <div className="mt-4">
          <FormLabel>{common('orderNumber')}</FormLabel>
          <Input
            {...register('displayOrder')}
            feedbackInvalid={errors?.displayOrder?.message}
            classNameContainer="mt-2"
            placeholder={common('orderNumber')}
            hiddenClose
            type="number"
          />
          {errors?.displayOrder?.message && (
            <FormHelperText error>{error(errors?.displayOrder?.message)}</FormHelperText>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModel()} color="stroke" variant="outlined">
          {common('cancel')}
        </Button>
        <Button
          loading={editActionMutation.isLoading || createActionMutation.isLoading}
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
