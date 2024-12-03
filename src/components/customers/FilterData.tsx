import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { Button, DropdownFilter, Input } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';

import { getAllCountries } from '@/services/user-management/master-data';
import { CustomerPagingRequest } from '@/types/user-management/customer';
import { useQuery } from '@tanstack/react-query';
import { find, map } from 'lodash';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  params: CustomerPagingRequest;
  setParams: Dispatch<SetStateAction<CustomerPagingRequest>>;
}
export const FilterData = ({ params, setParams }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const [showStatusSelected, setShowStatusSelected] = useState<string>();
  const [showCountryCodesSelected, setShowCountryCodesSelected] = useState<string>();

  const filterHandler: SetStatePropertyFunc<CustomerPagingRequest> = (propertyName, value) => {
    setParams((prev) => ({
      ...prev,
      pageNumber: 0,
      [propertyName]: value,
    }));
  };
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (onlySpaces(value)) {
      filterHandler('keyword', '');
      return;
    }
    filterHandler('keyword', value);
  };
  const statusOptions = [
    { value: 0, label: t('active') },
    { value: 1, label: t('deactive') },
  ];

  const handleChangeStatus = (val?: number[]) => {
    filterHandler('status', val);
    const getData = map(val, (id) => find(statusOptions, { value: id }))
      .map((i) => i?.label)
      .join(', ');
    setShowStatusSelected(getData);
  };

  const handleClearStatus = () => {
    setShowStatusSelected(undefined);
    filterHandler('status', []);
  };

  const handleClearCountryCode = () => {
    setShowCountryCodesSelected(undefined);
    filterHandler('countryCodes', []);
  };

  const handleClearAll = () => {
    handleClearStatus();
    handleClearCountryCode();
  };

  const handleChangeCountry = (val?: string[]) => {
    filterHandler('countryCodes', val);
    const getData = map(val, (id) => find(countries, { value: id }))
      .map((i) => i?.label)
      .join(', ');
    setShowCountryCodesSelected(getData);
  };

  const countries = useQuery({
    queryKey: ['getCountries'],
    queryFn: getAllCountries,
  }).data?.data.map((el) => ({
    value: el.code,
    label: el.name,
  }));

  return (
    <div>
      <div className="flex">
        <div className="w-[400px]">
          <Input
            size={40}
            onChange={handleSearch}
            placeholder={t('application.textSearch')}
            icon={<SvgIcon icon="search" />}
            hiddenClose
          />
        </div>
        <DropdownFilter
          icon={<SvgIcon icon="loading-checkmark-status-circle" width={16} height={16} className="text-ic-ink-6s" />}
          name={t('status')}
          placement="bottom-start"
          options={statusOptions}
          size={'40'}
          searchable
          multiple
          allowSelectAll
          value={params.status ?? []}
          onChange={handleChangeStatus}
          className="ml-3 w-[200px]"
        />
        <DropdownFilter
          icon={<SvgIcon icon="loading-checkmark-status-circle" width={16} height={16} className="text-ic-ink-6s" />}
          name={t('countryCode')}
          placement="bottom-start"
          options={countries ?? []}
          size={'40'}
          searchable
          multiple
          allowSelectAll
          value={params.countryCodes ?? []}
          onChange={handleChangeCountry}
          className="ml-3 w-[200px]"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {showStatusSelected && (
          <div className="inline-flex items-center bg-ic-ink-1s rounded-md p-1  text-xs font-normal leading-4 text-ic-ink-6s">
            <span>{`Status: ${showStatusSelected}`}</span>
            <button onClick={handleClearStatus} className="ml-1">
              <SvgIcon icon="close" width={13} height={13} />
            </button>
          </div>
        )}{' '}
        {showCountryCodesSelected && (
          <div className="inline-flex items-center bg-ic-ink-1s rounded-md p-1  text-xs font-normal leading-4 text-ic-ink-6s">
            <span>{`Countries: ${showCountryCodesSelected}`}</span>
            <button onClick={handleClearCountryCode} className="ml-1">
              <SvgIcon icon="close" width={13} height={13} />
            </button>
          </div>
        )}
        {showStatusSelected && (
          <Button className="text-ic-primary-6s cursor-pointer ml-2" variant="text" onClick={handleClearAll}>
            {t('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
};
