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
  Textarea,
} from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { REGEX_ORGANIZATION_CODE } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { getDetailOrganization, updateOrganization } from '@/services/user-management/organization';
import { responseErrorCode } from '@/utils/common';

interface Props {
  id?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface FormData {
  id?: string;
  code: string;
  name: string;
  order?: number;
  parentId?: string;
  userIds: string[];
  description?: string | null;
}

const ModalEditGroupRole = ({ id, open, setOpen }: Props) => {
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
    queryKey: ['getDetailOrganizationById', id],
    queryFn: () =>
      getDetailOrganization({
        id: id ?? '',
        workspaceId: null,
      }),
    onSuccess: (data) => {
      setValue('id', data.data.id);
      setValue('code', data.data.code);
      setValue('name', data.data.name);
      setValue('order', data.data.order);
      setValue('description', data.data.description);
    },
    enabled: !!id && open,
  });

  const editOrganizationMutation = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: common('editGroupRoleSuccessfully'),
      });
      responseSuccess();
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorNormal && errorNormal === 'organizationCodeExisted') {
        setError('code', { message: error('organizationCodeExisted') });
      }
      if (errorNormal && errorNormal === 'organizationNameExisted') {
        setError('name', { message: error('organizationNameExisted') });
      }

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
    editOrganizationMutation.mutate({
      id: data.id ?? '',
      code: data.code,
      name: data.name,
      order: data.order,
      description: data.description,
    });
    return;
  };

  const responseSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries(['getDetailOrganizationById', id]);
    queryClient.invalidateQueries(['getOrganizationPaging']);
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
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    const processedString = capitalizedWords.join('');

    return processedString;
  };
  return (
    <Dialog
      size="md"
      open={open}
      handler={setOpen}
      dismiss={{
        outsidePress: false,
      }}
    >
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('editGroupInfo')}</p>
        <button onClick={() => handleCloseModel()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="mt-4 col-span-3">
          <FormLabel required>{common('organization.name')}</FormLabel>
          <Input
            {...register('name')}
            feedbackInvalid={errors?.name?.message}
            classNameContainer="mt-2"
            placeholder={common('organization.name')}
            hiddenClose
            name="name"
            onChange={handleChangeName}
          />
          {errors?.name?.message && <FormHelperText error>{error(errors?.name?.message)}</FormHelperText>}
        </div>
        <div className="mt-4">
          <FormLabel>{common('description')}</FormLabel>
          <Textarea
            {...register('description')}
            feedbackInvalid={errors?.order?.message}
            placeholder={common('description')}
            rows={4}
          />
          {errors?.order?.message && <FormHelperText error>{error(errors?.order?.message)}</FormHelperText>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModel()} color="stroke" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={editOrganizationMutation.isLoading} onClick={handleSubmit(submitData)}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalEditGroupRole;
