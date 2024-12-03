import SvgIcon from '@/components/commons/SvgIcon';
import MixLabel from '@/components/commons/mix-label';
import { LocaleNamespace } from '@/constants/enums/common';
import { ProviderEnum } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { getAllCourier } from '@/services/ship4p/courier';
import { getAllCountries } from '@/services/user-management/master-data';
import { Options } from '@/types';
import { GetCouriersResponse } from '@/types/ship4p/carrier';
import { CountryApi } from '@/types/user-management/master-data';
import {
  Close,
  Collapse,
  CountryFlag,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  LoadingOverlay,
  SearchIcon,
  SelectPortal,
  Spinner,
} from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';
import Ahamove from '../form/ahamove';
import BestExpress from '../form/best-express';
import ECMS from '../form/ecms';
import EzbuyJP from '../form/ezbuy-jp';
import FedExExpress from '../form/fedex-express';
import JtExpressPH from '../form/jt-express-ph';
import ShippoDHL from '../form/shippo-dhl';
import ShippoFedex from '../form/shippo-fedex';
import ShippoUps from '../form/shippo-ups';
import ShippoUsps from '../form/shippo-usps';
import UspsExpress from '../form/usps';
import USPSViaEms from '../form/usps-via-ems';
import ComponentCarriers from './component-carriers';

interface props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
const UpsExpress = lazy(() => import('../form/ups'));
const GrabExpress = lazy(() => import('../form/grab-express'));
const Ghtk = lazy(() => import('../form/ghtk'));

