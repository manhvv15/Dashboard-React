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
import { LocaleNamespace, StatusPlanEnum } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { detailPlan, editPlan } from '@/services/configuration';
import {
  DataPlanInformationRequest,
  PlanFunctionConfigurationRequest,
  PlanPermissionDto,
  ScreenPlanEnum,
} from '@/types/common';
import { useNavigate, useParams } from 'react-router-dom';

export type typeStepPlan = 1 | 2;

const tabs = [
  { label: 'information', value: 1 as typeStepPlan },
  { label: 'functionConfiguration', value: 2 as typeStepPlan },
];

const EditPlan = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { id } = useParams();

  const navigate = useNavigate();
  const [dataPlanInformation, setDataPlanInformation] = useState<DataPlanInformationRequest>();
  const [dataFunctionConfiguration, setDataFunctionConfiguration] = useState<PlanFunctionConfigurationRequest[]>();
  const [nextTab, setNextTab] = useState<typeStepPlan>(1);

  const [modalCancel, setModalCancel] = useState(false);
  const { showToast } = useApp();

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

  const editPlanMutation = useMutation({
    mutationFn: editPlan,
    onSuccess: () => {
      showToast({ type: 'success', summary: common('updatePlanSuccess') });
      navigate('/configuration/plans');
    },
    onError: () => {
      showToast({ type: 'error', summary: error('updatePlanFail') });
    },
  });

  const onSavePlan = () => {
    editPlanMutation.mutate({
      id: id || '',
      name: dataPlanInformation?.name ?? '',
      description: dataPlanInformation?.description,
      status: dataPlanInformation?.status ?? StatusPlanEnum.Active,
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

  const onHandleSetNextStep = () => {};
  return (
    <LayoutSection
      label={
        <button onClick={() => setModalCancel(true)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={20} height={20} className="text-ic-ink-6s" />
          <p className="ml-1 ">{common('planManagement')}</p>
        </button>
      }
      right={
        <div className="flex gap-2">
          <Button loading={editPlanMutation.isLoading} onClick={onSavePlan} className="">
            <SvgIcon icon="save" width={20} height={20} />
            <p className="ml-1">{common('save')}</p>
          </Button>
        </div>
      }
    >
      <div className="w-full flex justify-center">
        <div className="max-w-[1000px] border border-ic-ink-2s w-full bg-ic-white-6s rounded-lg p-2">
          {tabs.map((i) => {
            return (
              <button
                onClick={() => setNextTab(i.value)}
                key={i.value}
                className={clsx(
                  'text-sm  px-4 py-3',
                  i.value === nextTab
                    ? 'text-ic-primary-6s border-b-2 border-ic-primary-6s font-medium'
                    : 'text-ic-ink-6s font-normal',
                )}
              >
                {common(i.label)}
              </button>
            );
          })}
          <div className={clsx(nextTab === 1 ? 'block' : 'hidden')}>
            <div className="rounded-lg mt-3 p-4">
              <PlanInformationForm
                setNextStep={onHandleSetNextStep}
                setDataPlanInformation={onHandleSetDataPlanInformation}
                planDetail={planDetail}
                screenType={ScreenPlanEnum.Edit}
              />
            </div>
          </div>
          <div className={clsx('w-full ', nextTab === 2 ? 'block' : 'hidden')}>
            <div className="rounded-lg mt-3 p-4">
              <PlanFunctionConfiguration
                setDataPlanFunctionConfiguration={onHandleChangePermissons}
                dataPlanInformation={dataPlanInformation}
                planPermissions={planDetail?.planPermissions}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalCancelCreatePlan open={modalCancel} setOpen={setModalCancel} />
    </LayoutSection>
  );
};

export default EditPlan;
