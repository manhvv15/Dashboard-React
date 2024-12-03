import { SetStateAction, useState } from 'react';

import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';

import { ModalCancelCreatePlan } from '@/components/configuration/modal/ModalCancelCreatePlan';
import PlanFunctionConfiguration from '@/components/configuration/plan/PlanFunctionConfiguration';
import PlanInformationForm from '@/components/configuration/plan/PlanInformationForm';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { createPlan, detailPlan } from '@/services/configuration';
import {
  DataPlanInformationRequest,
  PlanFunctionConfigurationRequest,
  PlanPermissionDto,
  ScreenPlanEnum,
} from '@/types/common';
import { useNavigate, useParams } from 'react-router-dom';

export type typeStepPlan = 1 | 2;

const DuplicatePlan = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalCancel, setModalCancel] = useState(false);
  const { showToast } = useApp();

  const [dataPlanInformation, setDataPlanInformation] = useState<DataPlanInformationRequest>();
  const [dataFunctionConfiguration, setDataFunctionConfiguration] = useState<PlanFunctionConfigurationRequest[]>();
  const [nextStep, setNextStep] = useState<typeStepPlan>(1);

  const createPlanMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('createPlanSuccess') });
      navigate('/configuration/plans');
    },
    onError: () => {
      showToast({ type: 'error', summary: error('createPlanFail') });
    },
  });

  const onSavePlan = () => {
    createPlanMutation.mutate({
      name: dataPlanInformation?.name ?? '',
      description: dataPlanInformation?.description,
      applicationIds: dataPlanInformation?.applicationIds ?? [],
      isDefault: dataPlanInformation?.isDefault,
      limitation: dataPlanInformation?.limitation,
      planPermissions:
        dataFunctionConfiguration?.map(
          (el) =>
            ({
              applicationId: el.applicationId,
              permissionIds: el.permissionIds,
            }) as PlanPermissionDto,
        ) ?? [],
    });
  };

  const onHandleChangePermissons = (data: SetStateAction<PlanFunctionConfigurationRequest[] | undefined>) => {
    setDataFunctionConfiguration(data);
  };

  const onHandleSetDataPlanInformation = (data: SetStateAction<DataPlanInformationRequest | undefined>) => {
    setDataPlanInformation(data);
  };

  const planDetail = useQuery({
    queryKey: ['detailPlan', id],
    queryFn: () => detailPlan(id as string),
    onSuccess: (res) => {
      const data = res.data;
      setDataPlanInformation({
        name: data?.name,
        code: data?.code,
        description: data?.description,
        applicationIds: data?.applicationIds,
        status: data.status,
        isDefault: data.isDefault,
        limitation: data.limitation,
      });
    },
    enabled: !!id,
  }).data?.data;
  return (
    <LayoutSection
      label={
        <button onClick={() => setModalCancel(true)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={20} height={20} className="text-ic-ink-6s" />
          <p className="ml-1 ">{common('createPlan')}</p>
        </button>
      }
      right={
        <div className="flex gap-2">
          {nextStep === 2 && (
            <>
              <Button onClick={() => setNextStep(1)} variant="outlined" className="flex items-center">
                <SvgIcon icon="arrow-left" width={20} height={20} />
                <p className="ml-1">{common('back')}</p>
              </Button>
              <Button loading={createPlanMutation.isLoading} onClick={onSavePlan} className="w-20">
                <p>{common('save')}</p>
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="w-full flex justify-center">
        <div className="max-w-[1000px]  border border-ic-ink-2s w-full bg-ic-white-6s rounded-lg p-4">
          <div className={clsx(nextStep === 1 ? 'block' : 'hidden')}>
            <PlanInformationForm
              setNextStep={setNextStep}
              setDataPlanInformation={onHandleSetDataPlanInformation}
              planDetail={planDetail}
              screenType={ScreenPlanEnum.Duplicate}
            />
          </div>
          <div className={clsx('w-full ', nextStep === 2 ? 'block' : 'hidden')}>
            <PlanFunctionConfiguration
              setDataPlanFunctionConfiguration={onHandleChangePermissons}
              dataPlanInformation={dataPlanInformation}
              planPermissions={planDetail?.planPermissions}
            />
          </div>
        </div>
      </div>
      <ModalCancelCreatePlan open={modalCancel} setOpen={setModalCancel} />
    </LayoutSection>
  );
};

export default DuplicatePlan;
