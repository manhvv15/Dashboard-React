import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { IKeyValue } from '@/types';
import { ShippingRateEnum } from '@/types/enums/carrier';
import { FilterRecommendParams, TagsRecomented } from '@/types/ship4p/recomented';
import { CountryApi } from '@/types/user-management/master-data';
import { CountryFlag, DropdownFilter, Input, SearchIcon } from '@ichiba/ichiba-core-ui';
import { OptionValue } from '@ichiba/ichiba-core-ui/dist/components/multiple-select/types';
import { useTranslation } from 'react-i18next';
interface props {
  countries: CountryApi[];
  onHandleChangeSearchCountry: (value: OptionValue[]) => void;
  recomentedFilters: FilterRecommendParams;
  onChangeSearchInput: (keyword: string) => void;
  onHandleChangeSearchShippingType: (value: ShippingRateEnum[]) => void;
  onHandleChangeTags: (value: string[] | undefined) => void;
  listShippingRateCarrier: IKeyValue[];
  tags: TagsRecomented[] | undefined;
}
export const FilterRecomented = ({
  recomentedFilters,
  onChangeSearchInput,
  onHandleChangeSearchShippingType,
  onHandleChangeTags,
  listShippingRateCarrier,
  onHandleChangeSearchCountry,
  countries,
  tags,
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
          value={recomentedFilters.keyword ?? ''}
          hiddenClose={!recomentedFilters.keyword}
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
          value={recomentedFilters?.countryIds || []}
          icon={<SvgIcon width={16} height={16} icon="icon-netword" />}
          allowSelectAll={true}
          onChange={(value) => onHandleChangeSearchCountry(value as OptionValue[])}
          multiple
        />
        <DropdownFilter
          options={listShippingRateCarrier}
          optionValue="value"
          optionLabel="label"
          value={recomentedFilters?.shippingTypies || []}
          allowSelectAll
          searchable={false}
          multiple
          name={t('carrier.shippingType.title')}
          icon={<SvgIcon icon="list-check-icon" height={16} width={16} />}
          onChange={(value) => onHandleChangeSearchShippingType(value as ShippingRateEnum[])}
        />
        <DropdownFilter
          name={t('recoment.tag.title')}
          options={tags || []}
          optionValue="id"
          optionLabel="name"
          value={recomentedFilters?.tagIds || []}
          allowSelectAll
          searchable={false}
          multiple
          icon={<SvgIcon icon="status-icon-filter" height={16} width={16} />}
          onChange={(value) => onHandleChangeTags(value)}
        />
      </div>
    </div>
  );
};
