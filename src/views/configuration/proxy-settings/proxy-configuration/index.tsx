/* eslint-disable no-nested-ternary */

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import ProxyConfigTable from '@/components/configuration/proxy/proxy-configuration/ProxyConfigTable';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { useApp } from '@/hooks/use-app';
import { deleteProxySourceWp, deleteProxyWorkspace, getProxySourceWorkspace } from '@/services/pim/proxy';
import { IProxySourceWorkspace } from '@/types/pim/proxy';
import { Button, LoadingOverlay } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddPopup from './AddPopup';
import DeletePopup from './DeletePopup';
import EditPopup from './EditPopup';

export enum IndexViewMode {
  Data,
  NoData,
  NotFound,
}
export default function ProxyConfigurationView() {
  const { t: pim } = useTranslation(LocaleNamespace.Pim);
  const { showToast } = useApp();
  const [viewMode, setViewMode] = useState<IndexViewMode>(IndexViewMode.NoData);

  const [edit, setEdit] = useState<IProxySourceWorkspace>();
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);

  const useDeleteProxyWorkspace = useMutation(deleteProxyWorkspace);

  const {
    data: proxySourceWpList,
    isLoading: isLoadingProxyList,
    refetch,
  } = useQuery({
    queryKey: ['getPagingProxySourceWp'],
    queryFn: () => {
      return getProxySourceWorkspace();
    },
    onSuccess: (response) => {
      const isNoData = !response?.data?.length;
      setViewMode(isNoData ? IndexViewMode.NoData : IndexViewMode.Data);
    },
  });

  const onCloseConfirmDelete = () => {
    setVisibleConfirmDelete(false);
    setEdit({} as IProxySourceWorkspace);
  };
  const useDeleteProxySourceWp = useMutation(deleteProxySourceWp);
  const handleDelete = () => {
    if (edit?.sourceId) {
      useDeleteProxySourceWp.mutate(edit.sourceId, {
        onSuccess() {
          refetch();
          setEdit({} as IProxySourceWorkspace);
          showToast({
            type: 'success',
            summary: pim('successfully'),
          });
          setVisibleConfirmDelete(false);
        },
        onError(err: any) {
          const { errorNormal } = err;
          if (errorNormal) {
            showToast({
              type: 'error',
              summary: pim(errorNormal),
            });
          }
        },
      });
    }
  };
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  function handleOpenAddProxy(): void {
    setVisibleAdd(true);
  }

  const onCloseAdd = () => {
    setVisibleAdd(false);
    refetch();
  };

  const onCloseEdit = () => {
    setVisibleEdit(false);
    refetch();
  };

  function onEditClick(data: IProxySourceWorkspace): void {
    setEdit(data);
    setVisibleEdit(true);
  }

  const onDeleteClick = (data: IProxySourceWorkspace) => {
    setEdit(data);
    setVisibleConfirmDelete(true);
  };

  return (
    <LayoutSection
      label={pim('proxyAndSetting.manageProxy.proxyConfiguration')}
      right={
        <AccessibleComponent object={OBJECTS.PROXY_CONFIGURATION} action={ACTIONS.CREATE}>
          <Button onClick={handleOpenAddProxy}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{pim('proxyAndSetting.proxyConfig.addNewConfig')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full p-2" isLoading={isLoadingProxyList}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          {viewMode === IndexViewMode.NotFound && <Nodata />}

          {viewMode === IndexViewMode.Data && (
            <ProxyConfigTable
              data={proxySourceWpList?.data || []}
              onDeleteClick={onDeleteClick}
              onEditClick={onEditClick}
            />
          )}
        </div>
      </LoadingOverlay>

      {visibleConfirmDelete && (
        <DeletePopup
          visibleConfirmDelete={visibleConfirmDelete}
          onCloseConfirmDelete={onCloseConfirmDelete}
          edit={edit}
          handleDelete={handleDelete}
          isDeleteLoading={useDeleteProxyWorkspace.isLoading}
        />
      )}

      {visibleAdd && <AddPopup visible={visibleAdd} onClose={onCloseAdd} refetch={refetch} />}

      {visibleEdit && <EditPopup visible={visibleEdit} onClose={onCloseEdit} currentItem={edit} refetch={refetch} />}
    </LayoutSection>
  );
}
