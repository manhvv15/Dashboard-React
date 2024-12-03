import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { IKeyValue } from '@/types';
import { CarrierStatusSearchEnum, ShippingRateEnum } from '@/types/enums/carrier';
import { FilterCarrierParams } from '@/types/ship4p/carrier';
import { CountryApi } from '@/types/user-management/master-data';
import { CountryFlag, DropdownFilter, Input, SearchIcon } from '@ichiba/ichiba-core-ui';
import { OptionValue } from '@ichiba/ichiba-core-ui/dist/components/multiple-select/types';
import { useTranslation } from 'react-i18next';

interface props {
  countries: CountryApi[];
  onHandleChangeSearchCountry: (value: OptionValue[]) => void;
  searchAccountCarrier: FilterCarrierParams;
  onChangeSearchInput: (keyword: string) => void;
  onHandleChangeSearchShippingType: (value: ShippingRateEnum[]) => void;
  onHandleChangeStatus: (value: CarrierStatusSearchEnum[]) => void;
  listStatusCarrier: IKeyValue[];
  listShippingRateCarrier: IKeyValue[];
}
export const FilterCarrier = ({
  searchAccountCarrier,
  onChangeSearchInput,
  onHandleChangeSearchShippingType,
  onHandleChangeStatus,
  listStatusCarrier,
  listShippingRateCarrier,
  onHandleChangeSearchCountry,
  countries,
}: props) => {
  const { t } = useTranslation(LocaleNamespace.Ship4p);
  const onChangeSearchKeyword = (val: React.ChangeEvent<HTMLInputElement>) => {
    const value = val.target.value;
    onChangeSearchInput(value);
  };
  const onClearInputSearch = () => {
    onChangeSearchInput('');
  };
  return (
    <div className="flex gap-6">
      <div className="w-[500px]">
        <Input
          icon={<SearchIcon />}
          size={32}
          className="w-[500px]"
          value={searchAccountCarrier.keyword}
          hiddenClose={!searchAccountCarrier.keyword}
          onClearData={onClearInputSearch}
          onChange={(value) => onChangeSearchKeyword(value)}
          placeholder={t('yourt.account.input.search.placeholder')}
        />
      </div>
      <div className="flex gap-3">
        <DropdownFilter
          name={t('country.search')}
          options={countries || []}
          optionValue="id"
          optionLabel={(option) => {
            return (
              <div className="flex gap-1">
                <CountryFlag code={option?.code ?? ''} />
                <span>{option.name}</span>
              </div>
            );
          }}
          value={searchAccountCarrier?.countryIds || []}
          icon={<SvgIcon width={16} height={16} icon="icon-netword" />}
          allowSelectAll={true}
          onChange={(value) => onHandleChangeSearchCountry(value as OptionValue[])}
          multiple
        />
        <DropdownFilter
          options={listShippingRateCarrier}
          optionValue="value"
          optionLabel="label"
          value={searchAccountCarrier?.shippingTypies || []}
          allowSelectAll
          searchable={false}
          multiple
          name={t('carrier.shippingType.title')}
          icon={<SvgIcon icon="list-check-icon" height={16} width={16} />}
          onChange={(value) => onHandleChangeSearchShippingType(value as ShippingRateEnum[])}
        />
        <DropdownFilter
          name={t('carrier.status.title')}
          options={listStatusCarrier}
          optionValue="value"
          optionLabel="label"
          value={searchAccountCarrier?.status || []}
          allowSelectAll
          searchable={false}
          multiple
          icon={<SvgIcon icon="status-icon-filter" height={16} width={16} />}
          onChange={(value) => onHandleChangeStatus(value as CarrierStatusSearchEnum[])}
        />
      </div>
    </div>
  );
};
