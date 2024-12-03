import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { ModalCancelCreateService } from '@/components/configuration/modal/ModalCancelCreateService';
import { CreateOrEditServiceModelForm } from '@/components/configuration/service-model/CreateOrEditServiceModelForm';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { detailServiceModel, editServiceModel } from '@/services/configuration';
import { FormServiceModel } from '@/types/common';

const DetailServiceModels = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();

  const { id } = useParams();

  const navigate = useNavigate();

  const [openModel, setOpenModel] = useState(false);

  const schema = yup
    .object({
      name: yup.string().required('fieldRequired'),
      unit: yup.string().required('fieldRequired'),
      type: yup.number().required('fieldRequired'),
      agrregationType: yup.number().required('fieldRequired'),
    })
    .required();

  const methods = useForm<FormServiceModel>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { handleSubmit, setValue } = methods;

  const { isLoading } = useQuery({
    queryKey: ['detailServiceModel', id],
    queryFn: () => detailServiceModel(id as string),
    enabled: !!id,
    onSuccess: (res) => {
      const data = res.data;
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('unit', data.unit);
      setValue('agrregationType', data.agrregationType);
      setValue('type', data.type);
    },
  });

  const editMutation = useMutation({
    mutationFn: editServiceModel,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('updateServiceModelSuccess') });
      navigate('/configuration/service-models');
    },
    onError: () => {
      showToast({ type: 'error', summary: error('updateServiceModelFail') });
    },
  });

  const onSubmit = (data: FormServiceModel) => {
    editMutation.mutate({ ...data, id: id as string });
  };

  return (
    <LayoutSection
      label={
        <button onClick={() => setOpenModel(true)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={20} height={20} className="text-ic-ink-6s" />
          <p className="ml-1 ">{common('serviceModel')}</p>
        </button>
      }
      right={
        <div className="flex gap-2">
          <Button loading={editMutation.isLoading} className="w-20" onClick={handleSubmit(onSubmit)}>
            {common('save')}
          </Button>
        </div>
      }
    >
      <LoadingOverlay className="w-full h-full" isLoading={isLoading}>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1000px] bg-ic-white-6s rounded-lg border border-ic-ink-2s p-4">
            <div className="px-4 py-2 bg-ic-light">
              <p className="text-lg font-medium text-ic-ink-6s">{common('editAServiceModel')}</p>
            </div>
            <CreateOrEditServiceModelForm methods={methods} />
          </div>
          <ModalCancelCreateService open={openModel} setOpen={setOpenModel} />
        </div>
      </LoadingOverlay>
    </LayoutSection>
  );
};

export default DetailServiceModels;
