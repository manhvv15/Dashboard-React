/* eslint-disable no-nested-ternary */

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import Nodata from '@/components/commons/Nodata';
import SvgIcon from '@/components/commons/SvgIcon';
import ProxyTable from '@/components/configuration/proxy/manage-proxy/ProxyTable';
import LayoutSection from '@/components/layouts/layout-section';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { useApp } from '@/hooks/use-app';
import { checkProxyStatus, deleteProxyWorkspace, getProxyWorkspace, updateProxyWorkspace } from '@/services/pim/proxy';
import { EProxyStatus, EProxyUsingFor, IProxyWorkspace, IProxyWorkspaceFilter } from '@/types/pim/proxy';
import { Button, LoadingOverlay, Pagination } from '@ichiba/ichiba-core-ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';
import AddPopup from './AddPopup';
import DeletePopup from './DeletePopup';
import EditPopup from './EditPopup';
import { FilterProxy } from './filters/FilterProxy';

export enum IndexViewMode {
  Data,
  NoData,
  NotFound,
}

const initialFilter: IProxyWorkspaceFilter = {
  keyword: undefined,
  pageIndex: 1,
  pageSize: 20,
};

export default function ManageProxyV() {
  const { t: pim } = useTranslation(LocaleNamespace.Pim);
  const { t: error } = useTranslation('error');
  const { showToast } = useApp();
  const [viewMode, setViewMode] = useState<IndexViewMode>(IndexViewMode.NoData);

  const [edit, setEdit] = useState<IProxyWorkspace>();
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);

  const [filterForm, setFilterForm] = useState<IProxyWorkspaceFilter>({
    ...initialFilter,
    pageIndex: 1,
    pageSize: 20,
  });

  const useDeleteProxyWorkspace = useMutation(deleteProxyWorkspace);

  const filterValueDebounce = useDebounce(filterForm, 400);

  const {
    data: proxyList,
    isLoading: isLoadingProxyList,
    refetch,
  } = useQuery({
    queryKey: ['getPagingProxyWorkspace', filterValueDebounce],
    queryFn: () => {
      return getProxyWorkspace({
        ...filterValueDebounce,
      });
    },
    onSuccess: (response) => {
      const isNoData = !response?.data.items?.length;
      setViewMode(isNoData ? IndexViewMode.NoData : IndexViewMode.Data);
    },
  });
  const onHandleChangePageSize = useCallback((value: any) => {
    setFilterForm((prev) => ({
      ...prev,
      pageIndex: 1,
      pageSize: Number(value) !== prev.pageSize ? Number(value) : prev.pageSize,
    }));
  }, []);

  // #endregion

  const onCloseEdit = () => {
    setVisibleEdit(false);
    refetch();
  };
  const onCloseConfirmDelete = () => {
    setVisibleConfirmDelete(false);
    setEdit({} as IProxyWorkspace);
  };

  const onDelete = (data: IProxyWorkspace) => {
    setEdit(data);
    setVisibleConfirmDelete(true);
  };

  const handleDelete = () => {
    if (edit?.id) {
      useDeleteProxyWorkspace.mutate(edit.id, {
        onSuccess() {
          refetch();
          setEdit({} as IProxyWorkspace);
          showToast({
            type: 'success',
            summary: error('successfully'),
          });
          setVisibleConfirmDelete(false);
        },
        onError(err: any) {
          const { errorNormal } = err;
          if (errorNormal) {
            showToast({
              type: 'error',
              summary: error(errorNormal),
            });
          }
        },
      });
    }
  };

  const updateProxyApi = useMutation({
    mutationFn: updateProxyWorkspace,
  });

  const checkProxyStatusApi = useMutation({
    mutationFn: checkProxyStatus,
    mutationKey: ['checkProxyStatus'],
  });
  function handleCheckProxyState(data: IProxyWorkspace) {
    checkProxyStatusApi.mutate(
      {
        ip: data.ip,
        port: data.port,
        username: data.username,
        password: data.password,
      },
      {
        onSuccess(data) {
          if (data.data) {
            showToast({
              type: 'success',
              summary: pim('proxyIsRunning'),
            });
          } else {
            showToast({
              type: 'error',
              summary: pim('proxyIsNotRunning'),
            });
          }
        },
        onError() {
          showToast({
            type: 'error',
            summary: pim('proxyIsNotRunning'),
          });
        },
      },
    );
  }

  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  function handleOpenAddProxy(): void {
    setVisibleAdd(true);
  }

  const queryClient = useQueryClient();

  const onCloseAdd = () => {
    setVisibleAdd(false);
    queryClient.invalidateQueries(['getPagingProxyWorkspace']);
  };

  const handlePageChange = (pageIndex: number) => {
    setFilterForm((prev) => ({ ...prev, pageIndex: pageIndex }));
  };

  const handleChangeStatus = (data: IProxyWorkspace) => {
    updateProxyApi.mutate(
      {
        ...data,
        status: data.status === EProxyStatus.Active ? EProxyStatus.DeActive : EProxyStatus.Active,
      },
      {
        onSuccess: () => {
          refetch();
          showToast({
            type: 'success',
            summary: pim('successfully'),
          });
        },
      },
    );
  };

  function handleEdit(data: IProxyWorkspace): void {
    setEdit(data);
    setVisibleEdit(true);
  }

  function onChangeSearchInput(keyword: string): void {
    setFilterForm((prevState) => ({
      ...prevState,
      keyword,
    }));
  }

  function handleChangeOrigin(value: string): void {
    setFilterForm((prevState) => ({
      ...prevState,
      origin: value,
    }));
  }

  function handleChangeSearchStatus(value: EProxyStatus): void {
    setFilterForm((prevState) => ({
      ...prevState,
      status: value,
    }));
  }

  function handleChangeUsingFor(value: EProxyUsingFor): void {
    setFilterForm((prevState) => ({
      ...prevState,
      usingFor: value,
    }));
  }

  return (
    <LayoutSection
      label={pim('manageProxy')}
      right={
        <AccessibleComponent object={OBJECTS.MANAGE_PROXY} action={ACTIONS.CREATE}>
          <Button onClick={handleOpenAddProxy}>
            <SvgIcon icon="plus" width={24} height={24} />
            <span className="ml-1">{pim('addProxy')}</span>
          </Button>
        </AccessibleComponent>
      }
    >
      <LoadingOverlay className="h-full w-full p-2" isLoading={isLoadingProxyList}>
        <div className="w-full h-full flex flex-col bg-ic-white-6s p-3  rounded-md">
          <FilterProxy
            searchFilter={filterForm}
            onChangeSearchInput={onChangeSearchInput}
            onHandleChangeOrigin={handleChangeOrigin}
            onHandleChangeStatus={handleChangeSearchStatus}
            onHandleChangeUsingFor={handleChangeUsingFor}
          />

          {viewMode === IndexViewMode.NotFound && <Nodata />}

          {viewMode === IndexViewMode.Data && (
            <ProxyTable
              data={proxyList?.data.items}
              handleChangeStatus={handleChangeStatus}
              handleCheckProxyState={handleCheckProxyState}
              isLoadingCheckProxy={checkProxyStatusApi.isLoading}
              onDelete={onDelete}
              onEdit={handleEdit}
            />
          )}

          {visibleConfirmDelete && (
            <DeletePopup
              visibleConfirmDelete={visibleConfirmDelete}
              onCloseConfirmDelete={onCloseConfirmDelete}
              edit={edit}
              handleDelete={handleDelete}
              isDeleteLoading={useDeleteProxyWorkspace.isLoading}
            />
          )}

          {!!proxyList?.data?.items?.length && (
            <Pagination
              totalPage={proxyList?.data.totalPages}
              pageSize={filterForm.pageSize}
              setChangePage={handlePageChange}
              setChangePageSize={onHandleChangePageSize}
              currentPage={proxyList?.data.pageIndex || 1}
              totalRecords={proxyList?.data?.totalRecords}
            />
          )}
        </div>
      </LoadingOverlay>

      {visibleAdd && <AddPopup visible={visibleAdd} onClose={onCloseAdd} refetch={refetch} />}
      {visibleEdit && <EditPopup refetch={refetch} visible={visibleEdit} onClose={onCloseEdit} id={edit?.id} />}
    </LayoutSection>
  );
}
