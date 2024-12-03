import SvgIcon from '@/components/commons/SvgIcon';
import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { ProviderEnum } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import {
  GetCouriersResponse,
  ICarrierDetail,
  ICarrierDetailAhamove,
  ICarrierDetailBestExpress,
  ICarrierDetailDhl,
  ICarrierDetailECMS,
  ICarrierDetailEms,
  ICarrierDetailFefexExpress,
  ICarrierDetailGhn,
  ICarrierDetailGhtk,
  ICarrierDetailGrabExpress,
  ICarrierDetailJTExpress,
  ICarrierDetailNinjavan,
  ICarrierDetailPcs,
  ICarrierDetailShippo,
  ICarrierDetailSpx,
  ICarrierDetailUSPSVia,
  ICarrierDetailVnPost,
  ICarrierDetailVtPost,
} from '@/types/ship4p/carrier';
import { Button, Close, Dialog, DialogBody, DialogFooter, DialogHeader, SelectPortal } from '@ichiba/ichiba-core-ui';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Ahamove from '../form/ahamove';
import BestExpress from '../form/best-express';
import ECMS from '../form/ecms';
import FedExExpress from '../form/fedex-express';
import FedExExpressUs from '../form/fedex-express-us';
import JtExpressIndo from '../form/jt-express-indo';
import JtExpressPH from '../form/jt-express-ph';
import JtExpressSing from '../form/jt-express-sing';
import ShippoDHL from '../form/shippo-dhl';
import ShippoFedex from '../form/shippo-fedex';
import ShippoUps from '../form/shippo-ups';
import ShippoUsps from '../form/shippo-usps';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  detailCarrier:
    | ICarrierDetailEms
    | ICarrierDetailGhn
    | ICarrierDetailJTExpress
    | ICarrierDetailNinjavan
    | ICarrierDetailPcs
    | ICarrierDetailVnPost
    | ICarrierDetailVtPost
    | ICarrierDetailAhamove
    | ICarrierDetailSpx
    | ICarrierDetailDhl
    | ICarrierDetailGrabExpress
    | ICarrierDetailFefexExpress
    | ICarrierDetailGhtk
    | ICarrierDetailUSPSVia
    | ICarrierDetail;
  carriers: GetCouriersResponse[] | undefined;
}

const Ems = lazy(() => import('../form/ems'));

const Ghn = lazy(() => import('../form/ghn'));

const JtExpress = lazy(() => import('../form/jt-express'));

const Ninjavan = lazy(() => import('../form/ninjavan'));

const PcsVn = lazy(() => import('../form/pcs-vn'));

const VnPost = lazy(() => import('../form/vn-post'));

const VtPost = lazy(() => import('../form/vt-post'));

const Spx = lazy(() => import('../form/spx'));

const DhlExpress = lazy(() => import('../form/dhl'));
const DhlUsExpress = lazy(() => import('../form/dhl-us'));
const GrabExpress = lazy(() => import('../form/grab-express'));
const Ghtk = lazy(() => import('../form/ghtk'));
const UspsVieEms = lazy(() => import('../form/usps-via-ems'));

