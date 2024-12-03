import SvgIcon from '@/components/commons/SvgIcon';
import { useApp } from '@/hooks/use-app';
import { mapSuccessfulBid } from '@/services/bid';
import { BidCustomerValueType, GetWonBidItemsResponse } from '@/types/bid/interface';
import { Button } from '@ichiba/ichiba-core-ui';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MappingNickDropdown } from '../../add-nick/MappingNickDropdown';
import { ConfirmMappingSuccessfulBidDialog } from './ConfirmMappingSuccessfulBidDialog';

interface Props {
  successfulBidId: string;
  dataSource: GetWonBidItemsResponse;
  onSaveSuccessfully: () => void;
}

export const CustomerColumn = (props: Props) => {
  const { onSaveSuccessfully, successfulBidId, dataSource } = props;

  const { t: bid } = useTranslation('bid');

  const [value, setValue] = useState<BidCustomerValueType>({
    label: '',
    value: '',
  });
  const { showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const updateMappingCustomerMutation = useMutation({
    mutationFn: mapSuccessfulBid,
  });
  const isOnlyCreateOrder = !dataSource.orderCode && !!dataSource.customerCode;

  const handleSave = () => {
    if (!value) {
      return;
    }

    setOpen(false);
    const customerId = value.value;
    updateMappingCustomerMutation.mutate(
      {
        data: {
          successfulBidId,
          customerId,
          isOnlyCreateOrder,
        },
      },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            summary: bid('mappingSuccessfulBidSuccessfully'),
          });
          onSaveSuccessfully();
        },
        onError: () => {
          showToast({
            type: 'error',
            summary: 'error',
          });
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  };

  const isDisabled = !value.value;

  const handleChangeCustomer = (selected?: BidCustomerValueType) => {
    if (selected) {
      setValue(selected);
    } else {
      setValue({
        label: '',
        value: '',
      });
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      {isOnlyCreateOrder ? (
        <div className="flex items-center gap-2">
          <div className="w-[185px]">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">{dataSource?.customerCode}</p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">{dataSource.customerName}</p>
          </div>

          <Button type="button" className="relative" onClick={handleOpen} disabled={isLoading} loading={false}>
            {bid('createOrder')}
            {isLoading && (
              <div className="absolute place-content-center inset-0">
                <SvgIcon icon="loading" className="animate-spin" />
              </div>
            )}
          </Button>
          <ConfirmMappingSuccessfulBidDialog
            visible={open}
            dataSource={{
              label: '',
              value: dataSource.customerCode!,
            }}
            onClose={() => setOpen(false)}
            onSave={handleSave}
            onLoading={() => setLoading(true)}
            isOnlyCreateOrder={isOnlyCreateOrder}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1">
            <MappingNickDropdown
              onChange={handleChangeCustomer}
              value={value}
              className="w-[170px]"
              menuClassname="!w-[500px] !z-[99999]"
              placement="bottom-end"
            />
          </div>

          <Button className="relative" onClick={handleOpen} disabled={isDisabled || isLoading} loading={false}>
            {bid('createOrder')}
            {isLoading && (
              <div className="absolute place-content-center inset-0">
                <SvgIcon icon="loading" className="animate-spin" />
              </div>
            )}
          </Button>
          <ConfirmMappingSuccessfulBidDialog
            visible={open}
            dataSource={value}
            onClose={() => setOpen(false)}
            onSave={handleSave}
            onLoading={() => setLoading(true)}
            isOnlyCreateOrder={false}
          />
        </div>
      )}
    </>
  );
};
