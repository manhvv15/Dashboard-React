import { useMemo } from 'react';

import { Button, DataGrid, GridColumn, Switch } from '@ichiba/ichiba-core-ui';
import { useTranslation } from 'react-i18next';

import { LocaleNamespace } from '@/constants/enums/common';

import AccessibleComponent from '@/components/commons/AccessibleComponent';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import { useApp } from '@/hooks/use-app';
import Delete from '@/public/static/icons/delete.svg';
import Edit from '@/public/static/icons/edit.svg';
import { EProxyStatus, EProxyUsingFor, IProxyWorkspace } from '@/types/pim/proxy';

interface props {
  data?: IProxyWorkspace[];
  handleChangeStatus: (data: IProxyWorkspace) => void;
  handleCheckProxyState: (data: IProxyWorkspace) => void;
  isLoadingCheckProxy: boolean;
  onDelete: (data: IProxyWorkspace) => void;
  onEdit: (data: IProxyWorkspace) => void;
}
const ProxyTable = ({
  data,
  handleChangeStatus,
  handleCheckProxyState,
  isLoadingCheckProxy,
  onDelete,
  onEdit,
}: props) => {
  const { t: pim } = useTranslation(LocaleNamespace.Pim);
  const { showToast } = useApp();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      type: 'success',
      summary: pim('copySuccess'),
    });
  };
  const dataGridColumn: GridColumn<IProxyWorkspace>[] = useMemo(
    () => [
      {
        headerName: pim('proxyAndSetting.manageProxy.ip'),
        cellRenderer: (params) => {
          return (
            <p className="cursor-pointer" onClick={() => copyToClipboard(params.data.ip)}>
              {params.data.ip}
            </p>
          );
        },
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.port'),
        cellRenderer: (params) => {
          return (
            <p className="cursor-pointer" onClick={() => copyToClipboard(params.data.port)}>
              {params.data.port}
            </p>
          );
        },
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.username'),
        cellRenderer: (params) => {
          return (
            <p className="cursor-pointer" onClick={() => copyToClipboard(params.data.username)}>
              {params.data.username}
            </p>
          );
        },
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.usingFor'),
        cellRenderer: (params) => {
          return (
            <p>
              {params.data.usingFor === EProxyUsingFor.Crawler
                ? pim('proxyAndSetting.manageProxy.crawl')
                : params.data.usingFor === EProxyUsingFor.Bidding
                  ? pim('proxyAndSetting.manageProxy.bidding')
                  : pim('proxyAndSetting.manageProxy.both')}
            </p>
          );
        },
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.usingFor'),
        cellRenderer: (params) => {
          return <p>{params.data.origin}</p>;
        },
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.status'),
        cellRenderer: (params) => {
          return (
            <Switch
              onClick={() => handleChangeStatus(params.data)}
              checked={params.data.status === EProxyStatus.Active}
            />
          );
        },
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.status'),
        cellRenderer: (params) => (
          <Button
            variant="outlined"
            id={params.data.ip}
            disabled={isLoadingCheckProxy}
            loading={isLoadingCheckProxy}
            onClick={() => handleCheckProxyState(params.data)}
          >
            {pim('proxyAndSetting.manageProxy.checkProxyState')}
          </Button>
        ),
      },
      {
        headerName: pim('proxyAndSetting.manageProxy.status'),
        flex: 1,
        align: 'left',
        cellRenderer: (params) => (
          <div className="flex w-full h-full">
            <AccessibleComponent object={OBJECTS.MANAGE_PROXY} action={ACTIONS.EDIT}>
              <div
                className="cursor-pointer border border-slate-300 flex justify-center rounded-lg w-10 h-10 p-2"
                onClick={() => {
                  onEdit(params.data);
                }}
              >
                <Edit width={24} height={24} />
              </div>
            </AccessibleComponent>

            <AccessibleComponent object={OBJECTS.MANAGE_PROXY} action={ACTIONS.DELETE}>
              <div
                className="cursor-pointer border border-slate-300 flex justify-center rounded-lg w-10 h-10 p-2 ml-2"
                onClick={() => onDelete(params.data)}
              >
                <Delete width={24} height={24} />
              </div>
            </AccessibleComponent>
          </div>
        ),
      },
    ],
    [pim],
  );
  return (
    <div className="h-full flex-1 my-3">
      <DataGrid
        rowData={data}
        rowKey="id"
        rowHeight={68}
        columnDefs={dataGridColumn}
        // noRowsOverlayComponent={() => (
        //   <NoDataTable>
        //     <p className="text-base font-medium leading-6 text-ic-ink-6s">{pim('proxyNoData')}</p>
        //   </NoDataTable>
        // )}
      ></DataGrid>
    </div>
  );
};
export default ProxyTable;
