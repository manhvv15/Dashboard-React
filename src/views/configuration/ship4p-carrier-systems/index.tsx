import AccessibleComponent from '@/components/commons/AccessibleComponent';
import SvgIcon from '@/components/commons/SvgIcon';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { useApp } from '@/hooks/use-app';
import {
  ACTIONS_VALUE,
  STATUS_ACTIVE_CARRIER,
  listActionCarrier,
  listShippingTypeSearch,
  listStatusSearch,
} from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import {
  deleleCarrierSystem,
  getCarrierSystems,
  getDetailCourierDetail,
  setActiveCarrierSystem,
} from '@/services/ship4p/carrier-system';
import { getAllCourier } from '@/services/ship4p/courier';
import { getAllCountries } from '@/services/user-management/master-data';
import { CarrierStatusSearchEnum, ShippingRateEnum } from '@/types/enums/carrier';
import {
  CourierAccountViewModel,
  FilterCarrierParams,
  GetCourierAccountByMarketViewModel,
  GetCouriersResponse,
  ICarrierDetail,
  ICarrierDetailDhl,
  ICarrierDetailEms,
  ICarrierDetailGhn,
  ICarrierDetailGrabExpress,
  ICarrierDetailJTExpress,
  ICarrierDetailNinjavan,
  ICarrierDetailPcs,
  ICarrierDetailSpx,
  ICarrierDetailVnPost,
  ICarrierDetailVtPost,
} from '@/types/ship4p/carrier';
import { responseErrorCode } from '@/utils/common';
import { Button, Collapse, CountryFlag, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { OptionValue } from '@ichiba/ichiba-core-ui/dist/components/multiple-select/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { t } from 'i18next';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';
import AddAccountCourier from './components/add-account-courier/add-account-courier';
import { FilterCarrier } from './components/filters/filter-carrier';
import { ShowFilterCarrier } from './components/filters/show-filter-carrier';
import { CarrierByMarketItems } from './components/items/carrier-by-market-items';
import ModalActiveAndDeactive from './components/modals/modal-active-and-deactive';
import AddOnShippingFeeSetting from './components/modals/modal-add-on-shipping-setting';
import ModalRemoveCarrier from './components/modals/modal-remove-carrier';
import ModalUpdateAccountOwn from './components/modals/modal-update-account-own';

const Ship4pCarrierSystem = () => {
  const { t: ship4p } = useTranslation(LocaleNamespace.Ship4p);
  const { t: error } = useTranslation(LocaleNamespace.Error);
  const { showToast } = useApp();
  const [carriers, setCarriers] = useState<GetCouriersResponse[]>();
  const [errorInline, setErrorInline] = useState<string>('');
  const [carrierAccount, setCarrierAccount] = useState<CourierAccountViewModel>({} as CourierAccountViewModel);
  const [visibleActiveDeactiveAccount, setVisibleActiveDeactiveAccount] = useState<boolean>(false);
  const [visibleModalUpdateAcount, setVisibleModalUpdateAcount] = useState<boolean>(false);
  const [visibleAddOnShipping, setVisibleAddOnShipping] = useState<boolean>(false);
  const [visibleRemoveAccount, setVisibleRemoveAccount] = useState<boolean>(false);
  const [detailCarrier, setDetailCarrier] = useState<
    | ICarrierDetailEms
    | ICarrierDetailGhn
    | ICarrierDetailJTExpress
    | ICarrierDetailNinjavan
    | ICarrierDetailPcs
    | ICarrierDetailVnPost
    | ICarrierDetailVtPost
    | ICarrierDetailSpx
    | ICarrierDetailDhl
    | ICarrierDetailGrabExpress
    | ICarrierDetail
  >(
    {} as
      | ICarrierDetailEms
      | ICarrierDetailGhn
      | ICarrierDetailJTExpress
      | ICarrierDetailNinjavan
      | ICarrierDetailPcs
      | ICarrierDetailVnPost
      | ICarrierDetailVtPost
      | ICarrierDetailSpx
      | ICarrierDetailDhl
      | ICarrierDetailGrabExpress,
  );
  const listStatusCarrier = listStatusSearch(ship4p);
  const listShippingRateCarrier = listShippingTypeSearch(ship4p);
  const listActionCourier = listActionCarrier(ship4p);
  const [listCouriersystem, setListCouriersystem] = useState<GetCourierAccountByMarketViewModel[]>([]);
  const [visibleAddAccountCourier, setVisibleAddAccountCourier] = useState(false);
  const [searchAccountCarrier, setSearchAccountCarrier] = useState<FilterCarrierParams>({
    countryIds: undefined,
    status: undefined,
    shippingTypies: undefined,
    keyword: undefined,
  });
  const searchKeyworkDebounce = useDebounce(searchAccountCarrier.keyword, 300);
  const searchAccountDebounce = {
    countryIds: searchAccountCarrier.countryIds,
    status: searchAccountCarrier.status,
    shippingTypies: searchAccountCarrier.shippingTypies,
    keyword: searchKeyworkDebounce,
  };
  const onHandleChangeSearchCountry = (options: OptionValue[]) => {
    setSearchAccountCarrier((prevState) => ({
      ...prevState,
      countryIds: options?.map((e) => e.toString()),
    }));
  };
  const onHandleChangeSearchShippingType = (options: ShippingRateEnum[]) => {
    setSearchAccountCarrier((prevState) => ({
      ...prevState,
      shippingTypies: options,
    }));
  };
  const onClearSearchCountry = () => {
    setSearchAccountCarrier((prevState) => ({
      ...prevState,
      countryIds: undefined,
    }));
  };
  const onClearStatusSearch = () => {
    setSearchAccountCarrier((prevState) => ({
      ...prevState,
      status: undefined,
    }));
  };
  const onClickResetAll = () => {
    setSearchAccountCarrier((prev) => ({
      ...prev,
      countryIds: undefined,
      shippingTypies: undefined,
      status: undefined,
    }));
  };
  const isResetAll =
    !!searchAccountCarrier.countryIds ||
    !!searchAccountCarrier.shippingTypies ||
    (searchAccountCarrier.status || []).length >= 1;

  const onClearSearchShippingType = () => {
    setSearchAccountCarrier((prevState) => ({
      ...prevState,
      shippingTypies: undefined,
    }));
  };
  const onHandleChangeStatus = (options: CarrierStatusSearchEnum[]) => {
    setSearchAccountCarrier((prevState) => ({
      ...prevState,
      status: options,
    }));
  };
  const onChangeSearchInput = (keyword: string) => {
    setSearchAccountCarrier((prevState) => ({
      ...prevState,
      keyword,
    }));
  };
  const onHandleConnectCourier = () => {
    setVisibleAddAccountCourier(true);
  };

  const getCountries = useQuery({
    queryKey: ['getCountries'],
    queryFn: getAllCountries,
  });
  const getDetailCarrierOwn = useMutation({
    mutationFn: getDetailCourierDetail,
  });
  const getDetailCarrier = (item: CourierAccountViewModel, action: string) => {
    getDetailCarrierOwn.mutate(
      {
        id: item.id as string,
      },
      {
        onSuccess: (res: AxiosResponse<ICarrierDetail>) => {
          setDetailCarrier(res.data);
          if (action === ACTIONS_VALUE.UPDATE) {
            setVisibleModalUpdateAcount(true);
            return;
          }
        },
        onError: (e: any) => {
          const { errorNormal, errorFrom } = e;
          if (errorFrom) {
            responseErrorCode(errorFrom).forEach(({ message }) => {
              const mess = error(message);
              showToast({ type: 'error', detail: mess });
            });
          }
          if (errorNormal) {
            showToast({
              type: 'error',
              detail: error(errorNormal),
            });
          }
        },
      },
    );
  };

  useQuery({
    queryKey: ['getAllCarrier'],
    queryFn: () =>
      getAllCourier({
        countryId: '',
        keyword: '',
      }),
    onSuccess: (res) => {
      setCarriers(res.data.items);
    },
  });
  const {
    isFetching,
    isLoading,
    isSuccess,
    refetch: refetchCarrierSystem,
  } = useQuery({
    queryKey: ['getCourierSystemShip4p', searchAccountDebounce],
    queryFn: () =>
      getCarrierSystems({
        _keyword: searchAccountDebounce.keyword,
        countryIds: searchAccountDebounce.countryIds,
        shippingTypies: searchAccountDebounce.shippingTypies,
        status: searchAccountDebounce.status,
      }),
    onSuccess: (res) => {
      setListCouriersystem(res.data);
    },
  });
  const onAction = (action: string | number, item: CourierAccountViewModel) => {
    switch (action) {
      case ACTIONS_VALUE.DEACTIVE:
        setCarrierAccount(item);
        setVisibleActiveDeactiveAccount(true);
        break;
      case ACTIONS_VALUE.ACTIVE:
        setCarrierAccount(item);
        setVisibleActiveDeactiveAccount(true);
        break;
      case ACTIONS_VALUE.REMOVE:
        setCarrierAccount(item);
        setVisibleRemoveAccount(true);
        break;
      case ACTIONS_VALUE.UPDATE:
        getDetailCarrier(item, ACTIONS_VALUE.UPDATE);
        break;
      case ACTIONS_VALUE.DETAIL:
        getDetailCarrier(item, ACTIONS_VALUE.DETAIL);
        break;
      case ACTIONS_VALUE.ADD_ON:
        setCarrierAccount(item);
        setVisibleAddOnShipping(true);
        break;
      default:
        break;
    }
  };
  const refetchCarrier = () => {
    refetchCarrierSystem();
  };
  const onHandleCloseAddCourier = () => {
    setVisibleAddAccountCourier(false);
    refetchCarrier();
  };
  const onHandleConfirmAddCourier = () => {
    refetchCarrier();
  };
  const onCloseModalActiveDeactiveAccount = () => {
    setVisibleActiveDeactiveAccount(false);
  };
  const onCloseModalUpdateAccount = () => {
    setVisibleModalUpdateAcount(false);
  };

  const onCloseModalAddOnShipping = () => {
    setVisibleAddOnShipping(false);
    refetchCarrier();
  };
  const slotsHeader = (
    <Collapse expanded>
      <AccessibleComponent object={OBJECTS.SHIP4P_CARRIER_SYSTEM} action={ACTIONS.CREATE}>
        <Button className="flex gap-2 items-center" onClick={onHandleConnectCourier}>
          <SvgIcon icon="plus" height={24} width={24} />
          <span>{ship4p('btn.connect.courier')}</span>
        </Button>
      </AccessibleComponent>
    </Collapse>
  );
  const onCloseModalRemoveAccount = () => {
    setErrorInline('');
    setVisibleRemoveAccount(false);
  };
  const removeCarrierOwn = useMutation({
    mutationFn: deleleCarrierSystem,
  });
  const onSubmitRemoveAccount = () => {
    removeCarrierOwn.mutate(
      {
        id: carrierAccount.id as string,
      },
      {
        onSuccess: () => {
          refetchCarrier();
          showToast({
            type: 'success',
            detail: ship4p('toast.carrier.remove.success'),
          });
          setVisibleRemoveAccount(false);
        },
        onError: (e: any) => {
          const { errorNormal, errorFrom } = e;
          if (errorFrom) {
            responseErrorCode(errorFrom).forEach(({ message }) => {
              const mess = error(message);
              setErrorInline(mess);
            });
          }
          if (errorNormal) {
            showToast({
              type: 'error',
              detail: error(errorNormal),
            });
            setErrorInline(errorNormal);
          }
        },
      },
    );
  };
  const updateStatusCarrier = useMutation({
    mutationFn: setActiveCarrierSystem,
  });
  const onSubmitActiveAndDeactive = () => {
    if (carrierAccount.active) {
      handleUpdateStatusCarrier(STATUS_ACTIVE_CARRIER.DEACTIVE);
      return;
    }
    handleUpdateStatusCarrier(STATUS_ACTIVE_CARRIER.ACTIVE);
  };
  const handleUpdateStatusCarrier = (active: boolean) => {
    updateStatusCarrier.mutate(
      {
        id: carrierAccount.id as string,
        status: active,
      },
      {
        onSuccess: () => {
          refetchCarrier();
          setVisibleActiveDeactiveAccount(false);
          if (active) {
            showToast({
              type: 'success',
              detail: ship4p('toast.update.carier.operation.success', {
                carrier: carrierAccount.courierName || carrierAccount.courierId,
              }),
            });
            return;
          }
          showToast({
            type: 'success',
            detail: ship4p('toast.update.carier.decommissioning.success', {
              carrier: carrierAccount.courierName || carrierAccount.courierId,
            }),
          });
        },
        onError: (e: any) => {
          const { errorNormal, errorFrom } = e;
          if (errorFrom) {
            responseErrorCode(errorFrom).forEach(({ message }) => {
              const mess = error(message);
              showToast({ type: 'error', detail: mess });
            });
          }
          if (errorNormal) {
            showToast({
              type: 'error',
              detail: error(errorNormal),
            });
          }
        },
      },
    );
  };
  return (
    <LayoutSection label={ship4p('configuration.ship4pCarrierSystem')} right={slotsHeader}>
      <div className="flex flex-1 w-full h-full bg-white px-5 rounded-lg pt-3 pb-6 gap-4">
        <div className="flex flex-col h-full w-full overflow-hidden">
          <div className="flex flex-col gap-2">
            <FilterCarrier
              countries={getCountries.data?.data || []}
              searchAccountCarrier={searchAccountCarrier}
              onHandleChangeSearchCountry={onHandleChangeSearchCountry}
              onChangeSearchInput={onChangeSearchInput}
              onHandleChangeSearchShippingType={onHandleChangeSearchShippingType}
              onHandleChangeStatus={onHandleChangeStatus}
              listStatusCarrier={listStatusCarrier}
              listShippingRateCarrier={listShippingRateCarrier}
            />
            <ShowFilterCarrier
              countries={getCountries.data?.data || []}
              isResetAll={isResetAll}
              onClearSearchCountry={onClearSearchCountry}
              onClearSearchShippingType={onClearSearchShippingType}
              onClearStatusSearch={onClearStatusSearch}
              onClickResetAll={onClickResetAll}
              searchAccountCarrier={searchAccountCarrier}
              listStatusCarrier={listStatusCarrier}
              listShippingRateCarrier={listShippingRateCarrier}
            />
          </div>
          <LoadingOverlay isLoading={isFetching} className="w-full flex-1 overflow-auto scrollbar">
            <div className="flex flex-col gap-4 h-full w-full">
              {(listCouriersystem || []).length > 0 ? (
                listCouriersystem?.map((courier) => {
                  return (
                    <div className="bg-ic-light flex rounded-lg px-3 py-4 flex-col w-full gap-3">
                      <div className="flex gap-2 items-center">
                        <CountryFlag code={courier?.countryCode || ''} />
                        <span className="font-medium text-base leading-6">{courier?.countryName}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-6 w-full">
                        {courier.courierViewModels?.map((carrierByCountry) => {
                          return (
                            <CarrierByMarketItems
                              carrierByCountry={carrierByCountry}
                              onAction={onAction}
                              key={carrierByCountry.key}
                              listAction={listActionCourier}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full">
                  <div className="h-full">
                    {isSuccess && !isLoading ? (
                      <div className="h-full">
                        {searchAccountCarrier.countryIds ||
                        searchAccountCarrier.keyword ||
                        searchAccountCarrier.shippingTypies ||
                        searchAccountCarrier.status ? (
                          <div className="flex w-full h-full items-center flex-col justify-center">
                            <SvgIcon icon="empty-search" width="280" height="280" />
                            <span>{t('noResultsFound')}</span>
                          </div>
                        ) : (
                          <div className="flex w-full h-full items-center flex-col justify-center">
                            <SvgIcon icon="empty" width="280" height="280" />
                            <span>{t('noResultsFound')}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}
            </div>
          </LoadingOverlay>
        </div>
        {visibleAddAccountCourier && (
          <Suspense fallback={null}>
            <AddAccountCourier
              isOpen={visibleAddAccountCourier}
              onClose={onHandleCloseAddCourier}
              onConfirm={onHandleConfirmAddCourier}
            />
          </Suspense>
        )}

        {visibleRemoveAccount && (
          <ModalRemoveCarrier
            errorInline={errorInline}
            isOpen={visibleRemoveAccount}
            loading={removeCarrierOwn.isLoading}
            onClose={onCloseModalRemoveAccount}
            onConfirm={onSubmitRemoveAccount}
            carrierAccount={carrierAccount}
          />
        )}
        {visibleActiveDeactiveAccount && (
          <ModalActiveAndDeactive
            isOpen={visibleActiveDeactiveAccount}
            isLoading={updateStatusCarrier.isLoading}
            onClose={onCloseModalActiveDeactiveAccount}
            onConfirm={onSubmitActiveAndDeactive}
            carrierAccount={carrierAccount}
            type={carrierAccount.active ?? false}
          />
        )}

        {visibleModalUpdateAcount && (
          <ModalUpdateAccountOwn
            isOpen={visibleModalUpdateAcount}
            onClose={onCloseModalUpdateAccount}
            onConfirm={refetchCarrier}
            carriers={carriers}
            detailCarrier={detailCarrier}
          />
        )}
        {visibleAddOnShipping && (
          <AddOnShippingFeeSetting
            visible={visibleAddOnShipping}
            onClose={onCloseModalAddOnShipping}
            courierSystemId={carrierAccount.id ?? ''}
            listCarrierOwn={carriers}
          />
        )}
      </div>
    </LayoutSection>
  );
};
export default Ship4pCarrierSystem;
