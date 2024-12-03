import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import HistoryLogs from '@/components/workspaces/history-logs/HistoryLogs';
import SubscriptionManagement from '@/components/workspaces/subsciptions/SubscriptionManagement';
import WrokspaceInformation from '@/components/workspaces/WorkspaceInformation';
import { LocaleNamespace } from '@/constants/enums/common';

const WorkspaceDetail = () => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const navigate = useNavigate();

  const { id } = useParams();
  if (id == null) return;

  return (
    <LayoutSection
      label={
        <button onClick={() => navigate(-1)} className="flex items-center">
          <SvgIcon icon="arrow-left" width={24} height={24} className="text-ic-ink-6s" />
          <span className="ml-1 text-base font-medium leading-6 text-ic-ink-6s">{common('workspaces')}</span>
        </button>
      }
    >
      <div className="w-full p-2 flex justify-center flex-col">
        <WrokspaceInformation workspaceId={id}></WrokspaceInformation>
        <SubscriptionManagement workspaceId={id}></SubscriptionManagement>
        <HistoryLogs workspaceId={id}></HistoryLogs>
      </div>
    </LayoutSection>
  );
};

export default WorkspaceDetail;
