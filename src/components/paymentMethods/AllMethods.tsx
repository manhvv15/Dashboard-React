import { ChangeEvent, useState } from 'react';

import { Input, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { useDebounceValue } from 'usehooks-ts';

import Empty from '@/public/static/images/empty.png';
import { getAllPaymentMethod } from '@/services/payment-method';

import ItemPayment from './ItemPayment';

import { PaymentProviderCodeEnum } from '@/types/payment-methods/enum';
import SvgIcon from '../commons/SvgIcon';
import ModalAddBidv from './dialogs/ModalAddBidv';
import ModalPayme from './dialogs/ModalPayme';
import ModalPaypal from './dialogs/ModalPaypal';
import ModalStripe from './dialogs/ModalStripe';

const AllMethods = () => {
  const [openPaypal, setOpenPaypal] = useState(false);
  const [openStripe, setOpenStripe] = useState(false);
  const [openPayme, setOpenPayme] = useState(false);
  const [openBidv, setOpenBidv] = useState(false);

  const [searchPayment, setSearchPayment] = useDebounceValue<string | undefined>(undefined, 300);

  const paymentMethodListApi = useQuery({
    queryKey: [getAllPaymentMethod.name, searchPayment],
    queryFn: () => getAllPaymentMethod({ keyword: searchPayment }),
  });

  const paymentMethodList = paymentMethodListApi.data?.data ?? [];

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchPayment(e.target.value);
  };

  const handleClickActive = (code: string) => {
    if (code === PaymentProviderCodeEnum.Paypal) {
      setOpenPaypal(true);
    }
    if (code === PaymentProviderCodeEnum.Payme) {
      setOpenPayme(true);
    }
    if (code === PaymentProviderCodeEnum.Bidv) {
      setOpenBidv(true);
    }
    if (code === PaymentProviderCodeEnum.Stripe) {
      setOpenStripe(true);
    }
  };

  return (
    <LoadingOverlay isLoading={paymentMethodListApi.isLoading} className="w-full h-full">
      <div className="px-6 py-4">
        <div className="flex items-center gap-x-4">
          <div className="w-1/2">
            <Input
              onChange={handleChangeSearch}
              size={32}
              hiddenClose
              placeholder="Search by payment method’s name"
              icon={<SvgIcon icon="search" width={20} height={20} className="text-ic-ink-6s" />}
            />
          </div>
        </div>
        <div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {paymentMethodList.map((item) => {
              return <ItemPayment handleClickActive={handleClickActive} data={item ?? []} key={item.id} />;
            })}

            {!!paymentMethodList.length && paymentMethodList?.length <= 0 && (
              <div className="flex justify-center pt-6">
                <img src={Empty} alt="logo" />
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalPaypal open={openPaypal} setOpen={setOpenPaypal} />
      <ModalStripe open={openStripe} setOpen={setOpenStripe} />
      <ModalPayme open={openPayme} setOpen={setOpenPayme} />
      <ModalAddBidv open={openBidv} setOpen={setOpenBidv} />
    </LoadingOverlay>
  );
};
export default AllMethods;
