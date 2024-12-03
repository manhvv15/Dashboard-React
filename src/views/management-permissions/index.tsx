import { useState } from 'react';

import { Tabs } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import ActionManagement from '../actions';
import ObjectManagement from '../object';
import PermissionManagement from '../permissions';

const ManagementPermissions = () => {
  const { t } = useTranslation(LocaleNamespace.Common);
  const tabs = [
    {
      label: t('permissions'),
      value: 'permissions',
    },
    {
      label: t('objects'),
      value: 'objects',
    },
    {
      label: t('action.actions'),
      value: 'actions',
    },
  ];

  const [tabActive, setTabActive] = useState('permissions');
  const onHandleChange = (tab: any) => {
    setTabActive(tab);
  };
  return (
    <>
      <div className="flex h-full flex-col">
        <Tabs items={tabs} onChange={onHandleChange} activeValue={tabActive} />
        {tabActive == 'permissions' && <PermissionManagement></PermissionManagement>}
        {tabActive == 'objects' && <ObjectManagement></ObjectManagement>}
        {tabActive == 'actions' && <ActionManagement></ActionManagement>}
      </div>
    </>
  );
};

export default ManagementPermissions;
