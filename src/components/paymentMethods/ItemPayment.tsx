import { Button } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { PaymentProviderCodeEnum } from '@/types/payment-methods/enum';
import { PaymentMethod } from '@/types/payment-methods/payment-method';

import SvgIcon from '../commons/SvgIcon';

interface ListPaymentProvider3rdProps {
  data: PaymentMethod;
  handleClickActive: (code: string) => void;
}

const ItemPayment = ({ data, handleClickActive }: ListPaymentProvider3rdProps) => {
  const { t: common } = useTranslation(LocaleNamespace.Common);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const handleManageActive = (code: string) => {
    const typePayment = ['paypal', 'payme', 'cod', 'banktransfer', 'vietqr', 'cash', 'bidv', 'stripe'];

    navigate(`${pathname}?tab=my-methods&type=${typePayment.indexOf(code)}`);
  };

  const handleTermAndPolicy = (code: PaymentProviderCodeEnum) => {
    const thirdParty = [PaymentProviderCodeEnum.Paypal, PaymentProviderCodeEnum.Payme];
    const advanceFeature = [PaymentProviderCodeEnum.Bidv];
    if (thirdParty.includes(code)) {
      return `payment.${code}.link.register.merchant`;
    }
    if (advanceFeature.includes(code)) {
      return `openAccountPayment.${code}`;
    }
    return 'termAndPolicy';
  };

  return (
    <div>
      <div className="rounded-xl p-4 border bg-ic-white-6s border-ic-ink-2s h-[217px] relative">
        <div className="flex items-center justify-between pb-2 border-b border-dashed border-ic-ink-2s">
          <img src={`/static/images/payment/${data.code}.svg`} width={78} height={19} alt="" />
          {data.hasMerchantAccount ? (
            <Button size="32" onClick={() => handleManageActive(data.code)} color="primary" variant={'outlined'}>
              {common(`manage`)}
            </Button>
          ) : (
            <Button size="32" onClick={() => handleClickActive(data.code)} color="primary" variant={'filled'}>
              {common(`active`)}
            </Button>
          )}
        </div>
        <div className="flex pt-2">
          {(data.payTypeSupports ?? []).map((ele) => {
            return (
              <img key={ele} className="mr-2" src={`/static/images/payment/${ele}.svg`} width={32} height={20} alt="" />
            );
          })}
        </div>
        <p className="my-2 text-sm text-ic-ink-6s">{data.description}</p>
        <p className="absolute text-right bottom-4 right-4">
          <a
            target="_blank"
            href={data.registerMerchantAccountLink ?? '#'}
            className="flex items-center text-sm font-medium leading-5 text-ic-primary-6s"
            rel="noreferrer"
          >
            <span>{common(handleTermAndPolicy(data.code))}</span>
            <SvgIcon icon="arrow-right" width={20} height={20} />
          </a>
        </p>
      </div>
    </div>
  );
};

export default ItemPayment;