export default function ModalUpdateAccountOwn({ isOpen, onClose, onConfirm, detailCarrier, carriers }: Props) {
  const { t } = useTranslation(LocaleNamespace.Common);
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);

  const [chooseCarrier, setChooseCarrier] = useState<string>(detailCarrier.courierId);
  const [error, setError] = useState('');
  const onRefetch = () => {
    onConfirm();
  };

  const onBack = () => {
    setChooseCarrier('');
  };
  const renderComponent = [
    {
      name: ProviderEnum.EMS,
      component: (
        <Ems
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailEms}
        />
      ),
    },
    {
      name: ProviderEnum.GHN,
      component: (
        <Ghn
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailGhn}
        />
      ),
    },
    {
      name: ProviderEnum.JTEXPRESS,
      component: (
        <JtExpress
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailJTExpress}
        />
      ),
    },
    {
      name: ProviderEnum.JTEXPRESSINDO,
      component: (
        <JtExpressIndo
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailJTExpress}
        />
      ),
    },
    {
      name: ProviderEnum.JTEXPRESSSING,
      component: (
        <JtExpressSing
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailJTExpress}
        />
      ),
    },
    {
      name: ProviderEnum.NINJAVAN,
      component: (
        <Ninjavan onClose={onClose} onRefetch={onRefetch} detailCarrier={detailCarrier as ICarrierDetailNinjavan} />
      ),
    },
    {
      name: ProviderEnum.PCSVN,
      component: (
        <PcsVn
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailPcs}
        />
      ),
    },
    {
      name: ProviderEnum.VNPOST,
      component: (
        <VnPost
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailVnPost}
        />
      ),
    },
    {
      name: ProviderEnum.VTPOST,
      component: (
        <VtPost
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailVtPost}
        />
      ),
    },
    {
      name: ProviderEnum.AHAMOVE,
      component: (
        <Ahamove
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailAhamove}
        />
      ),
    },
    {
      name: ProviderEnum.SPX,
      component: (
        <Spx
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailSpx}
        />
      ),
    },
    {
      name: ProviderEnum.DHL,
      component: (
        <DhlExpress
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailDhl}
        />
      ),
    },
    {
      name: ProviderEnum.DHLUS,
      component: (
        <DhlUsExpress
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailDhl}
        />
      ),
    },
    {
      name: ProviderEnum.GrabExpress,
      component: (
        <GrabExpress
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailGrabExpress}
        />
      ),
    },
    {
      name: ProviderEnum.FedExExpress,
      component: (
        <FedExExpress
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailFefexExpress}
        />
      ),
    },
    {
      name: ProviderEnum.FedExExpressUs,
      component: (
        <FedExExpressUs
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailFefexExpress}
        />
      ),
    },
    {
      name: ProviderEnum.GHTK,
      component: (
        <Ghtk
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailGhtk}
        />
      ),
    },
    {
      name: ProviderEnum.USPSEMS,
      component: (
        <UspsVieEms
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailUSPSVia}
        />
      ),
    },
    {
      name: ProviderEnum.JTEXPRESSPH,
      component: (
        <JtExpressPH
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailJTExpress}
        />
      ),
    },
    {
      name: ProviderEnum.BESTEXPRESS,
      component: (
        <BestExpress
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailBestExpress}
        />
      ),
    },
    {
      name: ProviderEnum.ECMC,
      component: (
        <ECMS
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailECMS}
        />
      ),
    },
    {
      name: ProviderEnum.SHIPPOUSPS,
      component: (
        <ShippoUsps
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailShippo}
        />
      ),
    },
    {
      name: ProviderEnum.SHIPPODHL,
      component: (
        <ShippoDHL
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailShippo}
        />
      ),
    },
    {
      name: ProviderEnum.SHIPPOFEDEX,
      component: (
        <ShippoFedex
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailShippo}
        />
      ),
    },
    {
      name: ProviderEnum.SHIPPOUPS,
      component: (
        <ShippoUps
          onBack={onBack}
          onClose={onClose}
          onRefetch={onRefetch}
          detailCarrier={detailCarrier as ICarrierDetailShippo}
        />
      ),
    },
  ];

  const component = useCallback(() => {
    return chooseCarrier ? renderComponent.find((item) => item.name.includes(chooseCarrier))?.component : <></>;
  }, [chooseCarrier]);

  const onSubmit = () => {
    if (!chooseCarrier) {
      setError('Please select carrier');
    }
  };

  useEffect(() => {
    setChooseCarrier(detailCarrier.courierId);
  }, [detailCarrier]);

  const onHandleClose = () => {
    setChooseCarrier('');
    onClose();
  };

  return (
    <Dialog size="sm" open={isOpen} handler={onHandleClose} className="!min-w-[1000px]' : '!min-w-[1000px]">
      <DialogHeader className="flex justify-between">
        {ship4p('button.carrier.own.account.update')}
        <div onClick={onHandleClose} className="cursor-pointer">
          <Close />
        </div>
      </DialogHeader>
      <DialogBody>
        <p className="mb-6 text-sm leading-5 font-normal text-ic-ink-5">{ship4p('modal.carrier.add.label')}</p>
        <div>
          <MixLabel className="mb-6" label={ship4p('form.select.carrier')} required>
            <SelectPortal
              placeholder="Select Carrier"
              aria-label="Default select example"
              disabled
              error={!!error}
              defaultValue={detailCarrier?.courierId}
              options={carriers || []}
              optionLabel={(option) => (
                <div className="flex items-center gap-1">
                  <div>
                    {option.imageUrl ? (
                      <img src={option.imageUrl} height={24} width={24} alt="" />
                    ) : (
                      <SvgIcon icon="carrier-default" height={24} width={24} />
                    )}
                  </div>
                  <span>{option.name}</span>
                </div>
              )}
              optionValue="code"
            />
          </MixLabel>
          <div className="mb-4">
            <Suspense fallback={`Loading...`}>{component()}</Suspense>
          </div>
        </div>
        {!chooseCarrier && (
          <div className="text-ic-black-6 mb-4">
            <div className="flex">
              <span className="mr-3">{ship4p('carrier.more.about')} :</span>
              <span className="cursor-pointer text-primary-6 text-base font-medium leading-6">
                {ship4p('carrier.refer.here')}
              </span>
            </div>
            <div className="flex">
              <span className="mr-3">{t('carrier.dont.account')} </span>
              <span className="cursor-pointer text-primary-6 text-base font-medium leading-6">
                {ship4p('register.now')}
              </span>
            </div>
          </div>
        )}
      </DialogBody>
      {!chooseCarrier && (
        <DialogFooter>
          <div className="flex items-center justify-end">
            <Button
              type="button"
              size="40"
              color="stroke"
              variant="outlined"
              className=" w-[160px] mr-4 rounded-lg py-2 px-4 justify-center text-sm font-normal leading-6"
              onClick={onHandleClose}
            >
              {t('button.cancel')}
            </Button>
            <Button
              type="button"
              size="40"
              color="primary"
              variant="filled"
              className="w-[160px] rounded-lg py-2 px-4 justify-center text-sm font-normal leading-6"
              onClick={onSubmit}
            >
              {t('button.connect')}
            </Button>
          </div>
        </DialogFooter>
      )}
    </Dialog>
  );
}
