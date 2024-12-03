import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { CreateOrUpdateRoleForm } from '@/components/roles/CreateOrUpdateRoleForm';
import ModalSynchronizePermissionsForWorkspaces from '@/components/roles/dialog/ModalSynchronizePermissionsForWorkspaces';
import { LocaleNamespace } from '@/constants/enums/common';
import { REGEX_ROLE_CODE, REGEX_ROLE_NAME } from '@/constants/variables/regexException';
import { useApp } from '@/hooks/use-app';
import { updateRole } from '@/services/user-management/role';
import { FormRole, RoleAccessDataTypeEnum, UpdateRoleRequest } from '@/types/user-management/role';
import { responseErrorCode } from '@/utils/common';
import { SetStateAction, useState } from 'react';

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [isShowModelSyncPermission, setIsShowModelSyncPermission] = useState(false);
  const [isAppliesToAllWorkspaces, setIsAppliesToAllWorkspaces] = useState(false);
  const [dataForm, setDataForm] = useState<FormRole>();

  const schema = yup
    .object()
    .shape({
      applicationId: yup.string().required(error('fieldRequired')),
      code: yup
        .string()
        .required(error('fieldRequired'))
        .min(3, error('role.form.message.codeOrNameInValid'))
        .max(250, error('role.form.message.codeOrNameInValid'))
        .matches(REGEX_ROLE_CODE, {
          message: error('role.form.message.codeOrNameInValid'),
        })
        .trim(),
      name: yup
        .string()
        .required(error('fieldRequired'))
        .min(3, error('role.form.message.codeOrNameInValid'))
        .max(250, error('role.form.message.codeOrNameInValid'))
        .matches(REGEX_ROLE_NAME, {
          message: error('role.form.message.codeOrNameInValid'),
        })
        .trim(),
      description: yup
        .string()
        .notRequired()
        .when({
          is: (val: string) => !!val,
          then: () =>
            yup
              .string()
              .required()
              .min(3, error('role.form.message.descriptionInValid'))
              .max(250, error('role.form.message.descriptionInValid'))
              .trim(),
          otherwise: () => yup.string(),
        }),
    })
    .required();

  const methods = useForm<FormRole>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      accessDataType: RoleAccessDataTypeEnum.AllData,
    },
  });

  const editRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      showToast({
        type: 'success',
        summary: t('role.editRoleSuccessfully'),
      });
      navigate('/user-and-roles/roles');
    },
    onError: (err: any) => {
      const { errorNormal, errorFrom } = err;
      if (errorNormal && errorNormal === 'nameExisted') {
        methods.setError('name', { message: error('nameExisted') });
      }
      if (errorNormal && errorNormal === 'codeExisted') {
        methods.setError('code', { message: error('role.roleCodeExisted', { role_code: methods.getValues('code') }) });
      }
      if (errorFrom) {
        responseErrorCode(err.errorFrom).forEach(({ name, message, type }) => {
          const mess = error(message);
          methods.setError(name, { type, message: mess });
        });
      }
    },
  });

  const submitData = (data: FormRole) => {
    if (!data.permissionIds || data.permissionIds.length === 0) {
      showToast({
        type: 'error',
        summary: t('role.youMustChooseAtLeastOnePermissionForThisRole'),
      });
      return;
    }
    setDataForm(data);
    setIsShowModelSyncPermission(true);
  };

  const onHandleSyncModel = (input: SetStateAction<boolean>) => {
    setIsShowModelSyncPermission(false);
    if (input == false || !dataForm) return;

    const editRoleRequest = {
      id: id,
      applicationId: dataForm.applicationId,
      code: dataForm.code,
      name: dataForm.name,
      isDefault: dataForm.isDefault,
      isSystem: true,
      accessDataType: Number(dataForm.accessDataType),
      permissionIds: dataForm.permissionIds,
      description: dataForm.description,
      isAppliesToAllWorkspaces: isAppliesToAllWorkspaces,
    } as UpdateRoleRequest;
    editRoleMutation.mutate(editRoleRequest);
  };
  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('role.edit')}</span>
        </button>
      }
      right={
        <div className="flex items-center gap-x-3">
          <Button onClick={() => navigate(-1)} color="danger" variant="outlined">
            <SvgIcon icon="close-circle" width={20} height={20} />
            <p className="ml-1">{t('cancel')}</p>
          </Button>

          <Button variant="outlined" onClick={methods.handleSubmit(submitData)}>
            <SvgIcon icon="save" width={20} height={20} />
            <p className="ml-1">{t('save')}</p>
          </Button>
        </div>
      }
    >
      <div className="scroll h-[calc(100vh_-_100px)] flex flex-col overflow-y-auto">
        <div className="flex justify-center p-6">
          <FormProvider {...methods}>
            <CreateOrUpdateRoleForm id={id} />
          </FormProvider>
        </div>
        <ModalSynchronizePermissionsForWorkspaces
          open={isShowModelSyncPermission}
          setOpen={onHandleSyncModel}
          isAppliesToAllWorkspaces={isAppliesToAllWorkspaces}
          setIsAppliesToAllWorkspaces={setIsAppliesToAllWorkspaces}
        ></ModalSynchronizePermissionsForWorkspaces>
      </div>
    </LayoutSection>
  );
};

export default EditRole;
