import { LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useNavigate, useParams } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import { GroupRoleApplications } from '@/components/group-roles/GroupRoleApplications';
import { GroupRoleInformation } from '@/components/group-roles/GroupRoleInformation';
import { GroupRoleUsers } from '@/components/group-roles/GroupRoleUsers';
import LayoutSection from '@/components/layouts/layout-section';
import { getDetailOrganization } from '@/services/user-management/organization';
import { OrganizationByIdResponse } from '@/types/user-management/organization';
import { useState } from 'react';

const DetailGroupRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<OrganizationByIdResponse>();
  const { isLoading } = useQuery({
    queryKey: ['getDetailOrganizationById', id],
    queryFn: () =>
      getDetailOrganization({
        id: id ?? '',
        workspaceId: null,
      }),
    onSuccess: (data) => {
      setOrganization(data.data);
    },
    enabled: !!id,
  });
  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{t('detailGroupRole')}</span>
        </button>
      }
    >
      <LoadingOverlay className="h-full w-full px-2" isLoading={isLoading}>
        <div className="h-full">
          {organization && (
            <>
              <div className="flex justify-center pt-1">
                <GroupRoleInformation organization={organization}></GroupRoleInformation>
              </div>
              {organization.isSystem && (
                <div className="flex justify-center pt-3 flex-1">
                  <GroupRoleUsers organization={organization} isloading={isLoading}></GroupRoleUsers>
                </div>
              )}
              <div className="flex justify-center flex-1 mt-3">
                <GroupRoleApplications organization={organization} isloading={isLoading}></GroupRoleApplications>
              </div>
            </>
          )}
        </div>
      </LoadingOverlay>
    </LayoutSection>
  );
};

export default DetailGroupRole;
