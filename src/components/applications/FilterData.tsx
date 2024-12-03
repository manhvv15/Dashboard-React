import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { Button, DropdownFilter, Input } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';

import { ApplicationManagementRequest, ApplicationStatusEnum } from '@/types/user-management/application';
import { find, map } from 'lodash';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  params: ApplicationManagementRequest;
  setParams: Dispatch<SetStateAction<ApplicationManagementRequest>>;
}
export const FilterData = ({ params, setParams }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const [showStatusSelected, setShowStatusSelected] = useState<string>();
  const statusOptions = [
    { value: ApplicationStatusEnum.Active, label: t('active') },
    { value: ApplicationStatusEnum.Deactivate, label: t('deactive') },
    { value: ApplicationStatusEnum.ComingSoon, label: t('comingSoon') },
  ];
  const filterHandler: SetStatePropertyFunc<ApplicationManagementRequest> = (propertyName, value) => {
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

  const handleClearAll = () => {
    handleClearStatus();
  };
  return (
    <div>
      <div className="flex">
        <div className="w-[600px]">
          <Input
            size={40}
            onChange={handleSearch}
            placeholder={t('application.textSearch')}
            icon={<SvgIcon icon="search" />}
            hiddenClose
          />
        </div>
        <div>
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
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {showStatusSelected && (
          <div className="inline-flex items-center bg-ic-ink-1s rounded-md p-1  text-xs font-normal leading-4 text-ic-ink-6s">
            <span>{`Status: ${showStatusSelected}`}</span>
            <button onClick={handleClearStatus} className="ml-1">
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
