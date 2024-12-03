import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import SvgIcon from '@/components/commons/SvgIcon';
import { ModalCancelCreateService } from '@/components/configuration/modal/ModalCancelCreateService';
import { CreateOrEditServiceModelForm } from '@/components/configuration/service-model/CreateOrEditServiceModelForm';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { createServiceModel } from '@/services/configuration';
import { FormServiceModel, ServiceModelTypeEnum } from '@/types/common';

const CreateServiceModels = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();

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
    defaultValues: {
      type: ServiceModelTypeEnum.Metered,
    },
  });

  const createMutation = useMutation({
    mutationFn: createServiceModel,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('createServiceModelSuccess') });
      navigate('/configuration/service-models');
    },
    onError: () => {
      showToast({ type: 'error', summary: error('createServiceModelFail') });
    },
  });

  const onSubmit = (data: FormServiceModel) => {
    createMutation.mutate(data);
  };

  return (
    <LayoutSection
      label={
        <button onClick={() => setOpenModel(true)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={20} height={20} className="text-ic-ink-6s" />
          <p className="ml-1 ">{common('createService')}</p>
        </button>
      }
      right={
        <div className="flex gap-2">
          <Button loading={createMutation.isLoading} className="w-20" onClick={methods.handleSubmit(onSubmit)}>
            {common('save')}
          </Button>
        </div>
      }
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1000px] bg-ic-white-6s rounded-lg border border-ic-ink-2s p-4">
          <div className="px-4 py-2 bg-ic-light">
            <p className="text-lg font-medium text-ic-ink-6s">{common('createAServiceModel')}</p>
          </div>
          <CreateOrEditServiceModelForm methods={methods} />
        </div>
        <ModalCancelCreateService open={openModel} setOpen={setOpenModel} />
      </div>
    </LayoutSection>
  );
};

export default CreateServiceModels;
