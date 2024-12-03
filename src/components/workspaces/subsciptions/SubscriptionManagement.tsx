import { LocaleNamespace } from '@/constants/enums/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import ModalAvailablePlansByWorkspace from '../dialog/ModalAvailablePlansByWorkspace';
import SubscriptionDetail from './SubscriptionDetail';
import TableSubscription from './TableSubscription';
interface IProp {
  workspaceId: string;
}
const SubscriptionManagement = ({ workspaceId }: IProp) => {
  const [searchParams] = useSearchParams();
  const [isOpenAvailablePlans, setIsOpenAvailablePlan] = useState(false);
  const applicationId = searchParams.get('id');
  const subscriptionId = searchParams.get('subscriptionId');
  const isShowDetail = applicationId && subscriptionId;
  const { t: common } = useTranslation(LocaleNamespace.Common);

  return (
    <div className="mt-2">
      <div className="flex font-medium justify-between my-2 text-sm">
        <div>{common('subscriptions')}</div>
        <div className="text-sm text-ic-primary-6s cursor-pointer" onClick={() => setIsOpenAvailablePlan(true)}>
          {common('addSubscription')}
        </div>
      </div>
      {isShowDetail ? (
        <SubscriptionDetail applicationId={applicationId} subscriptionId={subscriptionId} workspaceId={workspaceId} />
      ) : (
        <TableSubscription workspaceId={workspaceId} />
      )}
      <ModalAvailablePlansByWorkspace
        id={workspaceId}
        open={isOpenAvailablePlans}
        setOpen={setIsOpenAvailablePlan}
      ></ModalAvailablePlansByWorkspace>
    </div>
  );
};

export default SubscriptionManagement;
