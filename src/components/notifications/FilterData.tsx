import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { Button, Input, DropdownFilter } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { find, map } from 'lodash';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';
import { getAllNotificationGroups } from '@/services/user-management/notifiation';
import { NotificationPagingRequest } from '@/types/user-management/notification';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';

import SvgIcon from '../commons/SvgIcon';

interface Props {
  params: NotificationPagingRequest;
  setParams: Dispatch<SetStateAction<NotificationPagingRequest>>;
}
export const FilterData = ({ params, setParams }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const [showNotificationGroupSelected, setShowNotificationGroupSelected] = useState<string>();
  const [showStatusSelected, setShowStatusSelected] = useState<string>();
  const filterHandler: SetStatePropertyFunc<NotificationPagingRequest> = (propertyName, value) => {
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

  const notificationGroups =
    useQuery({
      queryKey: ['getAllNotificationGroups'],
      queryFn: getAllNotificationGroups,
      retry: false,
    }).data?.data?.map((i) => ({ label: i.name, value: i.id })) ?? [];

  const handleChangeNotificationGroup = (val?: string[]) => {
    filterHandler('notificationGroupIds', val);
    const getData = map(val, (id) => find(notificationGroups, { value: id }))
      .map((i) => i?.label)
      .join(', ');
    setShowNotificationGroupSelected(getData);
  };

  const handleClearNotificationGroups = () => {
    filterHandler('notificationGroupIds', []);
    setShowNotificationGroupSelected(undefined);
  };

  const handleClearStatus = () => {
    setShowStatusSelected(undefined);
    filterHandler('status', null);
  };

  const handleClearAll = () => {
    handleClearNotificationGroups();
    handleClearStatus();
  };

  return (
    <div>
      <div className="flex">
        <div className="w-[600px]">
          <Input
            size={40}
            onChange={handleSearch}
            placeholder={t('Search with notification name, notification code')}
            icon={<SvgIcon icon="search" />}
            hiddenClose
          />
        </div>
        <div>
          <DropdownFilter
            icon={<SvgIcon icon="group-user" width={16} height={16} className="text-ic-ink-6s" />}
            name={t('Notification group')}
            placement="bottom-start"
            options={notificationGroups ?? []}
            size={'40'}
            searchable
            multiple
            allowSelectAll
            value={params.notificationGroupIds ?? []}
            onChange={handleChangeNotificationGroup}
            className="ml-3 w-[200px]"
          />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {showNotificationGroupSelected && (
          <div className="inline-flex items-center bg-ic-ink-1s rounded-md p-1  text-xs font-normal leading-4 text-ic-ink-6s">
            <span>{`Groups: ${showNotificationGroupSelected}`}</span>
            <button onClick={handleClearNotificationGroups} className="ml-1">
              <SvgIcon icon="close" width={13} height={13} />
            </button>
          </div>
        )}

        {showStatusSelected && (
          <div className="inline-flex items-center bg-ic-ink-1s rounded-md p-1  text-xs font-normal leading-4 text-ic-ink-6s">
            <span>{`Status: ${showStatusSelected}`}</span>
            <button onClick={handleClearStatus} className="ml-1">
              <SvgIcon icon="close" width={13} height={13} />
            </button>
          </div>
        )}
        {(showNotificationGroupSelected || showStatusSelected) && (
          <Button className="text-ic-primary-6s cursor-pointer ml-2" variant="text" onClick={handleClearAll}>
            {t('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
};
