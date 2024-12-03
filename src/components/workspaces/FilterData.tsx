import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { Input } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';

import { WorkspaceManagementRequest } from '@/types/user-management/workspace';
import SvgIcon from '../commons/SvgIcon';

interface Props {
  params: WorkspaceManagementRequest;
  setParams: Dispatch<SetStateAction<WorkspaceManagementRequest>>;
}
export const FilterData = ({ setParams }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);

  const filterHandler: SetStatePropertyFunc<WorkspaceManagementRequest> = (propertyName, value) => {
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
      </div>
    </div>
  );
};
