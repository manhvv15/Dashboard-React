import { Dispatch, SetStateAction, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { buildTrees } from '@/services/configuration';

import { DataPlanInformationRequest, PlanFunctionConfigurationRequest, PlanPermissionDto } from '@/types/common';
import { update } from 'lodash';
import { TreePermissionByAppForm } from './TreePermissionByAppForm';

interface Props {
  dataPlanInformation: DataPlanInformationRequest | undefined;
  planPermissions: PlanPermissionDto[] | undefined;
  setDataPlanFunctionConfiguration: Dispatch<SetStateAction<PlanFunctionConfigurationRequest[] | undefined>>;
}

const PlanFunctionConfiguration = ({
  dataPlanInformation,
  setDataPlanFunctionConfiguration,
  planPermissions,
}: Props) => {
  const [apps, setApps] = useState<PlanFunctionConfigurationRequest[]>([]);
  useQuery({
    queryKey: ['buildTrees', dataPlanInformation?.applicationIds],
    queryFn: () => buildTrees(dataPlanInformation?.applicationIds ?? []),
    enabled: !!dataPlanInformation?.applicationIds?.length,
    onSuccess: (data) => {
      let app = data.data.map(
        (el) =>
          ({
            applicationId: el.applicationId,
            applicationName: el.applicationName,
            logoUrl: el.logoUrl,
            permissionIds: planPermissions?.filter((x) => x.applicationId == el.applicationId)[0]?.permissionIds || [],
            treeNodes: el.treeNodes,
          }) as PlanFunctionConfigurationRequest,
      );
      setApps(app);
    },
  });

  const onHandleChangePermission = (
    index: number,
    input: SetStateAction<string[] | undefined>,
    app: PlanFunctionConfigurationRequest,
  ) => {
    let currentApp = {
      ...app,
      permissionIds: input,
    };
    const newArray = update(apps, `[${index}]`, () => currentApp);
    setApps(newArray);
    setDataPlanFunctionConfiguration(newArray);
  };
  return (
    <>
      {apps &&
        apps.map((app, index) => (
          <TreePermissionByAppForm
            application={app}
            key={index}
            permissionSelected={app.permissionIds || []}
            setPermissionSelected={(data) => onHandleChangePermission(index, data, app)}
          />
        ))}
    </>
  );
};

export default PlanFunctionConfiguration;
