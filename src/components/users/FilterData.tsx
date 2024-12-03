import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Button, DropdownFilter, Input } from '@ichiba/ichiba-core-ui';
import { useQuery } from '@tanstack/react-query';
import { find, map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { LocaleNamespace } from '@/constants/enums/common';
import { getOrganizationPaging } from '@/services/user-management/organization';
import { getRolePaging } from '@/services/user-management/role';
import { RoleStatusEnum } from '@/types/user-management/role';
import { UserPagingRequest } from '@/types/user-management/user';
import { SetStatePropertyFunc, onlySpaces } from '@/utils/common';

import SvgIcon from '../commons/SvgIcon';

interface Props {
  params: UserPagingRequest;
  setParams: Dispatch<SetStateAction<UserPagingRequest>>;
}
export const FilterData = ({ params, setParams }: Props) => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const [showOrganizationSelected, setShowOrganizationSelected] = useState<string>();
  const [showRoleSelected, setShowRoleSelected] = useState<string>();
  const [showStatusSelected, setShowStatusSelected] = useState<string>();
  const [searchParams] = useSearchParams();

  const statusOptions = [
    { value: 0, label: t('active') },
    { value: 1, label: t('deactive') },
    { value: 2, label: t('invited') },
  ];

  const filterHandler: SetStatePropertyFunc<UserPagingRequest> = (propertyName, value) => {
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

  const { data: roles, isLoading } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () =>
      getRolePaging({
        pageNumber: 0,
        pageSize: 1000,
        workspaceId: '',
        applicationIds: [],
        status: [RoleStatusEnum.Active],
        keyword: '',
      }),
    select: (response) => {
      return response.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];
    },
  });

  const organizations = useQuery({
    queryKey: ['getOrganizations'],
    queryFn: () => getOrganizationPaging({ pageNumber: 0, pageSize: 1000, workspaceId: '' }),
    select: (response) => {
      return response.data?.items.map((i) => ({ label: i.name, value: i.id })) ?? [];
    },
  }).data;

  const handleChangeOrganization = (val?: string[]) => {
    filterHandler('organizationIds', val);
    const getData = map(val, (id) => find(organizations, { value: id }))
      .map((i) => i?.label)
      .join(', ');
    setShowOrganizationSelected(getData);
  };

  const handleChangeRole = (val?: string[]) => {
    filterHandler('roleIds', val);
    const getData = map(val, (id) => find(roles, { value: id }))
      .map((i) => i?.label)
      .join(', ');
    setShowRoleSelected(getData);
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const roleId = searchParams.get('roleId');
    const orgId = searchParams.get('organizationId');
    if (roleId) {
      handleChangeRole([roleId]);
    }
    if (orgId) {
      handleChangeOrganization([orgId]);
    }
  }, [searchParams, isLoading]);

  const handleChangeStatus = (val?: number[]) => {
    filterHandler('status', val);
    const getData = map(val, (id) => find(statusOptions, { value: id }))
      .map((i) => i?.label)
      .join(', ');
    setShowStatusSelected(getData);
  };

  const handleClearOrganizations = () => {
    filterHandler('organizationIds', []);
    setShowOrganizationSelected(undefined);
  };

  const handleClearRoles = () => {
    filterHandler('roleIds', []);
    setShowRoleSelected(undefined);
  };

  const handleClearStatus = () => {
    setShowStatusSelected(undefined);
    filterHandler('status', []);
  };

  const handleClearAll = () => {
    handleClearOrganizations();
    handleClearRoles();
    handleClearStatus();
  };
  return (
    <div>
      <div className="flex">
        <div className="w-[600px]">
          <Input
            size={40}
            onChange={handleSearch}
            placeholder={t('user.textSearch')}
            icon={<SvgIcon icon="search" />}
            hiddenClose
          />
        </div>
        <DropdownFilter
          icon={<SvgIcon icon="user-profile" width={16} height={16} className="text-ic-ink-6s" />}
          name={t('groupRole')}
          placement="bottom-start"
          options={organizations ?? []}
          size={'40'}
          searchable
          multiple
          value={params.organizationIds ?? []}
          allowSelectAll
          onChange={handleChangeOrganization}
          className="ml-3 w-[200px]"
        />
        <DropdownFilter
          icon={<SvgIcon icon="menu-board-square" width={16} height={16} className="text-ic-ink-6s" />}
          name={t('applicationRole')}
          placement="bottom-start"
          options={roles ?? []}
          size={'40'}
          searchable
          multiple
          value={params.roleIds ?? []}
          allowSelectAll
          onChange={handleChangeRole}
          className="ml-3 w-[200px]"
        />
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
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {showOrganizationSelected && (
          <div className="inline-flex items-center bg-ic-ink-1s rounded-md p-1  text-xs font-normal leading-4 text-ic-ink-6s">
            <span>{`Group role: ${showOrganizationSelected}`}</span>
            <button onClick={handleClearOrganizations} className="ml-1">
              <SvgIcon icon="close" width={13} height={13} />
            </button>
          </div>
        )}

        {showRoleSelected && (
          <div className="inline-flex items-center bg-ic-ink-1s rounded-md p-1  text-xs font-normal leading-4 text-ic-ink-6s">
            <span>{`Roles: ${showRoleSelected}`}</span>
            <button onClick={handleClearRoles} className="ml-1">
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

        {(showOrganizationSelected || showStatusSelected || showRoleSelected) && (
          <Button className="text-ic-primary-6s cursor-pointer ml-2" variant="text" onClick={handleClearAll}>
            {t('clearAll')}
          </Button>
        )}
      </div>
    </div>
  );
};
