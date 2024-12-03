import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { CarrierDescription, RedirectCarrier } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { GetCouriersResponse } from '@/types/ship4p/carrier';
import { Button, CountryFlag } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

interface ComponentCarriersProps {
  carrier: GetCouriersResponse;
  onSubmit: (code: string) => void;
}
export default function ComponentCarriers({ carrier, onSubmit, ...props }: ComponentCarriersProps) {
  const { t: tCarrier } = useTranslation(LocaleNamespace.Ship4p);
  const onHanldRedirect = (carrier: GetCouriersResponse) => {
    const carrierUri = RedirectCarrier.find((i) => i.carrierCode.includes(carrier.code ?? ''));
    if (carrierUri) {
      window.open(carrierUri.linkUrl, '_blank');
    }
  };
  return (
    <div
      {...props}
      key={carrier.id}
      className="p-4 col-span-4 flex flex-col border-ic-ink-2 justify-between border h-auto rounded-lg "
    >
      <div className="!w-full">
        <div className="flex gap-2">
          <img
            src={carrier.imageUrl || ''}
            width="48"
            height="48"
            alt={carrier.name || ''}
            className="!min-w-max !w-12 !h-12"
            loading="eager"
          />
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <CountryFlag code={carrier?.countryCode || ''} />
              <p className="text-sm text-center font-medium">{carrier.name}</p>
            </div>

            <p className="text-[12px] font-normal">
              {CarrierDescription(tCarrier).find((x) => x.carrierId.includes(carrier.code ?? ''))?.descriprion}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex justify-center items-center gap-1 cursor-pointer" onClick={() => onHanldRedirect(carrier)}>
          <p className="text-sm font-medium text-ic-primary-6s">{carrier.name}</p>
          <SvgIcon icon="icon-edit" width={16} height={16} />
        </div>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          size="40"
          className="font-medium"
          onClick={() => onSubmit(carrier.code ?? '')}
        >
          {tCarrier('button.connect')}
        </Button>
      </div>
    </div>
  );
}
