import { LocaleNamespace } from '@/constants/enums/common';
import { getCompanyDetail } from '@/services/user-management/workspace';
import { StatusEnum, WorkspaceSizeEnum, WorkspaceTypeEnum } from '@/types/user-management/workspace';
import { LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalDeleteWorkspace from './dialog/ModalDeleteWorkspace';
import ModalUpdateStatusWorkspace from './dialog/ModalUpdateStatusWorkspace';
import WorkspaceStatus from './WorkspaceStatus';

interface IProp {
  workspaceId: string;
}
const WrokspaceInformation = ({ workspaceId }: IProp) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const [isDelete, setIsDelete] = useState(false);
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const { data: companyDetail, isLoading } = useQuery({
    queryKey: ['getCompanyDetail', workspaceId],
    queryFn: () => getCompanyDetail({ workspaceId: workspaceId }),
    enabled: !!workspaceId,
  });

  const GetWorkspaceSizeName = (input: WorkspaceSizeEnum | null | undefined) => {
    if (!input) return '< 50';
    switch (input) {
      case WorkspaceSizeEnum.ExtraSmall:
        return '< 50';
      case WorkspaceSizeEnum.Small:
        return '50 - 100';
      case WorkspaceSizeEnum.Medium:
        return '101 - 250';
      case WorkspaceSizeEnum.Large:
        return '251 - 500';
      case WorkspaceSizeEnum.ExtraLarge:
        return '> 500';
    }
  };
  const GetWorkspaceTypeName = (input: WorkspaceTypeEnum | null | undefined) => {
    if (!input) return 'others';
    switch (input) {
      case WorkspaceTypeEnum.Private:
        return common('privateCompany');
      case WorkspaceTypeEnum.Public:
        return common('publicCompany');
      case WorkspaceTypeEnum.MultiNational:
        return common('multiNationalCompany');
      case WorkspaceTypeEnum.Government:
        return common('govermentCompany');
      case WorkspaceTypeEnum.Other:
        return common('others');
    }
  };
  return (
    <LoadingOverlay className="h-full w-full" isLoading={isLoading}>
      <div className="text-sm font-medium mb-2">{common('workspaceInformation')}</div>
      <div className="w-full flex flex-col bg-ic-white-6s rounded-md p-4">
        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-2">
            <div className="flex flex-col items-center justify-center">
              <img
                src={companyDetail?.data.logoUrl ?? '/static/svg/noDataIcon.svg'}
                alt="logoUrl"
                className="object-cover w-48 h-48 overflow-hidden border-2 rounded-xl border-ic-ink-1s mt-6"
                width={180}
                height={180}
              />
              <div className="mt-2">
                <WorkspaceStatus status={companyDetail?.data.workspaceStatus}></WorkspaceStatus>
              </div>
            </div>
          </div>
          <div className="col-span-7 text-sm text-ic-black-5s">
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('workspaceName')}</div>
              <div className="col-span-2">{companyDetail?.data.workspaceName}</div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('createdBy')}</div>
              <div className="col-span-2">{companyDetail?.data.createdBy}</div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('slug')}</div>
              <div className="col-span-2">{companyDetail?.data.slug}</div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('companyName')}</div>
              <div className="col-span-2">{companyDetail?.data.name}</div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('country')}</div>
              <div className="col-span-2">{companyDetail?.data.countryCode}</div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('address')}</div>
              <div className="col-span-2">{companyDetail?.data.address}</div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('phoneNumber')}</div>
              <div className="col-span-2">
                ({companyDetail?.data.prefixPhoneNumber}) <span>{companyDetail?.data.phoneNumber}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('companyType')}</div>
              <div className="col-span-2">{GetWorkspaceTypeName(companyDetail?.data.type)}</div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('companySize')}</div>
              <div className="col-span-2">{GetWorkspaceSizeName(companyDetail?.data.size)}</div>
            </div>
            <div className="grid grid-cols-3 p-1">
              <div className="col-span-1">{common('numberOfUsers')}</div>
              <div className="col-span-2 text-ic-primary-6s cursor-pointer">
                {companyDetail?.data.numberOfUsers} users
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-sm text-ic-orange-6s cursor-pointer" onClick={() => setIsUpdateStatus(true)}>
              {companyDetail?.data.workspaceStatus == StatusEnum.Active
                ? common('deactiveWorkspace')
                : common('activeWorkspace')}
            </div>
            <div className="text-sm text-ic-red-6s cursor-pointer mt-1" onClick={() => setIsDelete(true)}>
              {common('deleteWorkspace')}
            </div>
          </div>
        </div>

        <ModalDeleteWorkspace
          id={companyDetail?.data.workspaceId ?? ''}
          open={isDelete}
          setOpen={setIsDelete}
        ></ModalDeleteWorkspace>

        <ModalUpdateStatusWorkspace
          id={companyDetail?.data.workspaceId ?? ''}
          open={isUpdateStatus}
          setOpen={setIsUpdateStatus}
          status={companyDetail?.data.workspaceStatus ?? StatusEnum.Active}
        ></ModalUpdateStatusWorkspace>
      </div>
    </LoadingOverlay>
  );
};

export default WrokspaceInformation;
