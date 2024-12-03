import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { IKeyValue } from '@/types';
import { FilterRecommendParams, TagsRecomented } from '@/types/ship4p/recomented';
import { CountryApi } from '@/types/user-management/master-data';
import { Button } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

interface props {
  countries: CountryApi[];
  isResetAll: boolean;
  recomentedFilters: FilterRecommendParams;
  onClearSearchCountry: () => void;
  onClearSearchShippingType: () => void;
  onClearTasSearch: () => void;
  onClickResetAll: () => void;
  listShippingRateCarrier: IKeyValue[];
  tags: TagsRecomented[] | undefined;
}
export const ShowFilterRecoment = ({
  recomentedFilters,
  onClearSearchCountry,
  onClickResetAll,
  isResetAll,
  countries,
  listShippingRateCarrier,
  onClearSearchShippingType,
  tags,
  onClearTasSearch,
}: props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  return (
    <div className="flex  items-start flex-wrap gap-1 pb-2">
      {(recomentedFilters?.countryIds || [])?.length > 0 && (
        <div className="flex gap-2 items-center bg-ic-ink-1s rounded-lg px-2 py-1 text-sm font-normal leading-5 text-ic-ink-6s">
          <span className="flex flex-1 w-full">
            {t('filter.search', {
              field: 'Country',
              value: countries
                ?.filter((e) => recomentedFilters.countryIds?.includes(e.id))
                .map((result) => result.name)
                ?.join(', '),
            })}
          </span>
          <SvgIcon icon="close" className="cursor-pointer" onClick={onClearSearchCountry} width={16} height={16} />
        </div>
      )}
      {(recomentedFilters?.shippingTypies || []).length > 0 && (
        <div className="flex gap-2 items-center bg-ic-ink-1s rounded-lg px-2 py-1 text-sm font-normal leading-5 text-ic-ink-6s">
          <div className="flex flex-1 w-full">
            <span className="flex flex-1 w-full">
              {t('filter.search', {
                field: 'Shipping type',
                value: listShippingRateCarrier
                  .filter((e) => recomentedFilters.shippingTypies?.includes(Number(e.value)))
                  .map((e) => e.label)
                  .join(', '),
              })}
            </span>
          </div>
          <SvgIcon icon="close" className="cursor-pointer" onClick={onClearSearchShippingType} width={16} height={16} />
        </div>
      )}
      {(recomentedFilters?.tagIds || []).length > 0 && (
        <div className="flex gap-2 items-center bg-ic-ink-1s rounded-lg px-2 py-1 text-sm font-normal leading-5 text-ic-ink-6s">
          <div className=" flex flex-1 w-full">
            <span className="flex flex-1 w-full">
              {t('filter.search', {
                field: 'Tag',
                value: (tags || [])
                  .filter((e) => recomentedFilters.tagIds?.includes(e.id))
                  .map((e) => e.name)
                  .join(', '),
              })}
            </span>
          </div>
          <SvgIcon icon="close" height={16} width={16} onClick={onClearTasSearch} className="cursor-pointer" />
        </div>
      )}
      {isResetAll && (
        <Button variant="text" onClick={onClickResetAll} className="!py-0 !px-2 h-7" color="primary" type="button">
          {t('clearAll')}
        </Button>
      )}
    </div>
  );
};
