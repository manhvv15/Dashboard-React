import { Dispatch, SetStateAction } from 'react';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import { cancelSubscription } from '@/services/user-management/workspace';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface Props {
  subscriptionId: string;
  workspaceId: string;
  expirationDate: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalCancelSubscription = ({ subscriptionId, workspaceId, open, setOpen, expirationDate }: Props) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const queryClient = useQueryClient();

  const { showToast } = useApp();

  const cancelSubscriptionMutation = useMutation({
    mutationFn: cancelSubscription,
  });

  const onSubmitConfirm = () => {
    cancelSubscriptionMutation.mutate(
      {
        subscriptionId: subscriptionId,
        workspaceId: workspaceId,
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('subscription.cancelSubscriptionSuccessfully'),
          });
          queryClient.invalidateQueries(['getSubscriptionDetail']);
          setOpen(false);
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: error('subscription.cancelSubscriptionFaild'),
          });
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('subscription.delete')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <p className="text-sm font-normal">
          {common('subscription.deleteDescription', { expiration_date: expirationDate })}
        </p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button
          loading={cancelSubscriptionMutation.isLoading}
          className="ml-3"
          onClick={onSubmitConfirm}
          color="danger"
        >
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalCancelSubscription;
