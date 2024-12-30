import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import ModalCreateAndEditMultiple from '@/components/permissions/dialog/ModalCreateAndEditMultiple';
import { CreatePermissionMultiple, PermissionMultiple } from '@/types/user-management/permission';

const CreateMultiplePermission = () => {
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { t } = useTranslation(LocaleNamespace.Common);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    applicationId: yup.string().required(error('fieldRequired')).trim(),
    objectId: yup.string().required(error('fieldRequired')).trim(),
    list: yup.array().of(
      yup.object().shape({
        actionId: yup.string().required(error('fieldRequired')).trim(),
        method: yup.string().nullable(),
        endpoint: yup.string().nullable(),
      }),
    ),
  });

  const methods = useForm<PermissionMultiple>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      applicationId: '',
      objectId: '',
      list: [{ actionId: '', method: null, endpoint: null }],
    },
  });

  const submitData = (data: PermissionMultiple) => {
    console.log('Form submitted:', data);

    const request: CreatePermissionMultiple = {
      applicationId: data.applicationId,
      objectId: data.objectId,
      list: data.list.map((item) => ({
        actionId: item.actionId,
        method: item.method ?? null,
        endpoint: item.endpoint ?? null,
      })),
    };
    console.log('Submit Data:', request);
  };

  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('permission.createMultiple')}</span>
        </button>
      }
      right={
        <div className="flex items-center gap-x-3">
          <Button onClick={() => navigate(-1)} color="danger" variant="outlined">
            <SvgIcon icon="close-circle" width={20} height={20} />
            <p className="ml-1">{t('cancel')}</p>
          </Button>

          <Button
            variant="outlined"
            onClick={methods.handleSubmit(submitData, (errors) => {
              console.log('Validation Errors:', errors);
            })}
          >
            <SvgIcon icon="save" width={20} height={20} />
            <p className="ml-1">{t('save')}</p>
          </Button>
        </div>
      }
    >
      <div className="scroll h-[calc(100vh_-_100px)] flex flex-col overflow-y-auto">
        <div className="flex justify-center p-6">
          <FormProvider {...methods}>
            <ModalCreateAndEditMultiple />
          </FormProvider>
        </div>
      </div>
    </LayoutSection>
  );
};

export default CreateMultiplePermission;
