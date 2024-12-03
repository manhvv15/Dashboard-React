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
  MultipleSelect,
  SelectPortal,
  Textarea,
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
import { createOrganization } from '@/services/user-management/organization';
import { getUserSystemPaging } from '@/services/user-management/user';
import { responseErrorCode } from '@/utils/common';
import { useNavigate } from 'react-router-dom';

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
  isSystem: boolean;
  parentId?: string;
  userIds: string[];
  description?: string;
}

const ModalCreateGroupRole = ({ open, setOpen }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);

  const supportsOptions = [
    { value: true, label: common('forSystem') },
    { value: false, label: common('forWorkspace') },
  ];

  const { showToast } = useApp();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    getValues,
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
    defaultValues: {
      isSystem: false,
    },
  });

  const navigate = useNavigate();
  const createOrganizationMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: (data: AxiosResponse<string>) => {
      showToast({
        type: 'success',
        summary: common('createGroupRoleSuccessfully'),
      });

      navigate(`detail/${data.data}`);
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
    createOrganizationMutation.mutate({
      code: data.code,
      name: data.name,
      description: data.description,
      userIds: getValues('userIds'),
      order: data.order,
      isSystem: data.isSystem,
    });
    return;
  };

  const responseSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries(['getOrganizationPaging']);
    reset();
  };

  const handleCloseModel = () => {
    reset();
    setOpen(false);
  };

  const usersAvailable =
    useQuery({
      queryKey: ['getUsersAvailableOrganization'],
      queryFn: () =>
        getUserSystemPaging({
          pageNumber: 0,
          pageSize: 100,
          keyword: '',
          status: null,
          organizationIds: [],
          roleIds: [],
        }),
      retry: true,
      enabled: open,
    }).data?.data.items ?? [];

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

  const handleChangeSupport = (data: boolean) => {
    setValue('isSystem', data);
  };

  const handleChangeOrganizations = (data?: any) => {
    setValue('userIds', data);
  };

  return (
    <Dialog
      open={open}
      handler={setOpen}
      dismiss={{
        outsidePress: false,
      }}
      size="md"
    >
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('createGroupRole')}</p>
        <button onClick={() => handleCloseModel()}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="mt-4">
          <FormLabel required>{common('support')}</FormLabel>
          <SelectPortal
            placeholder={common('support')}
            options={supportsOptions ?? []}
            onChange={(e: any) => handleChangeSupport(e)}
            searchable={false}
            value={watch('isSystem')}
          />
        </div>

        <div className="mt-4 col-span-3">
          <FormLabel required>{common('organization.name')}</FormLabel>
          <Input
            {...register('name')}
            feedbackInvalid={errors?.name?.message}
            classNameContainer="mt-2"
            hiddenClose
            name="name"
            onChange={handleChangeName}
          />
          {errors?.name?.message && <FormHelperText error>{error(errors?.name?.message)}</FormHelperText>}
        </div>

        <>
          {watch('isSystem') && (
            <div className="mt-3">
              <div className="mt-4">
                <FormLabel>{common('groupMember')}</FormLabel>
                <MultipleSelect
                  options={
                    usersAvailable.map((el) => ({
                      label: el.email ?? el.fullName,
                      value: el.id,
                    })) ?? []
                  }
                  placeholder={common('groupMember')}
                  onChange={(e) => handleChangeOrganizations(e)}
                  className="w-full"
                ></MultipleSelect>
              </div>
            </div>
          )}
        </>

        <div className="mt-4">
          <FormLabel>{common('description')}</FormLabel>
          <Textarea
            {...register('description')}
            feedbackInvalid={errors?.order?.message}
            placeholder={common('description')}
          />
          {errors?.order?.message && <FormHelperText error>{error(errors?.order?.message)}</FormHelperText>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => handleCloseModel()} color="stroke" variant="outlined">
          {common('cancel')}
        </Button>
        <Button loading={createOrganizationMutation.isLoading} onClick={handleSubmit(submitData)}>
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalCreateGroupRole;
