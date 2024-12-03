import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS_VALUE, RedirectCarrier } from '@/pages/configurations/ship4p-carrier-systems/commons/common';
import { IKeyValue } from '@/types';
import { AddOnTypeEnum } from '@/types/enums/carrier';
import { CourierAccountViewModel } from '@/types/ship4p/carrier';
import { formatNumber } from '@/utils/common';
import { Button, Menu, MenuHandler, MenuItem, MenuList, Tag, Tooltip } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

interface props {
  carrierByCountry: CourierAccountViewModel;
  onAction: (value: string | number, item: CourierAccountViewModel) => void;
  listAction: IKeyValue[];
}
export const CarrierByMarketItems = ({ carrierByCountry, onAction, listAction }: props) => {
  const { t } = useTranslation(LocaleNamespace.Ship4p);
  const onHanldRedirect = (carrier: CourierAccountViewModel) => {
    const carrierUri = RedirectCarrier.find((i) => i.carrierCode.includes(carrier.courierId));
    if (carrierUri) {
      window.open(carrierUri.linkUrl, '_blank');
    }
  };
  return (
    <div className="px-5 py-4 flex gap-2 hover:transition hover:ease-in-out border border-white hover:border hover:overflow-hidden hover:border-ic-brand-a bg-white rounded-lg w-full overflow-hidden">
      <div className="flex justify-between w-full ">
        <div className="flex  w-full items-center gap-2">
          <img src={carrierByCountry.imageUrl} width={60} height={60} />
          <div className="flex gap-2 py-1 flex-1 overflow-hidden">
            <div className="flex flex-col w-full justify-between gap-0.5">
              <div className="flex flex-1 justify-between gap-2 items-center">
                <div className="truncate overflow-hidden flex-1">
                  <Tooltip content={carrierByCountry?.courierName}>
                    <div
                      className="text-base font-medium truncate hover:text-ic-primary-6s hover:underline cursor-pointer"
                      onClick={() => onHanldRedirect(carrierByCountry)}
                    >
                      {carrierByCountry?.courierName}
                    </div>
                  </Tooltip>
                </div>
                <div className="flex">
                  {carrierByCountry.active != null ? (
                    carrierByCountry.active ? (
                      <Tag
                        variant="success"
                        className="h-5 rounded w-max text-xs flex border border-current"
                        value={t('carrier.active')}
                      />
                    ) : (
                      <Tag
                        variant="error"
                        className="h-5 rounded text-xs w-max flex border border-current"
                        value={t('carrier.stopWorking')}
                      />
                    )
                  ) : (
                    <Tag
                      variant="disable"
                      className="h-5 rounded text-xs w-max flex border border-current"
                      value={t('carrier.open.toConnect')}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5 flex-row items-center justify-between w-full ">
                  {(carrierByCountry.isLocal || carrierByCountry.isCrossBorder) && (
                    <div className="text-xs text-ic-ink-5s font-medium leading-4 flex gap-1 flex-col">
                      <span>{carrierByCountry.isLocal && t('localStatus')}</span>
                      <span>{carrierByCountry.isCrossBorder && t('localStatus.crossBorder')}</span>
                    </div>
                  )}
                  {carrierByCountry.addOnAmount !== null && (
                    <div className="text-xs flex items-center gap-1">
                      <div>
                        <SvgIcon icon="add-on-icon" height={20} width={20} className="text-ic-primary-6s" />
                      </div>
                      <span className="text-sm leading-5 text-ic-primary-6s font-medium">
                        {' '}
                        {carrierByCountry.addOnAmount && `+${formatNumber(carrierByCountry.addOnAmount ?? 0)}`}
                        {carrierByCountry.addOnType === AddOnTypeEnum.Percentage
                          ? `%`
                          : ` ${carrierByCountry.currency}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center flex-row">
                  <div className="text-xs text-ic-ink-5s font-medium leading-4">{carrierByCountry.accountId}</div>
                  <Menu>
                    <MenuHandler className=" rounded-lg !p-1">
                      <Button color="stroke" size="16" variant="outlined" className="!w-6 !h-6">
                        <SvgIcon icon="dots-menu" className="mx-1" width={16} height={16} />
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      {carrierByCountry.active !== null && carrierByCountry.active
                        ? listAction
                            .filter((i) => {
                              return (
                                i.value === ACTIONS_VALUE.DEACTIVE ||
                                i.value === ACTIONS_VALUE.ADD_ON ||
                                i.value === ACTIONS_VALUE.WEBHOOK ||
                                i.value === ACTIONS_VALUE.UPDATE ||
                                i.value === ACTIONS_VALUE.DETAIL
                              );
                            })
                            .map((i) => {
                              return (
                                <MenuItem
                                  key={i.value}
                                  onClick={() => onAction(i.value, carrierByCountry)}
                                  className="cursor-pointer"
                                >
                                  {i.label}
                                </MenuItem>
                              );
                            })
                        : listAction
                            .filter((i) => {
                              return (
                                i.value === ACTIONS_VALUE.REMOVE ||
                                i.value === ACTIONS_VALUE.ACTIVE ||
                                i.value === ACTIONS_VALUE.DETAIL
                              );
                            })
                            .map((i) => {
                              return (
                                <MenuItem
                                  key={i.value}
                                  onClick={() => onAction(i.value, carrierByCountry)}
                                  className="cursor-pointer"
                                >
                                  {i.label}
                                </MenuItem>
                              );
                            })}
                    </MenuList>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