export default function AddAccountCourier({ isOpen, onClose, onConfirm }: props) {
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);
  const [chooseCarrier, setChooseCarrier] = useState<string>('');
  const [carriers, setCarriers] = useState<GetCouriersResponse[]>([]);
  const [countries, setCountries] = useState<CountryApi[]>([]);
  const [countrySearch, setCoutrySearch] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const searchDebounceValue = useDebounce(keyword);
  const searchDebouncecountry = useDebounce(countrySearch);
  const [currencyByCourier, setCurrencyByCourier] = useState<string>('');
  const [countryByCarrier, setCountryByCarrier] = useState<string>('');
  const [country, setCountry] = useState<Options>({} as Options);
  const onRefetch = () => {
    onConfirm();
  };

  const onBack = () => {
    setKeyword('');
    setChooseCarrier('');
    setCurrencyByCourier('');
  };

  const renderComponent = [
    {
      name: ProviderEnum.EMS,
      component: (
        <Ems
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.GHN,
      component: (
        <Ghn
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.JTEXPRESS,
      component: (
        <JtExpress
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.NINJAVAN,
      component: (
        <Ninjavan
          onClose={onClose}
          onRefetch={onRefetch}
          currencyByCourier={currencyByCourier}
          countryCode={countryByCarrier}
        />
      ),
    },
    {
      name: ProviderEnum.PCSVN,
      component: (
        <PcsVn
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.VNPOST,
      component: (
        <VnPost
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.VTPOST,
      component: (
        <VtPost
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.AHAMOVE,
      component: (
        <Ahamove
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.SPX,
      component: (
        <Spx
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.DHL,
      component: (
        <DhlExpress
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.DHLUS,
      component: (
        <DhlUsExpress
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.UPS,
      component: (
        <UpsExpress
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.GrabExpress,
      component: (
        <GrabExpress
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
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
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.GHTK,
      component: (
        <Ghtk
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.USPSEMS,
      component: (
        <USPSViaEms
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.USPS,
      component: (
        <UspsExpress
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.JTEXPRESSPH,
      component: (
        <JtExpressPH
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.EZBUYJP,
      component: (
        <EzbuyJP
          onClose={onClose}
          onBack={onBack}
          onRefetch={onRefetch}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.BESTEXPRESS,
      component: (
        <BestExpress
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.ECMC,
      component: (
        <ECMS
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.SHIPPOUSPS,
      component: (
        <ShippoUsps
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.SHIPPOUPS,
      component: (
        <ShippoUps
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.SHIPPODHL,
      component: (
        <ShippoDHL
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
    {
      name: ProviderEnum.SHIPPOFEDEX,
      component: (
        <ShippoFedex
          onClose={onClose}
          onRefetch={onRefetch}
          onBack={onBack}
          setChooseCarrier={setChooseCarrier}
          currencyByCourier={currencyByCourier}
        />
      ),
    },
  ];
  const component = useCallback(() => {
    return chooseCarrier ? renderComponent.find((item) => item.name === chooseCarrier)?.component : <></>;
  }, [chooseCarrier]);
  const onSubmit = (courierId: string) => {
    const carrier = carriers.find((e) => (e.code || '') === courierId);
    setCurrencyByCourier(carrier?.currency ?? '');
    setCountryByCarrier(carrier?.countryCode ?? '');
    setChooseCarrier(courierId);
  };
  const {
    data: getAllCarrier,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['getAllCarrier', searchDebounceValue, searchDebouncecountry],
    queryFn: () =>
      getAllCourier({
        countryId: searchDebouncecountry,
        keyword: searchDebounceValue,
      }),
    onSuccess: (res) => {
      setCarriers(res.data.items);
    },
  });

  useEffect(() => {
    setCarriers(getAllCarrier?.data?.items as []);
  }, [getAllCarrier?.data?.items]);

  const onCloseModal = () => {
    setCountry({} as Options);
    setCoutrySearch('');
    setKeyword('');
    onClose();
    setTimeout(() => {
      setChooseCarrier('');
    }, 1000);
  };

  const onSearchCarrier = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (val) {
      setKeyword(val);
    } else {
      setKeyword('');
    }
  };

  const clearSearch = () => {
    setKeyword('');
  };
  const clearSearchCountry = () => {
    setCountry({} as Options);
    setCoutrySearch('');
  };
  const getCountries = useQuery({
    queryKey: ['getCountries'],
    queryFn: getAllCountries,
    onSuccess: (res) => {
      setCountries(res.data);
    },
  });
  const onHandleSetCountry = (value: string) => {
    const val = getCountries.data?.data?.find((i: any) => i.id.includes(value)) as CountryApi;
    if (val?.id !== country.id) {
      setCountry({
        label: val.name,
        id: val.id,
        value: val.id,
        searchLabel: val.name,
      });
      setCoutrySearch(val.id as string);
    }
  };
  // const onCloseModelWarehouseMapping = () => {
  //   setVisibleWarehouseMapping(false);
  //   setErrorInline('');
  //   getLocation.refetch();
  //   // warehouseCarrier.refetch();
  //   // getWarehouseMapping.refetch();
  // };
  // const courrierAccountDetail = useQuery({
  //   queryKey: ['getCourierAccountDetail'],
  //   queryFn: () =>
  //     detailCourierAccount({
  //       workspaceSlug: wsContext!.workspace.slug as string,
  //       id: accountCarrierId as string,
  //     }),
  //   enabled: visibleWebhookSetting,
  // });
  // const onCloseModalWebhookSetting = () => {
  //   setVisibleWebhookSetting(false);
  // };
  const onHandleChangeCarrier = (value: string) => {
    const carrier = carriers.find((e) => (e.code || '').includes(value));
    setCurrencyByCourier(carrier?.currency ?? '');
    setChooseCarrier(carrier?.code as string);
  };
  const isLoadingCarrier = (
    <div className="flex w-full h-full items-center">
      <Spinner size={40} color="orange" />
    </div>
  );
  return (
    <div>
      <Dialog
        size={!chooseCarrier ? 'xl' : 'sm'}
        open={isOpen}
        handler={onCloseModal}
        className="!min-w-[1000px]' : '!min-w-[1000px]"
      >
        <DialogHeader className="flex justify-between">
          {chooseCarrier ? ship4p('button.carrier.own.account') : ship4p('choose.carrier.account.label')}
          <div onClick={onCloseModal} className="cursor-pointer">
            <Close />
          </div>
        </DialogHeader>
        <DialogBody>
          <p className="mb-6 text-sm leading-5 font-normal text-ic-ink-5">
            {chooseCarrier ? ship4p('modal.carrier.add.label') : ship4p('modal.carriers.label')}
          </p>
          {!chooseCarrier ? (
            <>
              <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="h-10 flex col-span-9 relative min-w-max w-full items-center rounded-lg  bg-white mr-4">
                  <Input
                    type="text"
                    hiddenClose={!keyword}
                    value={keyword}
                    placeholder={ship4p('carrier.search.placholder')}
                    className="focus-within::border-primary-3 placeholder:text-ic-black-5s text-sm grow border-0 leading-5 outline-none !h-4"
                    onChange={onSearchCarrier}
                    onClearData={clearSearch}
                    icon={<SearchIcon />}
                  />
                </div>
                <div className="col-span-3 relative">
                  <SelectPortal
                    value={country.value}
                    searchable
                    optionValue="id"
                    optionLabel={(option) => {
                      return (
                        <div className="flex gap-2 items-center">
                          <div>{option.code && <CountryFlag code={option.code} />}</div>
                          <span>{option.name}</span>
                        </div>
                      );
                    }}
                    options={countries || []}
                    placeholder={ship4p('input.country.placeholder')}
                    onChange={(value) => onHandleSetCountry(value || '')}
                  />
                  {country.value && (
                    <span
                      className="far fa-times right-5 top-[1px] ml-1 text-ic-ink-4 cursor-pointer p-1 mr-2 absolute"
                      onClick={clearSearchCountry}
                    >
                      <SvgIcon icon="close" width={16} height={16} />
                    </span>
                  )}
                </div>
              </div>
              <LoadingOverlay isLoading={isFetching} size={40}>
                <Collapse expanded={!isLoading && carriers?.length > 0}>
                  {carriers && (
                    <div className="grid grid-cols-12 gap-4 scrollbar overflow-y-auto max-h-[620px]">
                      {carriers &&
                        carriers?.map((item) => <ComponentCarriers key={item.id} carrier={item} onSubmit={onSubmit} />)}
                    </div>
                  )}
                </Collapse>
              </LoadingOverlay>
              {!isLoading && carriers?.length < 1 && (searchDebounceValue || searchDebouncecountry) && (
                <div className="flex justify-center h-[600px] items-center">
                  <SvgIcon icon="empty-search" height={280} width={280} />
                </div>
              )}
              {!isLoading && carriers?.length < 1 && !searchDebounceValue && !searchDebouncecountry && (
                <div className="flex justify-center h-[600px] items-center">
                  <SvgIcon icon="empty" height={280} width={280} />
                </div>
              )}
            </>
          ) : (
            <div>
              <div>
                <MixLabel className="mb-6" label={ship4p('carrier.select')} required>
                  <SelectPortal
                    options={carriers}
                    optionLabel={(option) => (
                      <div className="flex items-center gap-2">
                        {option.imageUrl ? (
                          <img src={option.imageUrl} height={24} width={24} alt="" />
                        ) : (
                          <SvgIcon icon="carrier-default" height={24} width={24} />
                        )}
                        <span>{option.name}</span>
                      </div>
                    )}
                    optionValue="code"
                    placeholder={ship4p('carrier.select.placeholder')}
                    onChange={(e) => onHandleChangeCarrier(e as string)}
                    defaultValue={chooseCarrier}
                  />
                </MixLabel>
              </div>
              <Suspense fallback={isLoadingCarrier}>
                <LoadingOverlay>
                  <Collapse expanded className="transition ease-in-out delay-75">
                    {component()}
                  </Collapse>
                </LoadingOverlay>
              </Suspense>
            </div>
          )}
        </DialogBody>
        <div className="pb-4"></div>
      </Dialog>
    </div>
  );
}
