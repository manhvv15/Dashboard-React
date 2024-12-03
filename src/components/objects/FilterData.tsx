import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { Button, Input, DropdownFilter } from '@ichiba/ichiba-core-ui';
import { find, map } from 'lodash';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { useGetApplication } from '@/hooks-query/application';
import { PermissionPagingRequest } from '@/types/user-management/permission';
import { RolePagingRequest } from '@/types/user-management/role';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';

import SvgIcon from '../commons/SvgIcon';

interface Props {
  params: PermissionPagingRequest;
  setParams: Dispatch<SetStateAction<PermissionPagingRequest>>;
}
export const FilterData = ({ params, setParams }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const [showApplicationSelected, setShowApplicationSelected] = useState<string>();
  const [showStatusSelected, setShowStatusSelected] = useState<string>();
  const filterHandler: SetStatePropertyFunc<RolePagingRequest> = (propertyName, value) => {
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

  const applications =
    useGetApplication({
      isSystem: false,
    }).data?.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];

  const handleChangeApplication = (val?: string[]) => {
    filterHandler('applicationIds', val);
    const getData = map(val, (id) => find(applications, { value: id }))
      .map((i) => i?.label)
      .join(', ');
    setShowApplicationSelected(getData);
  };

  const handleClearApplications = () => {
    filterHandler('applicationIds', []);
    setShowApplicationSelected(undefined);
  };

  const handleClearStatus = () => {
    setShowStatusSelected(undefined);
    filterHandler('status', []);
  };

  const handleClearAll = () => {
    handleClearApplications();
    handleClearStatus();
  };
  return (
    <div>
      <div className="flex">
        <div className="w-[600px]">
          <Input
            size={40}
            onChange={handleSearch}
            placeholder={t('role.textSearch')}
            icon={<SvgIcon icon="search" />}
            hiddenClose
          />
        </div>
        <div>
          <DropdownFilter
            icon={<SvgIcon icon="group-user" width={16} height={16} className="text-ic-ink-6s" />}
            name={t('application')}
            placement="bottom-start"
            options={applications ?? []}
            size={'40'}
            searchable
            multiple
            allowSelectAll
            value={params.applicationIds ?? []}
            onChange={handleChangeApplication}
            className="ml-3 w-[200px]"
          />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {showApplicationSelected && (
          <div className="inline-flex items-center bg-ic-ink-1s rounded-md p-1  text-xs font-normal leading-4 text-ic-ink-6s">
            <span>{`Applications: ${showApplicationSelected}`}</span>
            <button onClick={handleClearApplications} className="ml-1">
              <SvgIcon icon="close" width={13} height={13} />
            </button>
          </div>
        )}

        {(showApplicationSelected || showStatusSelected) && (
          <Button className="text-ic-primary-6s cursor-pointer ml-2" variant="text" onClick={handleClearAll}>
            {t('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
};
