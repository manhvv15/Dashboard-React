import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { useApp } from '@/hooks/use-app';
import {
  calculationsFeePlans,
  createMultipleSubscription,
  getAvailablePlansByWorkspace,
} from '@/services/user-management/workspace';
import { CalculateFeeMultipleResponse } from '@/types/user-management/workspace';
import { formatNumber } from '@/utils/common';

interface Props {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalAvailablePlansByWorkspace = ({ id, open, setOpen }: Props) => {
  const { showToast } = useApp();
  const queryClient = useQueryClient();
  const { t: common } = useTranslation(LocaleNamespace.Common);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const [planIds, setPlanIds] = useState<string[]>([]);

  const createMultipleSubscriptionMutation = useMutation({
    mutationFn: createMultipleSubscription,
  });

  const plans =
    useQuery({
      queryKey: ['getAvailablePlansByWorkspace', id],
      queryFn: () => getAvailablePlansByWorkspace(id),
      enabled: !!id && open,
      onSuccess: (response) => {
        const ids = response.data.map((el) => el.planId);
        setPlanIds(ids);
      },
      retry: true,
    }).data?.data ?? [];

  const [planFees, setPlanFees] = useState<CalculateFeeMultipleResponse[]>([]);
  // Danh sách bảng giá của plan
  useQuery({
    queryKey: ['calculateFeeMultiple', planIds],
    queryFn: () =>
      calculationsFeePlans({
        currencyCode: 'VND',
        planIds: planIds,
        customerId: null,
        includeConfig: true,
      }),
    enabled: !!planIds,
    onSuccess: (res) => {
      const newData = res.data
        ?.reduce((result, el) => {
          const item = plans.find((x) => x.planId === el.planId);
          if (item != null && el.fee?.feePeriod != null) {
            result.push({
              ...el,
              planName: item.planName ?? '',
              applicationName: item.applicationName,
              applicationId: item.applicationId,
            });
          }
          return result;
        }, [] as CalculateFeeMultipleResponse[])
        .sort((a, b) => {
          if (a.applicationName < b.applicationName) {
            return -1;
          }
          if (a.applicationName > b.applicationName) {
            return 1;
          }
          return 0;
        });
      setPlanFees(newData);
    },
  });

  const onSubmitConfirm = () => {
    createMultipleSubscriptionMutation.mutate(
      {
        workspaceId: id,
        plans: plansSelected.map((el) => ({
          applicationId: el.applicationId,
          feeId: el.fee.feeId,
          planId: el.planId,
        })),
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: common('addSubscriptionSuccessfully'),
          });
          queryClient.invalidateQueries(['getApplicationsByWorkspace', id]);
          setOpen(false);
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: error('somethingWentWrongPleaseTryAgain'),
          });
          setOpen(false);
        },
      },
    );
  };

  const [planIdsSelected, setPlanIdsSelected] = useState<string[]>([]);
  const [plansSelected, setPlansSelected] = useState<CalculateFeeMultipleResponse[]>([]);

  const handleChangePlans = (event: ChangeEvent<HTMLInputElement>) => {
    let updatedList = [...planIdsSelected];
    if (event.target.checked) {
      let currentPlanId = event.target.value;
      let currentPlan = planFees.filter((x) => x.planId == currentPlanId)[0];
      if (!!currentPlan) {
        let app = plansSelected.filter((x) => x.applicationId === currentPlan.applicationId)[0];
        if (!!app) {
          updatedList = updatedList.filter((id) => id !== app.planId);
        }
        updatedList.push(event.target.value);
      }
    } else {
      updatedList.splice(planIdsSelected.indexOf(event.target.value), 1);
    }
    let plansActive = planFees.filter((x) => updatedList.findIndex((i) => i == x.planId) != -1);
    setPlansSelected(plansActive);
    setPlanIdsSelected(updatedList);
  };

  return (
    <Dialog size="sm" open={open} handler={setOpen}>
      <DialogHeader className="flex items-center justify-between">
        <p className="text-lg font-medium leading-5 text-ic-ink-6s">{common('avaiablePlanList')}</p>
        <button onClick={() => setOpen(false)}>
          <SvgIcon icon="close" width={20} height={20} className="text-ic-ink-6s" />
        </button>
      </DialogHeader>
      <DialogBody className="w-full">
        <div className="relative w-full shadow-1 mt-4 rounded-md overflow-hidden">
          <table className="table w-full bg-white text-sm">
            <thead className="border-b-2 border-ic-ink-2 bg-ic-ink-1s table table-fixed w-full">
              <tr>
                <th
                  className="py-3 px-3 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%]  before:bg-ic-ink-2s before:right-0 before:top-[50%] before:translate-y-[-50%]"
                  align="left"
                >
                  <span className="text-sm font-medium">{common('plan')}</span>
                </th>
                <th
                  className="py-3 px-3 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%]  before:bg-ic-ink-2s before:right-0 before:top-[50%] before:translate-y-[-50%]"
                  align="left"
                >
                  <span className="text-sm font-medium">{common('application')}</span>
                </th>
                <th className="py-3 px-3" align="left">
                  <span className="text-sm font-medium">{common('price')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="scroll block w-full overflow-y-auto">
              {planFees &&
                planFees?.map((item) => {
                  return (
                    <tr
                      key={`${item.planId}`}
                      className="border-b border-ic-ink-2s  last:border-none table-fixed table w-full"
                    >
                      <td
                        className="px-3 py-2 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%] before:bg-ic-ink-2s before:right-0 before:top-[50%] before:translate-y-[-50%]"
                        align={'left'}
                      >
                        <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
                          <Checkbox
                            value={item.planId}
                            onChange={handleChangePlans}
                            checked={planIdsSelected.findIndex((x) => x == item.planId) !== -1}
                          />
                          <div className="mx-2">{item.planName}</div>
                        </div>
                      </td>
                      <td
                        className="px-3 py-2 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%] before:bg-ic-ink-2s before:right-0 before:top-[50%] before:translate-y-[-50%]"
                        align={'left'}
                      >
                        <div className="text-sm font-normal leading-5 text-ic-ink-6s h-full flex items-center">
                          <div className="mx-2">{item.applicationName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 relative before:content-[''] before:absolute before:w-[1px] before:h-[60%] before:right-0 before:top-[50%] before:translate-y-[-50%]">
                        <div className="flex flex-col">
                          {formatNumber(item.fee.feePeriod.amount ?? 0)} {item.fee.feePeriod.currencyCode}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          {common('cancel')}
        </Button>
        <Button
          loading={createMultipleSubscriptionMutation.isLoading}
          className="ml-1"
          onClick={onSubmitConfirm}
          color="primary"
          disabled={plansSelected.length == 0}
        >
          {common('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ModalAvailablePlansByWorkspace;
